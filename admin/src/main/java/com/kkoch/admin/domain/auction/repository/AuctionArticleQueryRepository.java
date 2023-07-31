package com.kkoch.admin.domain.auction.repository;

import com.kkoch.admin.api.controller.auction.response.AuctionArticleForMemberResponse;
import com.kkoch.admin.api.controller.auction.response.AuctionArticlesResponse;
import com.kkoch.admin.api.controller.trade.response.SuccessfulBid;
import com.kkoch.admin.domain.auction.repository.dto.AuctionArticleSearchCond;
import com.kkoch.admin.domain.auction.repository.dto.AuctionArticleSearchForAdminCond;
import com.kkoch.admin.domain.plant.QCategory;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import java.util.List;

import static com.kkoch.admin.domain.auction.QAuctionArticle.*;
import static com.kkoch.admin.domain.plant.QPlant.*;
import static org.springframework.util.StringUtils.*;

@Repository
public class AuctionArticleQueryRepository {

    private final JPAQueryFactory queryFactory;

    public AuctionArticleQueryRepository(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
    }

    public List<SuccessfulBid> findByTradeId(Long tradeId) {
        QCategory code = new QCategory("code");
        QCategory name = new QCategory("name");
        QCategory type = new QCategory("type");
        return queryFactory
                .select(Projections.constructor(SuccessfulBid.class,
                        auctionArticle.plant.code.name,
                        auctionArticle.plant.name.name,
                        auctionArticle.plant.type.name,
                        auctionArticle.grade,
                        auctionArticle.count,
                        auctionArticle.bidPrice,
                        auctionArticle.bidTime,
                        auctionArticle.region
                ))
                .from(auctionArticle)
                .join(auctionArticle.plant, plant)
                .join(plant.code, code)
                .join(plant.name, name)
                .join(plant.type, type)
                .where(auctionArticle.trade.id.eq(tradeId))
                .fetch();
    }

    public int getAuctionArticle(Long auctionId) {
        return queryFactory.select(auctionArticle.id)
                .from(auctionArticle)
                .where(auctionArticle.auction.id.eq(auctionId))
                .fetch()
                .size();
    }

    public List<AuctionArticlesResponse> getAuctionArticleListForAdmin(AuctionArticleSearchForAdminCond cond) {
        QCategory code = new QCategory("code");
        QCategory name = new QCategory("name");
        QCategory type = new QCategory("type");

        return queryFactory.select(Projections.constructor(AuctionArticlesResponse.class,
                        auctionArticle.plant.code.name,
                        auctionArticle.plant.name.name,
                        auctionArticle.plant.type.name,
                        auctionArticle.grade,
                        auctionArticle.count,
                        auctionArticle.bidPrice,
                        auctionArticle.bidTime,
                        auctionArticle.region,
                        auctionArticle.shipper))
                .from(auctionArticle)
                .join(auctionArticle.plant, plant)
                .join(plant.code, code)
                .join(plant.name, name)
                .join(plant.type, type)
                .where(
                        auctionArticle.plant.code.name.eq(cond.getCode()),
                        auctionArticle.bidTime.between(cond.getStartDateTime(), cond.getEndDateTime()),
                        eqPlantName(cond.getName()),
                        eqPlantType(cond.getType()),
                        eqAuctionRegion(cond.getRegion()),
                        eqShipper(cond.getShipper())
                )
                .fetch();
    }

    public List<AuctionArticleForMemberResponse> getAuctionArticleListForMember(AuctionArticleSearchCond cond, Pageable pageable) {
        QCategory code = new QCategory("code");
        QCategory name = new QCategory("name");
        QCategory type = new QCategory("type");

        return getAuctionArticleByCond(cond, code, name, type)
                .limit(pageable.getPageSize())
                .offset(pageable.getOffset())
                .fetch();
    }

    public int getTotalCount(AuctionArticleSearchCond cond) {
        QCategory code = new QCategory("code");
        QCategory name = new QCategory("name");
        QCategory type = new QCategory("type");
        return getAuctionArticleByCond(cond, code, name, type)
                .fetch()
                .size();
    }

    private JPAQuery<AuctionArticleForMemberResponse> getAuctionArticleByCond(AuctionArticleSearchCond cond, QCategory code, QCategory name, QCategory type) {
        return queryFactory.select(Projections.constructor(AuctionArticleForMemberResponse.class,
                        auctionArticle.plant.code.name,
                        auctionArticle.plant.name.name,
                        auctionArticle.plant.type.name,
                        auctionArticle.grade,
                        auctionArticle.count,
                        auctionArticle.bidPrice,
                        auctionArticle.bidTime,
                        auctionArticle.region))
                .from(auctionArticle)
                .join(auctionArticle.plant, plant)
                .join(plant.code, code)
                .join(plant.name, name)
                .join(plant.type, type)
                .where(auctionArticle.bidPrice.gt(0),
                        auctionArticle.plant.code.name.eq(cond.getCode()),
                        auctionArticle.bidTime.between(cond.getStartDateTime(), cond.getEndDateTime()),
                        eqPlantName(cond.getName()),
                        eqPlantType(cond.getType()),
                        eqAuctionRegion(cond.getRegion())
                );
    }

    private BooleanExpression eqAuctionRegion(String region) {
        return hasText(region) ? auctionArticle.region.eq(region) : null;
    }

    private BooleanExpression eqPlantType(String type) {
        return hasText(type) ? auctionArticle.plant.type.name.eq(type) : null;
    }

    private BooleanExpression eqPlantName(String name) {
        return hasText(name) ? auctionArticle.plant.name.name.eq(name) : null;
    }

    private BooleanExpression eqShipper(String shipper) {
        return hasText(shipper) ? auctionArticle.shipper.eq(shipper) : null;
    }

}
