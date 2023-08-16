package com.kkoch.admin.api.controller.auction;

import com.kkoch.admin.ControllerTestSupport;
import com.kkoch.admin.api.controller.admin.LoginAdmin;
import com.kkoch.admin.api.controller.auction.request.AddAuctionRequest;
import com.kkoch.admin.api.controller.auction.request.SetAuctionRequest;
import com.kkoch.admin.api.controller.auction.response.AuctionTitleResponse;
import com.kkoch.admin.api.service.auction.AuctionQueryService;
import com.kkoch.admin.api.service.auction.AuctionService;
import com.kkoch.admin.api.service.auction.dto.AddAuctionDto;
import com.kkoch.admin.api.service.auction.dto.SetAuctionDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.BDDMockito;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.time.LocalDateTime;

import static com.kkoch.admin.domain.auction.Status.CLOSE;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {AuctionApiController.class})
class AuctionApiControllerTest extends ControllerTestSupport {

    @MockBean
    private AuctionService auctionService;
    @MockBean
    private AuctionQueryService auctionQueryService;

    @DisplayName("[경매 일정 조회] 오픈된거 확인")
    @Test
    void getAuctionListForMember() throws Exception {
        //given
        BDDMockito.given(auctionQueryService.getOpenAuction())
                .willReturn(AuctionTitleResponse.builder()
                        .title("title")
                        .auctionId(1L)
                        .build());
        //when //then
        mockMvc.perform(
                        MockMvcRequestBuilders.get("/admin-service/auctions/api")
                )
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("200"))
                .andExpect(jsonPath("$.status").value("OK"))
                .andExpect(jsonPath("$.message").value("SUCCESS"))
                .andExpect(jsonPath("$.data").isNotEmpty());

    }

    @DisplayName("[경매 일정 조회]")
    @Test
    void getAuctionList() throws Exception {
        //given
//        BDDMockito.given(auctionService.remove(anyLong()))
//                .willReturn(1L);
        MockHttpSession session = getLoginAdminSession();

        //when //then
        mockMvc.perform(
                        MockMvcRequestBuilders.get("/admin-service/auctions")
                                .session(session)
                )
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("200"))
                .andExpect(jsonPath("$.status").value("OK"))
                .andExpect(jsonPath("$.message").value("SUCCESS"))
                .andExpect(jsonPath("$.data").isArray());

    }

    @DisplayName("[경매 일정 삭제]")
    @Test
    void removeTrade() throws Exception {
        //given
        BDDMockito.given(auctionService.remove(anyLong()))
                .willReturn(1L);
        MockHttpSession session = getLoginAdminSession();

        //when //then
        mockMvc.perform(
                        delete("/admin-service/auctions/{auctionId}", 1L)
                                .session(session)
                )
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("301"))
                .andExpect(jsonPath("$.status").value("MOVED_PERMANENTLY"))
                .andExpect(jsonPath("$.message").value("경매 일정이 삭제되었습니다."))
                .andExpect(jsonPath("$.data").isNumber());

    }

    @DisplayName("[경매 일정 수정] 1시간 이내의 시간으로 설정 시 에러가 발생한다.")
    @Test
    void setAuctionTimeError() throws Exception {
        //given
        SetAuctionRequest request = getSetAuctionRequest(LocalDateTime.now().plusMinutes(2), 2);
        MockHttpSession session = getLoginAdminSession();

        //when //then
        mockMvc.perform(
                        MockMvcRequestBuilders.patch("/admin-service/auctions/{auctionId}", 1L)
                                .content(objectMapper.writeValueAsString(request))
                                .contentType(MediaType.APPLICATION_JSON)
                                .session(session)
                )
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value(400))
                .andExpect(MockMvcResultMatchers.jsonPath("$.status").value("BAD_REQUEST"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.message").value("경매 시간 입력 오류"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.data").isEmpty());
    }


    @DisplayName("[경매 일정 수정] 구분코드가 1~4 사이의 정수가 아닐 시 오류가 발생한다.")
    @Test
    void setAuctionCodeError() throws Exception {
        //given
        SetAuctionRequest request = getSetAuctionRequest(LocalDateTime.now().plusHours(2), -5);
        MockHttpSession session = getLoginAdminSession();

        //stubbing 작업
        BDDMockito.given(auctionService.setAuction(anyLong(), any(SetAuctionDto.class)))
                .willThrow(new IllegalArgumentException("구분코드 에러"));

        //when //then
        mockMvc.perform(
                        MockMvcRequestBuilders.patch("/admin-service/auctions/{auctionId}", 1L)
                                .content(objectMapper.writeValueAsString(request))
                                .contentType(MediaType.APPLICATION_JSON)
                                .session(session)
                )
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value(400))
                .andExpect(MockMvcResultMatchers.jsonPath("$.status").value("BAD_REQUEST"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.message").value("구분코드 에러"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.data").isEmpty());
    }

    @DisplayName("[경매 일정 수정]")
    @Test
    void setAuction() throws Exception {
        //given
        SetAuctionRequest request = getSetAuctionRequest(LocalDateTime.now().plusHours(2), 2);
        MockHttpSession session = getLoginAdminSession();

        //stubbing 작업
        BDDMockito.given(auctionService.setAuction(anyLong(), any(SetAuctionDto.class)))
                .willReturn(AuctionTitleResponse.builder()
                        .auctionId(1L)
                        .title("title")
                        .build());

        //when //then
        mockMvc.perform(
                        MockMvcRequestBuilders.patch("/admin-service/auctions/{auctionId}", 1L)
                                .content(objectMapper.writeValueAsString(request))
                                .contentType(MediaType.APPLICATION_JSON)
                                .session(session)
                )
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value(200))
                .andExpect(MockMvcResultMatchers.jsonPath("$.status").value("OK"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.message").value("SUCCESS"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.data").isNotEmpty());
    }

    @DisplayName("[경매 상태 수정]")
    @Test
    void setStatusError() throws Exception {
        //given
        MockHttpSession session = getLoginAdminSession();

        AuctionTitleResponse response = AuctionTitleResponse.builder()
                .auctionId(3L)
                .title("title")
                .build();
        BDDMockito.given(auctionService.setStatus(3L, CLOSE))
                .willReturn(response);

        Long auctionId = 3L;
        //when //then
        mockMvc.perform(
                        MockMvcRequestBuilders.patch("/admin-service/auctions/{auctionId}/{status}", auctionId, CLOSE)
                                .session(session)
                )
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.data").isNumber());
    }

    @Test
    @DisplayName("[경매일정 등록] 시 현재시간부터 1시간 이내에 등록하면 에러가 발생한다.")
    void addAuctionTimeException() throws Exception {
        //given
        AddAuctionRequest request = new AddAuctionRequest(LocalDateTime.now().plusMinutes(30), 1);

        MockHttpSession session = new MockHttpSession();
        session.setAttribute("loginAdmin", new LoginAdmin());


        //when //then
        mockMvc.perform(
                        MockMvcRequestBuilders.post("/admin-service/auctions")
                                .content(objectMapper.writeValueAsString(request))
                                .contentType(MediaType.APPLICATION_JSON)
                                .session(session)
                )
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value(400))
                .andExpect(MockMvcResultMatchers.jsonPath("$.status").value("BAD_REQUEST"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.message").value("경매 시간 입력 오류"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.data").isEmpty());
    }

    @Test
    @DisplayName("[경매일정 등록] 성공")
    void addAuction() throws Exception {
        //given
        AuctionTitleResponse response = AuctionTitleResponse.builder()
                .auctionId(1L)
                .title("title")
                .build();
        AddAuctionRequest request = new AddAuctionRequest(LocalDateTime.now().plusHours(2), 1);

        MockHttpSession session = getLoginAdminSession();

        BDDMockito.given(auctionService.addAuction(anyLong(), any(AddAuctionDto.class)))
                .willReturn(response);

        //when //then
        mockMvc.perform(
                        MockMvcRequestBuilders.post("/admin-service/auctions")
                                .content(objectMapper.writeValueAsString(request))
                                .contentType(MediaType.APPLICATION_JSON)
                                .session(session)
                )
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.jsonPath("$.data.title").value("title"));

    }

    private MockHttpSession getLoginAdminSession() {
        MockHttpSession session = new MockHttpSession();
        LoginAdmin loginAdmin = LoginAdmin.builder()
                .id(1L)
                .authority("10")
                .build();
        session.setAttribute("loginAdmin", loginAdmin);
        return session;
    }

    private SetAuctionRequest getSetAuctionRequest(LocalDateTime startTime, int code) {
        return SetAuctionRequest.builder()
                .startTime(startTime)
                .code(code)
                .build();
    }
}
