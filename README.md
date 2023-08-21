# 🌹꽃향기

<div align="center">
<img src="./readme_assets/image/logo-removebg.png" height="200"> <span style="font-size: xx-large; justify-items: center" >실시간 화훼 경매 시스템</span>
</div>

---

# 🎬UCC
[<img style="width: 70%;" src="./readme_assets/image/ucc.png">](https://youtu.be/yVuPLKurLtI)

※ 이미지 클릭시 UCC youtube 이동 

# 🌻서비스 소개

꽃향기는 화훼 경매에 참여하는 도매상들을 위한 실시간 온라인 화훼 경매 서비스 입니다.

집에서 간편하게 꽃을 보고 구매하세요.

# 🌼프로젝트 소개

- 진행 기간 : 2023.07.10 ~ 2023.08.18

### 📂 저장소

- **[🔎 Front-end 저장소](./kkoch)**
- **[🔎 Back-end 저장소(관리자 서버)](./admin)**
- **[🔎 Back-end 저장소(회원 서버)](./user)**
- **[🔎 Back-end 저장소(경매 서버)](./auction)**

## 주요 기능

| 기능        | 내용                                                                                                           |
|-----------|--------------------------------------------------------------------------------------------------------------|
| 경매품 관리 기능 | 관리자는 경매 일정과 경매품을 등록하고 경매방을 열 수 있습니다.<br/>새로운 화훼를 등록하고 조회할 수 있습니다.                                            |
| 경매 기능     | 회원들은 실시간으로 진행되는 화상 경매에 참여하여 원하는 꽃을 낙찰받고 마이페이지에서 확인할 수 있습니다.                                                  |
| 경매 실적 조회  | 누구나 실시간으로 업데이트 되는 낙찰된 경매품의 등급과 가격을 조회할 수 있습니다.<br/>꽃과 등급을 선택하여 기간별로 꽃을 조회할 수 있습니다.<br/>꽃과 등급별로 낙찰 동계를 제공합니다. |

## 기술 스택

### Front-end

| <img src="https://i.namu.wiki/i/R_1GB9wacsgjR61sACBysg_5Y4ygMDZgPOlrT5aVwjJStPixqHfWNZP33qn288cy-KVODo69r2FAbOitrKxwqKsQZ2pl-jHsCckqK2aO97ENVi5_fFCvSHPDez9pmDTwjGiW9PZKUvBK4XZ0MTXpsA.svg" alt="HTML5" width="100px"  height="100px"  /> | <img src="https://i.namu.wiki/i/-YBCCZqpprsMP89vNqcM1dICBjNf-IxRaukuXLJCcp8oQgEM0ARMk_fS0liXZRylAcZoQUg5g7MxrBkove1NmLyAn7t4C-q22LZ0Am-9cas-yJqyZ07b5QZz8SFd4MiWPUhPnW2jTpcuC3ipei6vyw.svg" alt="CSS3" width="100px" height="100px" /> | <img src="https://i.namu.wiki/i/p7DK2MHrcIylZFz4rbq0kp8w0-NZnLwuVAK-vkIpOwLSc9vzLhcZkuWFOXQt-ccDJy6tfJMhwFCV2PTapqzRR9-qnLDlNxxuuP0UDMkZ9-_9RQ1ITQil9tNp9hKt840cGPl92SSkv1wVGAOQuNxTtA.webp" alt="TypeScript" width="100px" height="100px" /> |
|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|                                                                                                                   HTML5                                                                                                                   |                                                                                                                  CSS3                                                                                                                  |                                                                                                                  TypeScript                                                                                                                   |

| <img src="https://i.namu.wiki/i/lVfPXZ0dmrpwxPXqoBOzY0QnBABWVduuGjFx_xN2kieYI47MXvoKkUMBLXsa1CyRjq5FEjwsXfcpcoB2lMbgSTwEvE9qgkBMusPRMVrpzFjcAQwjLkbAQofyTZbftvIlrpX-dgUKFQOO715UMQFWrQ.svg" alt="React.js" width="100px" height="100px" /> | <img src="https://d33wubrfki0l68.cloudfront.net/0834d0215db51e91525a25acf97433051f280f2f/c30f5/img/redux.svg" alt="Redux" width="100px" height="100px" /> | <img src="https://vitejs.dev/logo-with-shadow.png" alt="Vite" width="100px" height="100px" /> |
|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------:|
|                                                                                                                   React                                                                                                                    |                                                                           Redux                                                                           |                                             Vite                                              |

| <img src="./readme_assets/image/websockets.png" alt="Socket.io" width="100px" /> | <img src="https://mui.com/static/logo.png" alt="MUI" width="100px" height="100px" /> | <img src="./readme_assets/image/tailwind.png" alt="Tailwind CSS" width="100px" height="100px" /> |
|:--------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------------------:|
|                                    WebSocket                                     |                                         MUI                                          |                                           Tailwind CSS                                           |

### Back-end

| <img src="https://i.namu.wiki/i/MuCO_ocla-FyadGnRZytkRLggQOcqxv_hXNjN7aYXDOPivIChJNdiRXp6vwSXbM6GcUL3pVTL-5U5TKQ0f1YhA.svg" alt="HTML5" width="100px" height="100px" /> | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Spring_Framework_Logo_2018.svg/1920px-Spring_Framework_Logo_2018.svg.png" width="100"> | <img src="./readme_assets/image/spring cloud.png"  alt="HTML5" width="100px" height="100px" /> |
|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------:|
|                                                                                  Java                                                                                   |                                                                         SpringBoot                                                                         |                                          SpringCloud                                           |

| <img src="https://static-00.iconduck.com/assets.00/hibernate-icon-1965x2048-cl94vxbt.png"  alt="HTML5" width="100px" height="100px" /> | <img src="https://i.namu.wiki/i/vkGpBcmks1_NcJW0HUFa6jlwlM6h11B-8nxRRX4bYC703H4nLo7j4dQdRCC32gz8Q-BqRcAnQgFSXMjB8jPohg.svg"  alt="HTML5" width="100px" height="100px" /> | <img src="https://upload.wikimedia.org/wikipedia/commons/a/a1/H2_logo.png"  alt="HTML5" width="100px" height="100px" /> | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Logo-redis.svg/2560px-Logo-redis.svg.png"  alt="HTML5" width="100px" height="100px" /> |
|:--------------------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------:|
|                                                               Hibernate                                                                |                                                                                  MySQL                                                                                   |                                                           H2                                                            |                                                                           Redis                                                                            |

| <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Socket-io.svg/1200px-Socket-io.svg.png"  alt="HTML5" width="100px" height="100px" /> | <img src="https://www.thymeleaf.org/images/thymeleaf.png"  alt="HTML5" width="100px" height="100px" /> |
|:--------------------------------------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------------------------:|
|                                                                        Socket.io                                                                         |                                               Thymeleaf                                                |

### DevOps

| <img src="https://www.nginx.com/wp-content/uploads/2020/05/NGINX-product-icon.svg"  alt="HTML5" width="100px" height="100px" /> | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/300px-Amazon_Web_Services_Logo.svg.png"  alt="HTML5" width="100px" height="100px" /> | <img src="https://i.namu.wiki/i/8wUfxyvz88Q6e5I_vuHYJdnVV_z3o7jbjV2WCjhTzZxWijV1v5rpU-f8vm4o-hYmtx_utsw4g8VhMvPjecTBo-bGGCjZhVKGBJsiXCs04pU188gmdcTsPUFlYk7YXXk-ktCwai5NfK6BadDTgm-NlQ.webp"  alt="HTML5" width="100px" height="100px" /> | <img src="https://canada1.discourse-cdn.com/free1/uploads/openvidu/original/1X/ee7880b148202978d80991820064f9c39ada3530.png"  alt="openVidu" width="100px" height="100px" /> |
|:-------------------------------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|                                                              NGINX                                                              |                                                                                        aws EC2                                                                                        |                                                                                                                  Docker                                                                                                                   |                                                                                   openVidu                                                                                   |

오픈비두


---
<!--
## 상세 기능 소개

|   분류   |    기능     | 설명                                                      |
|:------:|:---------:|:--------------------------------------------------------|
| 사용자 기능 |   회원 기능   | 회원은 로그인/회원가입을 할 수 있습니다.                                 |
|        |   회원 기능   | 회원은 로그인/회원가입을 할 수 있다.                                   |
|        |   회원 기능   | 회원은 로그인/회원가입을 할 수 있다.                                   |
|        |   회원 기능   | 회원은 로그인/회원가입을 할 수 있다.                                   |
| 관리자 기능 | 관리자 등록 기능 | 관리자 계정은 다른 관리자를 등록할 수 있으며 등록 시 권한을 설정해 경매사와 관계자를 구분합니다. |
|        | 관리자 등록 기능 | 관리자 계정은 다른 관리자를 등록할 수 있으며 등록 시 권한을 설정해 경매사와 관계자를 구분합니다. |
|        | 관리자 등록 기능 | 관리자 계정은 다른 관리자를 등록할 수 있으며 등록 시 권한을 설정해 경매사와 관계자를 구분합니다. |
|        | 관리자 등록 기능 | 관리자 계정은 다른 관리자를 등록할 수 있으며 등록 시 권한을 설정해 경매사와 관계자를 구분합니다. |
|        | 관리자 등록 기능 | 관리자 계정은 다른 관리자를 등록할 수 있으며 등록 시 권한을 설정해 경매사와 관계자를 구분합니다. |
|        | 관리자 등록 기능 | 관리자 계정은 다른 관리자를 등록할 수 있으며 등록 시 권한을 설정해 경매사와 관계자를 구분합니다. |
| 시스템 기능 | 낙찰 통계 기능  | 매일 오전 10시에 당일 진행했던 경매품에 대해 꽃과 등급별 평균을 계산해 기록합니다.        |
|        | 낙찰 통계 기능  | 매일 오전 10시에 당일 진행했던 경매품에 대해 꽃과 등급별 평균을 계산해 기록합니다.        |
|        | 낙찰 통계 기능  | 매일 오전 10시에 당일 진행했던 경매품에 대해 꽃과 등급별 평균을 계산해 기록합니다.        |
|        | 낙찰 통계 기능  | 매일 오전 10시에 당일 진행했던 경매품에 대해 꽃과 등급별 평균을 계산해 기록합니다.        |
|        | 낙찰 통계 기능  | 매일 오전 10시에 당일 진행했던 경매품에 대해 꽃과 등급별 평균을 계산해 기록합니다.        |
-->

### 아키텍쳐

### ERD

<img src="./readme_assets/image/erd.png">

### MockUp

[<img src="./readme_assets/image/MockUp.png">](https://www.figma.com/file/tM0ZWDVhY2laCRiY6OwMhO/c204?type=design&node-id=0%3A1&mode=design&t=2jhkzdKds3yUFIqh-1)

※ 이미지 클릭시 Figma 이동


---


# 🌺 꽃향기 주요 서비스

## 🌸 Main
- 꽃향기 서비스 메인 페이지 소개
<p align="center">
  <img src="./readme_assets/image/main1.png" width="48%"/>
  <img src="./readme_assets/image/main2.png" width="48%"/>
</p>



## 🥀 Data
- 화훼 상세 정보 
- 실시간 낙찰 현황 조회
- 화훼 별로 차트 제공
<p align="center">
  <img src="./readme_assets/image/search1.png" width="48%"/>
  <img src="./readme_assets/image/search2.png" width="48%"/>
</p>

## 🌻 Reservation
- 마이페이지에서 예약등록 및 내역 조회
- 화훼 낙찰 시세를 보고 예약
- 단수 제한, 당일 예약 횟수 제한
<p align="center">
  <img src="./readme_assets/image/reservation1.png" width="48%"/>
  <img src="./readme_assets/image/reservation2.png" width="48%"/>
</p>

## 🌼 Auction
### 👩‍🏫 관리자 
- 관리자는 인트라넷을 통해 경매방을 생성
- 모든 도매업자들을 볼 수 있음
- 로그를 통해 누가 들어왔는지 나갔는지 또는 입찰했는지 확인 가능
<p align="center">
  <img src="./readme_assets/image/admin1.png" width="33%"/>
  <img src="./readme_assets/image/admin2.png" width="33%"/>
  <img src="./readme_assets/image/admin3.png" width="33%"/>
</p>

- 식물, 카테고리, 경매일정, 경매품 조회, 등록, 수정, 삭제 기능
<p align="center">
  <img src="https://github.com/Team-MukJa/MukJa-FE/assets/107923409/ee0b88b3-b11c-4738-ae55-c4b1e1de8819" width="33%"/>
  <img src="https://github.com/Team-MukJa/MukJa-FE/assets/107923409/d242cdea-e2a7-4b50-a2ed-8d368154bf0d" width="33%"/>
  <img src="https://github.com/Team-MukJa/MukJa-FE/assets/107923409/b6434e4b-93c6-406f-9eeb-15988bb1f048" width="33%"/>
</p>

### 👨‍🌾 도매업자 
- 도매업자는 경매방이 생기면 참여가 가능
- 카메라를 켜야 입장가능
- 관리자 화면이 보이고 꽃을 생중계로 볼 수 있음
- 차트를 통해 가격이 떨어지는 정보, 화훼 정보 확인가능
<p align="center">
  <img src="./readme_assets/image/user1.png" width="33%"/>
  <img src="./readme_assets/image/user2.png" width="33%"/>
  <img src="./readme_assets/image/user3.png" width="33%"/>
</p>




## 👨‍👩‍👧‍👦팀 소개

<table align="center">
    <tr align="center">
        <td style="min-width: 150px;">
            <a href="https://github.com/Chaos0103">
              <img src="./readme_assets/profile/lwt.png" width="200">
              <br />
              <b>Chaos0103</b>
            </a>
        </td>
        <td style="min-width: 150px;">
            <a href="https://github.com/leeyr0412">
              <img src="./readme_assets/profile/lyr.png" width="200">
              <br />
              <b>leeyr0412</b>
            </a> 
        </td>
        <td style="min-width: 150px;">
            <a href="https://github.com/SeungJun">
              <img src="./readme_assets/profile/hsj.png" width="200">
              <br />
              <b>SeungJun</b>
            </a> 
        </td>
        <td style="min-width: 150px;">
            <a href="https://github.com/soo0300">
              <img src="/uploads/348a9814b2008c7659d4cf278ff1757b/입사지원사진.jpg" width="180"  height="160">
              <br />
              <b>soo0300</b>
            </a> 
        </td>
        <td style="min-width: 150px;">
            <a href="https://github.com/hans0537">
              <img src="./readme_assets/profile/ssj.png" width="200">
              <br />
              <b>hans0537</b>
            </a> 
        </td>
        <td style="min-width: 150px;">
            <a href="https://github.com/lukylun">
              <img src="./readme_assets/profile/syj.png" width="200">
              <br />
              <b>lukylun</b>
            </a> 
        </td>
    </tr>
    <tr align="center">
        <td>
            임우택 (팀장)<br/>BE & FE & INFRA
        </td>
        <td>
            이예리 (부팀장)<br/>BE
        </td>
        <td>
            홍승준<br/>BE
        </td>
        <td>
            김수진<br/>BE
        </td>
        <td>
            신성주<br/>FE
        </td>
        <td>
            서용준<br/>FE
        </td>
    </tr>
</table>



## 커밋 컨벤션

규칙 `🎉feat: S09P12C204-이슈번호 내용`

```
🎉feat: 새로운 기능을 추가할 경우
🌈style: 기능에 영향을 주지 않는 커밋, 코드 순서, CSS등의 포맷에 관한 커밋
🚑fix: 버그를 고친 경우 🚨
♻️refactor: 프로덕션 코드 리팩토링
🔨test: 테스트 코드 작성
📝docs: main 문서를 수정한 경우, 파일 삭제, 파일명 수정 등
👀code review: 코드 리뷰 반영
🏗️build: 빌드 변경
💿backup: 백업
```
