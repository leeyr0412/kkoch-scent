import React, { useState, useEffect, useRef } from 'react';
import { OpenVidu, Session } from 'openvidu-browser';
import axios from 'axios';
// import Video from '../buyer/VideoRoom';


const AuctionWaiting: React.FC = () => {
  const [token, setToken] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const [subscribers, setSubscribers] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
  

  const subscriberContainer = useRef<HTMLDivElement | null>(null);

  const initSessionAndToken = async () => {
    try {
      // OpenVidu 서버에 세션 생성 요청 보내기
      const sessionResponse = await axios.post('https://i9c204.p.ssafy.io:8443/api/sessions', null, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Basic ' + btoa('OPENVIDUAPP:1q2w3e4r'),
        },
      });
      const sessionId = sessionResponse.data;

      // OpenVidu 서버에 토큰 생성 요청 보내기
      const tokenResponse = await axios.post(`https://i9c204.p.ssafy.io:8443/api/sessions/${sessionId}/connections`, null, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Basic ' + btoa('OPENVIDUAPP:1q2w3e4r'),
        },
      });
      // console.log('포트번호', tokenResponse.data)
      setToken(tokenResponse.data.split('&')[1].split('=')[1]);
    }
    catch (error) {
      console.error('Error:', error.response.data);
    }
  }
  
  useEffect(() => {
    initSessionAndToken();
  }, [])

  useEffect(() => {
    if (token) {
      const OV =  new OpenVidu()
      const mySession = OV.initSession()
      // setSession(mySession)
      mySession.connect(token);
      // console.log("--------", token)

      const publisher = OV.initPublisher(subscriberContainer.current,
        {
          audioSource: undefined, // The source of audio. If undefined default audio input
          videoSource: undefined, // The source of video. If undefined default video input
          publishAudio: true,     // Whether you want to start the publishing with audio unmuted or muted
          publishVideo: true,     // Whether you want to start the publishing with video enabled or disabled
          resolution: '640x480',  // The resolution of your video
          frameRate: 30,          // The frame rate of your videot
          mirror: false           // Whether to mirror your local video or not
        },
        (error) => {
          if (error) {
            console.error('Error Publisher', error)
          } else {
            console.log('initialized')
          }
        }
      );

      setPublisher(publisher);
      setSession(mySession);
      // console.log("asdjfklasjfwvmoqre", publisher)
     
      return () => {
        // mySession.disconnect();
        mySession.off('streamCreated');
      };         
    }
  }, [token, isCameraOn])

  useEffect(() => {
    if (session) {
      // 이벤트 핸들러 등록
      session.on('streamCreated', handleStreamCreated);
      session.on('streamDestroyed', handleStreamDestroyed);
      return () => {
        // 이벤트 핸들러 제거
        session.off('streamCreated', handleStreamCreated);
        session.off('streamDestroyed', handleStreamDestroyed);
      };
    }
  }, [session, publisher]);
  
  // 새로운 스트림 생성 시 구독자 추가
  const handleStreamCreated = (event) => {
    const subscriber = session.subscribe(event.stream, undefined);
    if (!subscriber && event.stream.connection.connectionId !== session.connection.connectionId) {
      // subscribers 배열에 구독자 추가
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
      console.log('여기여기구독', subscribers)
    }
  };
  
  // 스트림 제거 시 구독자 제거
  const handleStreamDestroyed = (event) => {
    // event.preventDefault(); // 불필요한 코드입니다.
    // subscribers 배열에서 해당 구독자 제거
    setSubscribers((prevSubscribers) => prevSubscribers.filter((sub) => sub !== event.stream.streamManager));
  };

  useEffect(() => {
    if (session) {
      console.log("세션이요", session)
      session.on('streamCreated', (e) => {
        console.log(1111111);
        const subscriber = session.subscribe(e.stream, undefined);
        console.log("구독자", subscriber);
        if (!subscriber && e.stream.connection.connectionId !== session.connection.connectionId) {
          setSubscribers(e.stream);
          session.publish(publisher);
          console.log('이거이거이거')
          publisher.addVideoElement(subscriberContainer);
        }
      });
    }
  }, [publisher])

  return (
    <div>
      <div className="mx-auto w-5/6 items-center justify-center md:flex md:flex-wrap md:h-5/6">
        <div ref={subscriberContainer} className='w-full flex justify-center'>

        </div>
      </div>
      {/* 구독자들 렌더링 */}
      {subscribers && subscribers.map((sub, index) => (
        <div key={index} ref={subscriberContainer} className='w-full flex justify-center'></div>
      ))}
      </div> 
  )
}

export default AuctionWaiting;
