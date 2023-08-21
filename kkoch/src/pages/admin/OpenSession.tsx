import { OpenVidu } from 'openvidu-browser';

import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import UserVideoComponent from './UserVideoComponent';
import Clock from '@/components/Clock/Clock';

import "./openSessoin.css";

interface BidderInfo {
  memberToken: string;
  auctionArticleId: number;
  bidPrice: number;
  message: string;
  winnerNumber: number;
}

interface auctionInfo {
  auctionArticleId: number;
  code: string; // 카테고리
  name: string; // 품목
  type: string; // 품종
  count: number; //단수
  shipper: string; //출하자
  region: string; //지역
  grade: string; //등급
  startPrice: number; //시작가
}

export default function OpenSession() {
  const [socket, setSocket] = useState(null); // WebSocket 상태 추가
  const [mySessionId, setMySessionId] = useState('YangJae1')
  const [myUserName, setMyUserName] = useState(`관리자${Math.floor(Math.random() * 100)}`)
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null);
  const [auctionStart, setAuctoinStart] = useState(false);
  const reservMemKey = useRef('');
  const reservId = useRef(0);
  const reservPrice = useRef(0);

  // 경매 정보
  // 경매 전체 목록
  const [auctionInfos, setAuctionInfos] = useState([]);
  // 현재 경매 물품
  const [auctionNowInfo, setAuctionNowInfo] = useState<auctionInfo>();
  // 다음 경매 물품
  const [auctionNextInfo, setAuctionNextInfo] = useState<auctionInfo>();
  // 경매 시작가
  const [startPrice, setStartPrice] = useState(0);
  // 경매 종료가
  const [finalPrice, setFinalPrice] = useState(0);
  // 예약자 낙찰 정보
  const [bidderInfo, setBidderInfo] = useState<BidderInfo>();
  // 경매 현재가 변동
  const animationFrameRef = useRef(null);
  // 경매 시작됐는지 체크
  const [isBiddingActive, setIsBiddingActive] = useState(false);
  // 경매 현재가
  const [currentPrice, setCurrentPrice] = useState(startPrice);

  let curSessionId = null;

  const videoLog = useRef(null);

  const OV = useRef(new OpenVidu());
  
  const setCurrentId = (id) => {
    curSessionId = id;
  }
  // 세션 이름 변경
  const handleChangeSessionId = useCallback((e) => {
    setMySessionId(e.target.value);
    setCurrentId(e.target.value);
  }, []);
  
  // 이름 변경
  const handleChangeUserName = useCallback((e) => {
    setMyUserName(e.target.value);
  }, []);
  
  // 메인 화면 변경
  const handleMainVideoStream = useCallback((stream) => {
    if (mainStreamManager !== stream) {
      setMainStreamManager(stream);
    }
    if (mainStreamManager === stream) {
      setMainStreamManager(undefined);
    }
  }, [mainStreamManager]);
  
  const removeMainStreamManager = useCallback(() => {
    if (mainStreamManager) {
      setMainStreamManager(undefined);
    }
  }, [mainStreamManager]);

  // 예약자 낙찰 함수
  const sendReservBid = () => {
    console.log("sendReservBid 들어오나?")
    // memberInfo 갱신 후 JSON 변환 후 전송
    axios({
      method: "post",
      url: "https://i9c204.p.ssafy.io/api/auction-service/auctions/participant",
      // url: "/api/api/auction-service/auctions/participant",
      data: {
        "memberKey": reservMemKey.current,
        "auctionArticleId": auctionNowInfo.auctionArticleId,
        "price": reservPrice.current,
        "reservationId" : reservId.current,
      }
    }).then((res) => {
      console.log(res)
      const bidder = res.data.data
      const winnerInfo = {
        message: "success",
        winnerNumber: bidder.winnerNumber,
        auctionArticleId: bidder.auctionArticleId,
        bidPrice: bidder.bidPrice,
        role: "client"
      }
      socket.send(JSON.stringify(winnerInfo));
    })
    .catch(err => console.log(err))
  }

  // 현재 경매품 목록 함수
  const getNowList = (auctionNowInfo) => {
    if (auctionNowInfo) {
      // 시작가 갱신
      setStartPrice(auctionNowInfo?.startPrice);
      // 현재가 갱신
      setFinalPrice(auctionNowInfo?.startPrice / 2);
      
      // 시작가 변경 후 현재가 갱신
      setCurrentPrice(auctionNowInfo?.startPrice);
      setIsBiddingActive(true);
    }
  };
  
  // 경매 물품이 하나씩 갱신되면 실행
  useEffect(() => {
    if (auctionNowInfo) {
      getNowList(auctionNowInfo)
    }
  }, [auctionNowInfo])

  useEffect(() => {
    console.log("너 계속 실행되지?")
    if (startPrice !== 0 && currentPrice !== -1 && isBiddingActive) {
      const totalTime = 10000; // 10초
      const startTime = Date.now(); // 시작 시간 저장
      const decreaseAmount = (startPrice - finalPrice) / totalTime; // 감소량 계산

      const animatePrice = () => {
        // console.log("너 계속 실행되지?")
        if (!isBiddingActive) {
          setCurrentPrice(-1);
          console.log("", currentPrice)
          return;
        }
        const currentTime = Date.now(); // 현재 시간 구하기
        const elapsedTime = currentTime - startTime; // 경과 시간 계산
    
        // 경과 시간에 따라 현재가 감소시키기
        const newPrice = startPrice - decreaseAmount * elapsedTime;
        // console.log("자라라라라라떨어지는중")
        // console.log(newPrice);
        // console.log("reservPrice", reservPrice.current);
        
        // 최소값 제한
        setCurrentPrice(Math.max(newPrice, finalPrice));
        
        
        // 예약자 있으면 종료
        if (newPrice <= reservPrice.current) {
          console.log("여기 멈추ㅝ야해")
          sendReservBid()
          setCurrentPrice(-1);
          setIsBiddingActive(false);
          
        }
    
        // 애니메이션이 끝나지 않았으면 다음 프레임에 애니메이션 함수 호출
        if (elapsedTime < totalTime && isBiddingActive) {
          animationFrameRef.current = requestAnimationFrame(animatePrice);
        } 
        else if (!isBiddingActive) {
          setCurrentPrice(-1); // 클릭한 시점의 현재 가격을 집계중으로 바꾸기 위해 -1로 셋팅
          setIsBiddingActive(false);
        } 
        else if (elapsedTime >= totalTime) {
          setIsBiddingActive(false);
        }
      };
      
      // 애니메이션 시작
      animationFrameRef.current = requestAnimationFrame(animatePrice);
      
      return () => {
        // 컴포넌트가 언마운트될 때 애니메이션 정리
        cancelAnimationFrame(animationFrameRef.current);
      };
    }
  },[isBiddingActive, startPrice])



  // 다음 경매 넘기기 핸들링
  const handleNextAuction = () => {
    appendToVideoLog(`경매중....`)

    socket.send(
      JSON.stringify({
        role: "admin",
        command: "next"
      })
    )
    console.log("---------------------------------------2번------------------------------------------")
  };
  
  // 경매 시작
  const handleStartAuction = () => {
    appendToVideoLog(`경매중....`)

    axios({
      method: 'get',
      url: 'https://i9c204.p.ssafy.io/api/admin-service/auctions/api'
      // url: '/api/api/admin-service/auctions/api'
    })
    .then((res) => {
      console.log(res.data.data.auctionId)
      socket.send(JSON.stringify({auctionId: res.data.data.auctionId.toString(), role:"admin", command:"start"}))
      console.log("---------------------------------------1번------------------------------------------")
      setAuctoinStart(true);
    })
    .catch(err => console.log(err))
  }
  
  
  const divideArticle = (articles) => {
    setAuctionNowInfo(articles[0]);
    setAuctionNextInfo(articles[1]);
  }
  
  
  // 로그 찍기
  const appendToVideoLog = (text) => {
    const now = new Date();
    const currentTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    // const logText = `${currentTime}: ${text}`;
    
    if (videoLog.current) {
      videoLog.current.value += `[${currentTime}] - ` + text + '\n';
    }
  };

  // 세션 열기
  const joinSession = useCallback(() => {
    
    // 웹 소캣도 연결
    // const socket = socketRef.current;
    const newSocket = new WebSocket('wss://i9c204.p.ssafy.io/ws/');
    
    newSocket.addEventListener('open', () => {
      console.log("---------------------------------")
      console.log('WebSocket connected'); // 웹소켓 연결 확인 메시지 출력
      
      console.log(curSessionId ? true : false)
      console.log(mySessionId)
      
      // 서버에 들어가자마자 openVidu 방 코드 전송
      newSocket.send(JSON.stringify({
        sessionId: curSessionId ? curSessionId : mySessionId,
        role: "admin",
        command: "open",
      }));
    });
    
    // 소캣 실시간 통신
    newSocket.addEventListener('message', (e) => {
      const message = JSON.parse(e.data);
      
      console.log(message);
      console.log("---------------------------------------3번------------------------------------------")
      
      if(message?.message === "success") {
        console.log("비딩 성공")
        console.log(message.message)
        appendToVideoLog(`${message.auctionArticleId}번 경매품: ${message.winnerNumber}번 경매자 ${message.bidPrice}원 낙찰!!`)
        setIsBiddingActive(false)
        setCurrentPrice(-1)
      }else if (message?.memberKey) {
        reservMemKey.current = message.memberKey;
        reservId.current = message.reservationId;
        reservPrice.current = message.price;
        console.log("================================reservmem")
        console.log(reservMemKey)
      }else if (message?.command === "start") {
        console.log("시작가 설정")
        auctionInfos.push(message);
        divideArticle(auctionInfos);
      }else if (message?.command === "next") {
        setBidderInfo(null);
        auctionInfos.push(message);
        divideArticle(auctionInfos);
        auctionInfos.shift();
      }
    });
    
    
    setSocket(newSocket);
    

    const mySession = OV.current.initSession();
    
    mySession.on('streamCreated', (event) => {
      const subscriber = mySession.subscribe(event.stream, undefined);
      const name = JSON.parse(event.stream.connection.data).clientData

      if (name.indexOf("관리자") === -1) {
        appendToVideoLog(`${name} 번 경매자가 입장 하였습니다.`);
      }
      setSubscribers((subscribers) => [...subscribers, subscriber]);

      console.log("한명 입장")
    });
    
    mySession.on('streamDestroyed', (event) => {
      console.log('Stream destroyed:', event.stream.connection.data);
      const name = JSON.parse(event.stream.connection.data).clientData
  
      if (name.indexOf("관리자") === -1) {
        appendToVideoLog(`${name} 번 경매자가 퇴장 하였습니다.`);
      }
      deleteSubscriber(event.stream.streamManager);
      console.log("한명 퇴장")
    });

    mySession.on('exception', (exception) => {
        console.warn(exception);
    });

    setSession(mySession);

  }, []);

  useEffect(() => {
    if (session) {
      // Get a token from the OpenVidu deployment
      getToken().then(async (token) => {
        try {
          await session.connect(token, { clientData: myUserName });

          const publisher = await OV.current.initPublisherAsync(undefined, {
              audioSource: undefined,
              videoSource: undefined,
              publishAudio: true,
              publishVideo: true,
              resolution: '640x480',
              frameRate: 30,
              insertMode: 'APPEND',
              mirror: false,
          });

          session.publish(publisher);

          const devices = await OV.current.getDevices();
          const videoDevices = devices.filter(device => device.kind === 'videoinput');
          const currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
          const currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId);

          // setMainStreamManager(publisher);
          setPublisher(publisher);
          setCurrentVideoDevice(currentVideoDevice);
        } catch (error) {
          console.log('There was an error connecting to the session:', error.code, error.message);
        }
      });
    }
  }, [session, myUserName]);


  const leaveSession = useCallback(() => {
    // Leave the session
    if (confirm("현재 경매가 진행중입니다. 종료하시겠습니까?") && session) {
      socket.send(JSON.stringify({
        role:"admin",
        command:"close"
      }))

      socket.close();
      
      // 모든 구독자(subscribers)를 퇴장시킴
      subscribers.forEach(sub => sub.stream.dispose());
      
      session.disconnect();

      alert("경매가 종료 되었습니다.")
    }

    // Reset all states and OpenVidu object
    OV.current = new OpenVidu();
    setSession(undefined);
    setSubscribers([]);
    setMySessionId('YangJae1');
    setMyUserName('관리자' + Math.floor(Math.random() * 100));
    setMainStreamManager(undefined);
    setPublisher(undefined);
  }, [session]);


  const deleteSubscriber = useCallback((streamManager) => {
    setSubscribers((prevSubscribers) => {
      const index = prevSubscribers.indexOf(streamManager);
      if (index > -1) {
        const newSubscribers = [...prevSubscribers];
        newSubscribers.splice(index, 1);
        return newSubscribers;
      } else {
        return prevSubscribers;
      }
    });
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      leaveSession();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [leaveSession]);

  const getToken = useCallback(async () => {
    return createSession(mySessionId).then(sessionId =>
      createToken(sessionId),
    );
  }, [mySessionId]);

  const createSession = async (sessionId) => {
    const response = await axios.post('https://i9c204.p.ssafy.io:8443/api/sessions', { customSessionId: sessionId }, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Basic ' + btoa('OPENVIDUAPP:1q2w3e4r'),
      },
    });
    return response.data; // The sessionId
  };

  const createToken = async (sessionId) => {
    const response = await axios.post(`https://i9c204.p.ssafy.io:8443/api/sessions/${sessionId}/connections`, {}, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Basic ' + btoa('OPENVIDUAPP:1q2w3e4r'),
      },
    });
      return response.data; // The token
  };

  return (
    <div className="max-h-7xl admin">
        {session === undefined ? (
          <div className='container'>
            <div id="join-dialog" className="container jumbotron vertical-center">
              <h1 className='my-8 text-center'>양재 경매방 생성하기 </h1>
              <hr/>
              <Clock />
              <div className='border-2 border-[#5E0000] rounded-lg w-[70%] my-[50px] mx-auto'>
                <form className="form-group p-6" onSubmit={joinSession}>
                  <p>
                    <label>관리자 이름: </label>
                    <input
                      className="form-control"
                      type="text"
                      id="userName"
                      value={myUserName}
                      onChange={handleChangeUserName}
                      required
                    />
                  </p>
                  <p>
                    <label> 방 key: </label>
                    <input
                      className="form-control"
                      type="text"
                      id="sessionId"
                      value={mySessionId}
                      onChange={handleChangeSessionId}
                      required
                    />
                  </p>
                  <p className="text-center">
                    <input className="btn btn-lg btn-success" name="commit" type="submit" value="경매방 오픈" />
                  </p>
                </form>
              </div>
            </div>
          </div>
        ) : null}

        {session !== undefined ? (
          <div className='container my-10'>
            <div className='flex justify-between items-center'>
              <h1 id="session-title" className='font-bold'>방 key: {mySessionId}</h1>
              <button
                className="btn btn-large btn-danger h-[30%] w-[15%] text-xl"
                type="button"
                id="buttonLeaveSession"
                onClick={leaveSession}
              >
                경매종료
              </button>
              {/* <input
                className="btn btn-large btn-success"
                type="button"
                id="buttonSwitchCamera"
                onClick={switchCamera}
                value="Switch Camera"
              /> */}
            </div>

            {/* 메인 화면 띄우기 */}
            {mainStreamManager !== undefined ? (
              <div id="main-video" className="col-md-6" onClick={()=> removeMainStreamManager()}>
                <UserVideoComponent streamManager={mainStreamManager} />
              </div>
            ) : null}

            <hr />
      
            <div className="flex justify-between w-full h-[100%] mt-6">
              <div className='grid grid-cols-4 grid-rows-4 gap-4 w-[60%]'>
                {/* 현재 이 방 참여자들만 뿌려주게해줘 지금 이 반복문이 돌면서 이상한 것들이 자꾸 찎혀 */}
                {subscribers.map((sub, i) => (
                  JSON.parse(sub.stream.connection.data).clientData >= 0 && (
                    <div key={i} onClick={() => handleMainVideoStream(sub)}>
                      <UserVideoComponent streamManager={sub} />
                    </div>
                  )
                ))}
              </div>
              <div className='w-[40%] flex flex-col items-center'>
                <textarea
                  className='mt-3 w-full h-[500px] border-2 border-red-400 rounded-lg bg-white'
                  ref={videoLog}
                  disabled
                >
                
                  
                </textarea>  
                {auctionStart ? (
                  <div className="btn-conteiner mt-4" onClick={handleNextAuction}>
                    <a className="btn-content" href="#">
                      <span className="btn-title">다음 경매 진행</span>
                      <span className="icon-arrow">
                        <svg width="66px" height="43px" viewBox="0 0 66 43" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                          <g id="arrow" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <path id="arrow-icon-one" d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z" fill="#FFFFFF"></path>
                            <path id="arrow-icon-two" d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z" fill="#FFFFFF"></path>
                            <path id="arrow-icon-three" d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z" fill="#FFFFFF"></path>
                          </g>
                        </svg>
                      </span> 
                    </a>
                  </div>
                ) : (
                  <button className='auctionStartEnd mx-auto mt-4' onClick={handleStartAuction}>
                    경매 시작
                  </button>
                )}
                
              </div>
            </div>


            {/* {publisher !== undefined ? (
                <div className="stream-container col-md-6 col-xs-6" onClick={() => handleMainVideoStream(publisher)}>
                  <UserVideoComponent
                    streamManager={publisher} />
                </div>
              ) : null} */}
          </div>
        ) : null}
    </div>
  );
}