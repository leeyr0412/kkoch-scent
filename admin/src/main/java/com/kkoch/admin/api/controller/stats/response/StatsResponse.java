package com.kkoch.admin.api.controller.stats.response;

import com.kkoch.admin.domain.Grade;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@NoArgsConstructor
@Data
public class StatsResponse {

    private int priceAvg;

    private int priceMax;

    private int priceMin;

    private String grade;

    private int count;

    private String createdDate;

    private String type;

    private String name;

    @Builder
    public StatsResponse(int priceAvg, int priceMax, int priceMin, Grade grade, int count, LocalDateTime createdDate, String type, String name) {
        this.priceAvg = priceAvg;
        this.priceMax = priceMax;
        this.priceMin = priceMin;
        this.grade = grade.getText();
        this.count = count;
        this.createdDate = createdDate.format(DateTimeFormatter.ofPattern("yyyy.MM.dd hh:mm"));
        this.type = type;
        this.name = name;
    }
}
