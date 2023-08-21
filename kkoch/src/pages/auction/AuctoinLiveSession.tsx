import React, { useCallback, useEffect, useRef, useState } from 'react';
import { OpenVidu } from 'openvidu-browser';
import CameraOff from '@/assets/cameraOff.png';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import UserVideoComponent from './UserVideoComponent';
import WebSocketComponent from '@/components/webSocket/webSocket';
import './AuctoinLiveSession.css';
import AuctionWaiting from './AuctionWaitingRoom';
import { toast } from 'react-toastify';

const AuctionWaitingRoom: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  console.log("여기 넘어온거 확인")
  const { sessionId } = location.state;

  const [mySessionId, setMySessionId] = useState(sessionId)
  const [myUserName, setMyUserName] = useState(`${Math.floor(Math.random() * 100)}`)
  const [session, setSession] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [publisher, setPublisher] = useState(undefined);
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null);
  // const [token, setToken] = useState(''); // openVidu 세션 요청에 필요한 토큰
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
  const OV = useRef(new OpenVidu());

  console.log(sessionId);
  const subscriberContainer = useRef<HTMLDivElement | null>(null);
  const cameraNotify= () => toast.error('카메라를 켜주세요!', {
    position:"top-center", // 알람 위치 지정
    autoClose:2000, // 자동 off 시간
    theme:"light"
  });

  useEffect(() => {
    setMySessionId(sessionId);
  }, [])
    
  // const response = axios.get('/api/api/admin-service/auction-articles/api?startDateTime=2023-08-06&endDateTime=2023-08-06&code=절화&type&name&region&page=0')

  // console.log('여기', response)
  
  // 세션 열기
  const joinSession = useCallback(() => {
    const mySession = OV.current.initSession();
    // 웹 소캣도 연결
    // const socket = new WebSocket('wss://i9c204.p.ssafy.io/ws/');
    
    // socket.addEventListener('open', () => {
    //   console.log("---------------------------------")
    //   console.log('WebSocket connected'); // 웹소켓 연결 확인 메시지 출력
    // });

    mySession.on('streamCreated', (event) => {
      const subscriber = mySession.subscribe(event.stream, undefined);
      // const name = JSON.parse(event.stream.connection.data).clientData
      setSubscribers((subscribers) => [...subscribers, subscriber]);
    });
    
    mySession.on('streamDestroyed', (event) => {
      console.log('Stream destroyed:', event.stream.connection.data);
      // const name = JSON.parse(event.stream.connection.data).clientData
      deleteSubscriber(event.stream.streamManager);
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
      session.disconnect();
    }
    navigate("/auction")

    // Reset all states and OpenVidu object
    OV.current = new OpenVidu();
    setSession(undefined);
    setSubscribers([]);
    setMySessionId(null);
    setMyUserName(`${Math.floor(Math.random() * 100)}`);
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

  // 카메라 상태를 토글하는 함수
  const toggleCamera = () => {
    // if (publisher) {
      // if (isCameraOn) {
        //   publisher.publishVideo(false); // 카메라 끄기
        // } else {
          //   publisher.publishVideo(true); // 카메라 켜기
          // }
          setIsCameraOn((prev) => !prev); // isCameraOn 상태를 반전시킴
          console.log('카메라상태', isCameraOn)
    // }
  };

  return (
    <div className="container gap-16 bg-gray-20 py-10">
      <h1 className='title-content-center'>aT화훼 공판장 (양재동) 경매방</h1>
      {session === undefined ? (
        <div id="join">
          <div className="mx-auto w-5/6 items-center justify-center md:flex md:flex-wrap md:h-5/6">
            {isCameraOn ? (
              <AuctionWaiting />
              // <div ref={subscriberContainer} className='w-full flex justify-center'>
              // </div>
              ) : (
                <img src={CameraOff} alt="" />
            )}
          </div>
          {/* 구독자들 렌더링 */}
          {subscribers && subscribers.map((sub, index) => (
            <div key={index} ref={subscriberContainer} className='w-full flex justify-center'></div>
          ))}
          <div className='button-container'>
            <button className='camera-button' onClick={toggleCamera}>{isCameraOn ? '카메라 끄기' : '카메라 켜기'}</button>
            <button className={`join-button ${isCameraOn ? 'join-button-green' : 'join-button-red'}`} onClick={() => {
              if (!isCameraOn) {
                // alert('카메라를 먼저 켜주세요.');
                // return;
                cameraNotify();
                return;
              }
              joinSession();
            }}
            >
              입장하기
            </button>
            {/* <Link to='/auction/liveroom' state={{ auctionArticles: auctionArticles, sessionId: mySessionId}}>
            </Link> */}
          </div>
        </div>
      ) : null }

      {session !== undefined ? (
        <div className='mt-3'>
          <div className='flex justify-between items-center'>
            <h1 id="session-title">{mySessionId}</h1>
            <input
              className="btn btn-large btn-danger"
              type="button"
              id="buttonLeaveSession"
              onClick={leaveSession}
              value="경매 나가기"
            />

          </div>

          <hr />

          <div className='flex justify-between'>
            <div id="video-container" className="col-md-6" >
              {subscribers.map((sub, i) => (
                JSON.parse(sub.stream.connection.data).clientData && (
                  <div key={sub.id} className="stream-container">
                    <UserVideoComponent streamManager={sub} />
                  </div>
                )
                ))}
            </div>
              <WebSocketComponent />
          </div>
        </div>
      ) : null}
      {/* <div className='button-container'>
        <div>
        <button className='normal-button'>마이크 켜기</button>
        </div>
        <div>
        <button className='normal-button'>비디오 켜기</button>
        </div>
        <div>
        <button className='normal-button'>위시리스트 보기</button>
        </div>
        <div>
        <button className='normal-button'>금일 경매 목록</button>
        </div>
      </div> */}
    </div> 
  )
}

export default AuctionWaitingRoom;
