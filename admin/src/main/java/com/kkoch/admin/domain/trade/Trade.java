package com.kkoch.admin.domain.trade;

import com.kkoch.admin.domain.TimeBaseEntity;
import com.kkoch.admin.domain.auction.AuctionArticle;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Trade extends TimeBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trade_id")
    private Long id;

    @Column(nullable = false)
    private int totalPrice;

    @Column(nullable = false)
    private LocalDateTime tradeDate;

    @Column(nullable = false)
    private boolean pickupStatus;

    @Column(nullable = false)
    private boolean active;

    private Long memberId;

    @OneToMany(mappedBy = "trade", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AuctionArticle> articles = new ArrayList<>();

    @Builder
    private Trade(Long id, int totalPrice, LocalDateTime tradeDate, boolean pickupStatus, boolean active, Long memberId, List<AuctionArticle> articles) {
        this.id = id;
        this.totalPrice = totalPrice;
        this.tradeDate = tradeDate;
        this.pickupStatus = pickupStatus;
        this.active = active;
        this.memberId = memberId;
        this.articles = articles;
    }

    //== 연관관계 편의 메서드 ==//
    public static Trade createTrade(int totalPrice, Long memberId, List<AuctionArticle> auctionArticles) {
        Trade trade = Trade.builder()
                .totalPrice(totalPrice)
                .tradeDate(LocalDateTime.now())
                .pickupStatus(false)
                .active(true)
                .memberId(memberId)
                .articles(auctionArticles)
                .build();

        auctionArticles.forEach(auctionArticle -> auctionArticle.createTrade(trade));

        return trade;
    }

    //== 비즈니스 로직 ==//
    public void pickup() {
        if (this.pickupStatus) {
            throw new IllegalArgumentException("이미 픽업한 상품입니다.");
        }
        this.pickupStatus = true;
    }
}
