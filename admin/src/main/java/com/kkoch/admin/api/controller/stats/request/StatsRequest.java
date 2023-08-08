package com.kkoch.admin.api.controller.stats.request;

import com.kkoch.admin.domain.plant.repository.StatsSearchCond;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@NoArgsConstructor
@Data
public class StatsRequest {

    @NotEmpty
    private String type;

    @NotEmpty
    private String name;

    @NotNull
    private Integer searchDay;

    @Builder
    private StatsRequest(String type, String name, Integer searchDay) {
        this.type = type;
        this.name = name;
        this.searchDay = searchDay;
    }

    @Builder
    public StatsSearchCond toStatsSearchCond() {
        return StatsSearchCond.builder()
                .type(this.type)
                .name(this.name)
                .searchDay(this.searchDay)
                .build();
    }
}