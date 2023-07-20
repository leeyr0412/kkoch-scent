package com.kkoch.user.domain.reservation;

import com.kkoch.user.domain.TimeBaseEntity;
import com.kkoch.user.domain.member.Member;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "reservation")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)

public class Reservation extends TimeBaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id", updatable = false, nullable = false)
    private Long id;

    private int count;
    private int price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", updatable = false, nullable = false)
    private Member member;

    private Long plantId;

    @Builder
    private Reservation(int count, int price, Member memeber, Long plantId) {
        this.count = count;
        this.price = price;
        this.member = member;
        this.plantId = plantId;
    }
}
