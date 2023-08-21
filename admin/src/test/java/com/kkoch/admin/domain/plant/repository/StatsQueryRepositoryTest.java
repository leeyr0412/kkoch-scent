package com.kkoch.admin.domain.plant.repository;

import com.kkoch.admin.IntegrationTestSupport;
import com.kkoch.admin.api.controller.stats.response.StatsResponse;
import com.kkoch.admin.api.service.stats.dto.AuctionArticleForStatsDto;
import com.kkoch.admin.domain.Grade;
import com.kkoch.admin.domain.auction.AuctionArticle;
import com.kkoch.admin.domain.auction.repository.AuctionArticleRepository;
import com.kkoch.admin.domain.auction.repository.AuctionRepository;
import com.kkoch.admin.domain.plant.Category;
import com.kkoch.admin.domain.plant.Plant;
import com.kkoch.admin.domain.plant.Stats;
import com.kkoch.admin.domain.plant.repository.dto.StatsSearchCond;
import com.kkoch.admin.domain.trade.Trade;
import com.kkoch.admin.domain.trade.repository.TradeRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.groups.Tuple.tuple;


@Transactional
class StatsQueryRepositoryTest extends IntegrationTestSupport {

    @Autowired
    StatsQueryRepository statsQueryRepository;

    @Autowired
    StatsRepository statsRepository;

    @Autowired
    AuctionArticleRepository auctionArticleRepository;

    @Autowired
    AuctionRepository auctionRepository;

    @Autowired
    TradeRepository tradeRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    PlantRepository plantRepository;

    @DisplayName("현재 시간부터 현재시간 12시간 전까지의 낙찰된 경매품을 조회한다.")
    @Test
    void getAuctionArticleByCond() throws Exception {
        //given
        Category code = createCategory("절화", null);
        Category name = createCategory("장미(스탠다드)", code);
        Category type1 = createCategory("하젤", name);
        Category type2 = createCategory("클레라", name);

        Plant plant1 = createPlant(code, name, type1);
        Plant plant2 = createPlant(code, name, type2);

        Trade trade = createTrade();

        AuctionArticle auctionArticle1 = createAuctionArticle("00001", LocalDateTime.now().minusHours(11), Grade.SUPER, plant1, trade);
        AuctionArticle auctionArticle2 = createAuctionArticle("00002", LocalDateTime.now().minusHours(10), Grade.SUPER, plant1, trade);
        AuctionArticle auctionArticle3 = createAuctionArticle("00003", LocalDateTime.now().minusHours(13), Grade.ADVANCED, plant1, trade);
        AuctionArticle auctionArticle4 = createAuctionArticle("00004", LocalDateTime.now().minusHours(13), Grade.SUPER, plant2, trade);
        AuctionArticle auctionArticle5 = createAuctionArticle("00005", LocalDateTime.now().minusHours(11), Grade.ADVANCED, plant2, trade);

        //when
        List<AuctionArticleForStatsDto> responses = statsQueryRepository.findAuctionArticleByTime();

        //then
        assertThat(responses).hasSize(3)
                .extracting("plantId", "grade", "count", "bidPrice")
                .containsExactlyInAnyOrder(
                        tuple(auctionArticle1.getPlant().getId(), auctionArticle1.getGrade(), auctionArticle1.getCount(), auctionArticle1.getBidPrice()),
                        tuple(auctionArticle2.getPlant().getId(), auctionArticle2.getGrade(), auctionArticle2.getCount(), auctionArticle2.getBidPrice()),
                        tuple(auctionArticle5.getPlant().getId(), auctionArticle5.getGrade(), auctionArticle5.getCount(), auctionArticle5.getBidPrice()));

    }

    @DisplayName("사용자는 기간(1일, 7일, 30일)을 선택하여 낙찰 통계를 조회할 수 있다.")
    @Test
    void getStatsByPeriod() throws Exception {
        //given
        Category code = createCategory("절화", null);
        Category type = createCategory("장미(스탠다드)", code);
        Category name1 = createCategory("하젤", type);
        Category name2 = createCategory("클레라", type);

        Plant plant1 = createPlant(code, type, name1);
        Plant plant2 = createPlant(code, type, name2);
        Stats stats1 = createStats(3000, 5000, 2000, Grade.SUPER, 40, plant1);
        Stats stats2 = createStats(4000, 4000, 4000, Grade.SUPER, 30, plant1);
        Stats stats3 = createStats(2000, 2500, 1000, Grade.NORMAL, 20, plant1);
        Stats stats4 = createStats(1000, 1000, 1000, Grade.NORMAL, 30, plant2);

        ReflectionTestUtils.setField(stats1, "createdDate", LocalDateTime.now().minusDays(8));

        StatsSearchCond statsSearchCond = StatsSearchCond.builder()
                .type(type.getName())
                .name(name1.getName())
                .searchDay(7)
                .build();

        //when
        List<StatsResponse> responses = statsQueryRepository.findByCond(statsSearchCond);

        //then
        assertThat(responses).hasSize(0);
    }

    private Stats createStats(int avg, int max, int min, Grade grade, int total, Plant plant) {
        Stats stats = Stats.builder()
                .priceAvg(avg)
                .priceMax(max)
                .priceMin(min)
                .grade(grade)
                .count(total)
                .plant(plant)
                .build();

        return statsRepository.save(stats);
    }


    private Category createCategory(String name, Category parent) {
        Category category = Category.builder()
                .name(name)
                .active(true)
                .parent(parent)
                .build();
        return categoryRepository.save(category);
    }

    private Plant createPlant(Category code, Category name, Category type) {
        Plant plant = Plant.builder()
                .active(true)
                .code(code)
                .name(name)
                .type(type)
                .build();
        return plantRepository.save(plant);
    }

    private Trade createTrade() {
        Trade trade = Trade.builder()
                .totalPrice(9000)
                .tradeTime(LocalDate.of(2023, 7, 11).atStartOfDay())
                .pickupStatus(false)
                .active(true)
                .memberKey("memberKey")
                .build();
        return tradeRepository.save(trade);
    }

    private AuctionArticle createAuctionArticle(String auctionNumber, LocalDateTime bidTime, Grade grade, Plant plant, Trade trade) {
        AuctionArticle auctionArticle = AuctionArticle.builder()
                .auctionNumber(auctionNumber)
                .grade(grade)
                .count(10)
                .bidPrice(3000)
                .bidTime(bidTime)
                .region("광주")
                .shipper("김싸피")
                .startPrice(5000)
                .plant(plant)
                .trade(trade)
                .build();
        return auctionArticleRepository.save(auctionArticle);
    }

}