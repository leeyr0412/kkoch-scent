package com.kkoch.admin.api.service.auction;

import com.kkoch.admin.api.service.auction.dto.AddAuctionDto;
import com.kkoch.admin.domain.auction.repository.AuctionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
@Transactional
public class AuctionService {

    private final AuctionRepository auctionRepository;


}
