package com.kkoch.user.api.controller.reservation.request;

import com.kkoch.user.api.service.reservation.dto.AddReservationDto;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@NoArgsConstructor
public class AddReservationRequest {
    @NonNull
    private String type;
    @NonNull
    private String name;
    @NonNull
    private String grade;
    @NonNull
    private Long plantId;
    @NonNull
    private Integer count;
    @NonNull
    private Integer price;

    @Builder
    private AddReservationRequest(String type, String name,String grade,Long plantId, Integer count, Integer price) {
        this.type=type;
        this.name=name;
        this.grade=grade;
        this.plantId = plantId;
        this.count = count;
        this.price = price;
    }

    public AddReservationDto toAddReservationDto() {
        AddReservationDto dto = AddReservationDto.builder()
                .plantId(plantId)
                .count(count)
                .price(price)
                .build();
        return dto;
    }
}
