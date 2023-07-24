package com.kkoch.user.domain.member.repository;

import com.kkoch.user.IntegrationTestSupport;
import com.kkoch.user.domain.member.Member;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import javax.transaction.Transactional;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.tuple;

@Transactional
class MemberRepositoryTest extends IntegrationTestSupport {

    @Autowired
    private MemberRepository memberRepository;

    @DisplayName("회원 entity를 저장한다.")
    @Test
    void addMember() throws Exception {

        //given
        Member member = Member.builder()
                .email("test@test.net")
                .loginPw("1234")
                .name("hong")
                .tel("010-1234-5678")
                .businessNumber("A1234512345B")
                .point(0)
                .active(true)
                .build();

        //when
        Member result = memberRepository.save(member);

        //then
        Assertions.assertThat(member)
                .extracting("email", "loginPw", "name", "tel", "businessNumber", "point", "active")
                .contains("test@test.net","1234","hong","010-1234-5678","A1234512345B",0,true);

    }

    @DisplayName("회원가입 시 중복된 회원이 존재한다면 예외가 발생한다.")
    @Test
    void checkDuplication() throws Exception {
        //given
        Member member = Member.builder()
                .email("test@test.net")
                .loginPw("1234")
                .name("hong")
                .tel("010-1234-5678")
                .businessNumber("A1234512345B")
                .point(0)
                .active(true)
                .build();

        //when
        memberRepository.save(member);

        //then
        Optional<Member> findResult = memberRepository.findByEmail("test@test.net");
        Assertions.assertThat(findResult).isPresent();

    }
}