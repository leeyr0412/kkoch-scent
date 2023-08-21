package com.kkoch.user.api.controller.member;

import com.kkoch.user.api.controller.ApiResponse;
import com.kkoch.user.api.controller.member.request.CheckEmailRequest;
import com.kkoch.user.api.controller.member.request.JoinMemberRequest;
import com.kkoch.user.api.controller.member.request.SetPasswordRequest;
import com.kkoch.user.api.controller.member.request.WithdrawalRequest;
import com.kkoch.user.api.controller.member.response.MemberInfoResponse;
import com.kkoch.user.api.controller.member.response.MemberResponse;
import com.kkoch.user.api.controller.member.response.MemberResponseForAdmin;
import com.kkoch.user.api.service.member.MemberQueryService;
import com.kkoch.user.api.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * 회원 API 컨트롤러
 *
 * @author 임우택
 */
@RequiredArgsConstructor
@RestController
@Slf4j
public class MemberController {

    private final MemberService memberService;
    private final MemberQueryService memberQueryService;
//    private final FileStore fileStore;

    /**
     * 회원 가입 API
     *
     * @param request 가입할 회원의 정보
     * @return 가입된 회원의 정보
     */
    @PostMapping("/join")
    public ApiResponse<MemberResponse> joinMember(@Valid @RequestBody JoinMemberRequest request
//            , @RequestPart("file") MultipartFile file) throws IOException {
    ) {
//        fileStore.storeFile(file);
        MemberResponse response = memberService.join(request.toJoinMemberDto());
        log.debug("MemberResponse={}", response);
        return ApiResponse.ok(response);
    }

    /**
     * 회원 정보 조회
     *
     * @param memberKey 회원 고유키
     * @return 회원 정보
     */
    @GetMapping("/{memberKey}")
    public ApiResponse<MemberInfoResponse> getMyInfo(@PathVariable String memberKey) {
        MemberInfoResponse response = memberQueryService.getMyInfo(memberKey);
        return ApiResponse.ok(response);
    }

    /**
     * 회원 비밀번호 변경
     *
     * @param memberKey 회원 고유키
     * @param request 변경할 비밀번호 정보
     * @return 변경된 회원 정보
     */
    @PatchMapping("/{memberKey}/pwd")
    public ApiResponse<MemberResponse> setPassword(@PathVariable String memberKey, @Valid @RequestBody SetPasswordRequest request) {
        MemberResponse response = memberService.setPassword(memberKey, request.getCurrentPwd(), request.getNewPwd());
        return ApiResponse.ok(response);
    }

    /**
     * 회원 탈퇴
     *
     * @param memberKey 회원 고유키
     * @param request 탈퇴할 회원의 정보
     * @return 탈퇴된 회원의 정보
     */
    @DeleteMapping("/{memberKey}")
    public ApiResponse<MemberResponse> withdrawal(@PathVariable String memberKey, @Valid @RequestBody WithdrawalRequest request) {
        MemberResponse response = memberService.withdrawal(memberKey, request.getPwd());
        return ApiResponse.ok(response);
    }

    /**
     * 이메일 중복 체크
     *
     * @param request 중복 체크할 이메일 정보
     * @return 이메일 중복 여부
     */
    @PostMapping("/check-email")
    public ApiResponse<Boolean> checkEmail(@RequestBody CheckEmailRequest request) {
        boolean result = memberQueryService.validationEmail(request.getEmail());
        return ApiResponse.ok(result);
    }

    @GetMapping("/members")
    public List<MemberResponseForAdmin> getUsers() {
        return memberQueryService.getUsers();
    }


}
