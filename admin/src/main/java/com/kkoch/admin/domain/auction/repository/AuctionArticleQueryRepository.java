package com.kkoch.admin.domain.auction.repository;

import com.kkoch.admin.api.controller.auction.response.AuctionArticlePeriodSearchResponse;
import com.kkoch.admin.api.controller.auction.response.AuctionArticlesForAdminResponse;
import com.kkoch.admin.api.controller.auction.response.AuctionArticlesResponse;
import com.kkoch.admin.api.controller.trade.response.SuccessfulBid;
import com.kkoch.admin.api.controller.trade.response.TradeResponse;
import com.kkoch.admin.domain.auction.repository.dto.AuctionArticlePeriodSearchCond;
import com.kkoch.admin.domain.auction.repository.dto.AuctionArticleSearchForAdminCond;
import com.kkoch.admin.domain.plant.QCategory;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

import static com.kkoch.admin.domain.auction.QAuction.auction;
import static com.kkoch.admin.domain.auction.QAuctionArticle.auctionArticle;
import static com.kkoch.admin.domain.plant.QPlant.plant;
import static com.kkoch.admin.domain.trade.QTrade.trade;
import static com.querydsl.core.types.Projections.constructor;
import static org.springframework.util.StringUtils.hasText;

@Repository
public class AuctionArticleQueryRepository {

    private final JPAQueryFactory queryFactory;

    public AuctionArticleQueryRepository(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
    }

    /* 경매품 목록조회(기간별 조회) */
    public List<AuctionArticlePeriodSearchResponse> getAuctionArticleListForPeriodSearch(AuctionArticlePeriodSearchCond cond, Pageable pageable) {
        QCategory code = new QCategory("code");
        QCategory type = new QCategory("type");
        QCategory name = new QCategory("name");

        return getAuctionArticleByPeriodSearchCond(cond, code, name, type)
//                .limit(pageable.getPageSize())
//                .offset(pageable.getOffset())
                .fetch();
    }


    /* 경매품 목록조회(경매시 목록 출력용) */
    public List<AuctionArticlesResponse> getAuctionArticleList(Long auctionId) {
        QCategory code = new QCategory("code");
        QCategory type = new QCategory("type");
        QCategory name = new QCategory("name");

        return queryFactory.select(constructor(AuctionArticlesResponse.class,
                        auctionArticle.id,
                        auctionArticle.auctionNumber,
                        auctionArticle.plant.id,
                        auctionArticle.plant.code.name,
                        auctionArticle.plant.type.name,
                        auctionArticle.plant.name.name,
                        auctionArticle.count,
                        auctionArticle.startPrice,
                        auctionArticle.grade,
                        auctionArticle.region,
                        auctionArticle.shipper))
                .from(auctionArticle)
                .join(auctionArticle.plant, plant)
                .join(plant.code, code)
                .join(plant.type, type)
                .join(plant.name, name)
                .join(auctionArticle.auction, auction)
                .on(auctionArticle.auction.id.eq(auctionId))
                .orderBy(auctionArticle.auctionNumber.asc())
                .fetch();
    }

    /* 경매품 목록조회(관계자용 전체 조회) */
    public List<AuctionArticlesForAdminResponse> getAuctionArticleListForAdmin(AuctionArticleSearchForAdminCond cond) {
        QCategory code = new QCategory("code");
        QCategory type = new QCategory("type");
        QCategory name = new QCategory("name");

        return queryFactory.select(constructor(AuctionArticlesForAdminResponse.class,
                        auctionArticle.plant.code.name,
                        auctionArticle.plant.type.name,
                        auctionArticle.plant.name.name,
                        auctionArticle.grade,
                        auctionArticle.count,
                        auctionArticle.bidPrice,
                        auctionArticle.bidTime,
                        auctionArticle.region,
                        auctionArticle.shipper))
                .from(auctionArticle)
                .join(auctionArticle.plant, plant)
                .join(plant.code, code)
                .join(plant.type, type)
                .join(plant.name, name)
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

    public List<TradeResponse> findByTradeIds(String memberKey, Pageable pageable) {
        QCategory type = new QCategory("type");
        QCategory name = new QCategory("name");

        List<Long> ids = queryFactory
            .select(auctionArticle.id)
            .from(auctionArticle)
            .join(auctionArticle.trade, trade)
            .where(trade.memberKey.eq(memberKey))
            .orderBy(auctionArticle.bidTime.desc())
            .limit(pageable.getPageSize())
            .offset(pageable.getOffset())
            .fetch();

        if (CollectionUtils.isEmpty(ids)) {
            return new ArrayList<>();
        }

        return queryFactory
            .select(constructor(TradeResponse.class,
                auctionArticle.plant.type.name,
                auctionArticle.plant.name.name,
                auctionArticle.grade,
                auctionArticle.count,
                auctionArticle.bidPrice,
                auctionArticle.bidTime,
                auctionArticle.region
            ))
            .from(auctionArticle)
            .join(auctionArticle.plant, plant)
            .join(plant.type, type)
            .join(plant.name, name)
            .where(auctionArticle.id.in(ids))
            .orderBy(auctionArticle.bidTime.desc())
            .fetch();
    }

    public long getTotalCountForTrade(String memberKey) {
        return queryFactory
            .select(auctionArticle.id)
            .from(auctionArticle)
            .join(auctionArticle.trade, trade)
            .where(auctionArticle.trade.memberKey.eq(memberKey))
            .fetch()
            .size();
    }

    public List<SuccessfulBid> findByTradeId(Long tradeId) {
        QCategory code = new QCategory("code");
        QCategory type = new QCategory("type");
        QCategory name = new QCategory("name");
        return queryFactory
                .select(constructor(SuccessfulBid.class,
                        auctionArticle.plant.code.name,
                        auctionArticle.plant.type.name,
                        auctionArticle.plant.name.name,
                        auctionArticle.grade,
                        auctionArticle.count,
                        auctionArticle.bidPrice,
                        auctionArticle.bidTime,
                        auctionArticle.region
                ))
                .from(auctionArticle)
                .join(auctionArticle.plant, plant)
                .join(plant.code, code)
                .join(plant.type, type)
                .join(plant.name, name)
                .where(auctionArticle.trade.id.eq(tradeId))
                .fetch();
    }

    public int getAuctionArticleCount(Long auctionId) {
        return queryFactory.select(auctionArticle.id)
                .from(auctionArticle)
                .where(auctionArticle.auction.id.eq(auctionId))
                .fetch()
                .size();
    }

    public int getTotalCountForPeriod(AuctionArticlePeriodSearchCond cond) {
        QCategory code = new QCategory("code");
        QCategory type = new QCategory("type");
        QCategory name = new QCategory("name");
        return getAuctionArticleByPeriodSearchCond(cond, code, type, name)
                .fetch()
                .size();
    }

    private JPAQuery<AuctionArticlePeriodSearchResponse> getAuctionArticleByPeriodSearchCond(AuctionArticlePeriodSearchCond cond, QCategory code, QCategory type, QCategory name) {
        return queryFactory.select(constructor(AuctionArticlePeriodSearchResponse.class,
                        auctionArticle.plant.code.name,
                        auctionArticle.plant.type.name,
                        auctionArticle.plant.name.name,
                        auctionArticle.grade,
                        auctionArticle.count,
                        auctionArticle.bidPrice,
                        auctionArticle.bidTime,
                        auctionArticle.region))
                .from(auctionArticle)
                .join(auctionArticle.plant, plant)
                .join(plant.code, code)
                .join(plant.type, type)
                .join(plant.name, name)
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
