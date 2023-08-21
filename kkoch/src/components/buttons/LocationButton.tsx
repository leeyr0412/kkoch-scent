import { useNavigate } from 'react-router-dom';
import './LocationButton.css';
import { toast } from 'react-toastify';

type Props = {
	location: React.ReactNode;
	type: string;
}

const LocationButton = ({location, type } : Props) => {
	const navigate = useNavigate();
	const notifyAlert = () => toast.info("경매 시작 전입니다.", {
		position:"top-center", // 알람 위치 지정
		autoClose:2000, // 자동 off 시간 // 클릭으로 알람 닫기
		theme:"light", // 알람 개수 제한
	})
	const blockLocation = () => toast.warning("서비스 준비중입니다.", {
		position:"top-center",
		autoClose: 2000,
		theme: "light",
	})

	// 양재 지역만 활성화 하기 위한 handler
  const handleCheck = () => {
    if (location === "aT화훼공판장(양재동)") {
			if(type==="admin"){
				navigate("/admin/openSession");
			}else if(type==="user"){
				// 소캣 통신 연결
				const socket = new WebSocket('wss://i9c204.p.ssafy.io/ws/');

				// 웹 소캣 연결
				socket.addEventListener('open', () => {
					console.log("---------------------------------")
					console.log('WebSocket connected'); // 웹소켓 연결 확인 메시지 출력
					socket.send(JSON.stringify({role:"client"}))
				});

				// 서버에 들어가자마자 openVidu 방 코드 받기
				socket.addEventListener("message", (e) => {
					const message = e.data;
					console.log("getmessage", message)
					console.log(message ? true:false)
					// 들어갔을때 관리자가 방을 열었으면 sessionId가 포함된 메세지를 받을것이고
					// Json으로 파싱하여 방 session을 받는다.
					if (message!=="not start auction") {
							// const sessionId = JSON.parse(message).sessionId;
							navigate("/auction/liveSession", {   
							state: {
								sessionId: message,
							}});

							return;
					}  else {
						notifyAlert();
						socket.close(); // 소캣 연결 종료
					}
				});
				
		
			}else{
				alert("잘못된 접근입니다.")
			}
    } else {
      blockLocation();
    }
  };

  return (
		<button className='locationBtn mx-6' onClick={handleCheck}>
			<span className="button_top text-2xl font-black"> {location}
			</span>
		</button>
		// <button className="locationBtn mx-6" onClick={handleCheck}>  </button>
		
  )
}

export default LocationButton