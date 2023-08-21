/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react"; 
import { Bars3Icon, XMarkIcon, UserCircleIcon, BellAlertIcon } from "@heroicons/react/24/solid";
import Logo from "@/assets/logo.png";
import { Link, useNavigate } from 'react-router-dom';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useDispatch, useSelector } from "react-redux";
import { logout, setUsername } from '@/reducer/store/authSlice';
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import "./index.css"
import { RootState } from "@/reducer/store";
import { ToastContainer } from "react-toastify";
// import ActionButton from "@/shared/ActionButton";

type Props = {
  isTop: boolean;
}

const Navbar = ({isTop} : Props) => {
  const flexBetween = "flex items-center justify-between";
  
  // 모바일 용 토글버튼은 false로 초기화 
  const [isMenuToggled, menuToggle] = useState<boolean>(false);
  const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");
  const navbarBackground = isTop ? "" : "bg-primary-100 drop-shadow";

  // 회원 이모지 누르면 나올 dropdown
  const [isDropdownOpen, setDropdownOpen] = useState(false); 
  // Navbar 드롭다운
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 로그인 여부 확인
  const isLoggedIn = secureLocalStorage.getItem("memberkey") && secureLocalStorage.getItem("token");
  const [isLoggedOut, setIsLoggedOut] = useState(true);

	const username = useSelector((state : RootState) => state?.auth?.username); // Redux 스토어의 email 상태 가져오기

  console.log("username", username)

  useEffect(() => {
    // isLoggedIn 상태가 로그인되어 있는 상태인 경우에만 실행
    if (isLoggedIn) {
      axios({
        method: "get",
        // url: `/api/api/user-service/${secureLocalStorage.getItem("memberkey")}`,
        url: `https://i9c204.p.ssafy.io/api/user-service/${secureLocalStorage.getItem("memberkey")}`,
        headers: {
          Authorization: `Bearer ${secureLocalStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          // dispatch를 사용하여 username 변경 액션을 실행
          dispatch(setUsername(res.data.data["name"]));
        })
        .catch(err => console.log(err));
    }
  }, [isLoggedIn]); // isLoggedIn이 변경될 때마다 useEffect 실행



  const dropMenuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleOutsideClose = (e: {target: any}) => {
    // useRef current에 담긴 엘리먼트 바깥을 클릭 시 드롭메뉴 닫힘
      if(isDropdownOpen && (!dropMenuRef.current.contains(e.target))) setDropdownOpen(false);
      if(isNotificationOpen && (!dropMenuRef.current.contains(e.target))) setNotificationOpen(false);
    };
    document.addEventListener('click', handleOutsideClose);
    
    return () => document.removeEventListener('click', handleOutsideClose);
  }, [isDropdownOpen, isNotificationOpen]);
  
  useEffect(() => {
    setIsLoggedOut(!isLoggedIn);
  }, [isLoggedIn]);

  const handleLogout = () => {
    // 로그아웃
    if(confirm("로그아웃 하시겠습니까?")) {
      setDropdownOpen(false);
      dispatch(logout());
      navigate("/");
      window.location.reload();
    }
  }

  // 로그인 되어 있으면 알림 내역 가져오기
  const getNotification = () => {
    if(isLoggedIn) {
      axios({
        method: "get",
        url: `https://i9c204.p.ssafy.io/api/user-service/${secureLocalStorage.getItem("memberkey")}/alarms`,
        // url: `/api/api/user-service/${secureLocalStorage.getItem("memberkey")}/alarms`,
        headers: {
          Authorization: `Bearer ${secureLocalStorage.getItem("token")}`
        }
      })
      .then((res) => {
        console.log(res.data.data);
        setNotifications(res.data.data);
      })
      .catch(err => console.log(err))
    }
  }

  const formattedDate = (date) => {
    // 알림 생성 시간을 Date 객체로 변환
    console.log(date)
    const createdDate = new Date(date);
    const now = new Date();
    const timeDifference = now.getTime() - createdDate.getTime();
    console.log(now.getTime(),createdDate,  timeDifference)
    let tmpTime;

    // 시간 차이에 따라 표시 포맷 결정
    if (timeDifference < 60000) {
      tmpTime = "방금 전";
    } else if (timeDifference < 3600000) {
      const minutes = Math.floor(timeDifference / 60000);
      tmpTime = `${minutes}분 전`;
    } else if (timeDifference < 86400000) {
      const hours = Math.floor(timeDifference / 3600000);
      tmpTime = `${hours}시간 전`;
    } else {
      // 월/일 시간:분 포맷으로 변경
      tmpTime = `${createdDate.getMonth() + 1}.${createdDate.getDate()} ${createdDate.getHours()}:${createdDate.getMinutes()}`;
    }
    return tmpTime;
  }

  return (
    <nav>
      <div ref={dropMenuRef}
        className={`${navbarBackground} ${flexBetween} top-0 z-30 w-full py-3 border-b-2`}
      >
        <div className={`${flexBetween} mx-auto w-5/6`}>
          <div className={`${flexBetween} w-full gap-16`}>
            {/* 로고 이미지 */}
            <Link to="/">
              <img src={Logo} alt="logo" className="h-20"/>
            </Link>

            {/* 메뉴 */}
            {isAboveMediumScreens ? // PC화면일때 : 모바일 화면일때 
              (<div className={`${flexBetween} w-full `}>
                <div className={`${flexBetween} gap-8 text-xl`}>
                  <Link to="/auction" className="nav-link"> 경매</Link>
                  <Link to="/flowers/절화" state ={{ code: "절화"}} className="nav-link"> 화훼정보</Link>
                  <Link to="/notices" className="nav-link">공지사항</Link>
                </div>
                  { isLoggedOut ? (
                    <div className={`${flexBetween} gap-8 text-xl`}>
                      <Link to="/login" className="nav-link">로그인</Link>
                      <Link to="/signup" className="nav-link">회원가입</Link>
                    </div>
                    ) : (
                      <div className="flex justify-between">
                        <button
                          className="flex justify-between items-center"
                          onClick={() => {
                            setNotificationOpen(!isNotificationOpen);

                            if (isDropdownOpen) setDropdownOpen(!isDropdownOpen);
                            setNotificationOpen(!isNotificationOpen)
                            
                            getNotification()
                          }}
                        >
                          <BellAlertIcon className="h-10 w-10 text-red-500"/>
                        </button>
                        <button className="flex justify-between items-center" 
                                onClick={() => {
                                  if (isNotificationOpen) setNotificationOpen(!isNotificationOpen);
                                  setDropdownOpen(!isDropdownOpen);
                                }}
                        >
                          <UserCircleIcon  className="h-10 w-10 text-red-500"/>
                          <span className="text-xl">{username}님</span>
                        </button>
                      </div>
                  )}
              </div>)
              : (
                  <button
                    className="rounded-full bg-secondary-500 p-2"
                    onClick={() => menuToggle(!isMenuToggled)}
                  >
                    <Bars3Icon className="h-6 w-6 text-white" />
                  </button>
              )}
          </div>
        </div>
      </div>  
      
      {/* 모바일 화면 부분 */}
      {!isAboveMediumScreens && isMenuToggled && (
        <div className="fixed right-0 bottom-0 z-40 h-full w-[300px] bg-primary-100 drop-shadow-xl">
          
          {/* 메뉴 닫기 */}
          <div className="flex justify-end p-12 ">
            <button onClick={() => menuToggle(!isMenuToggled)}>
              <XMarkIcon className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          {/* 메뉴 목록 */}
          <div className="ml-[33%] flex flex-col gap-10 text-2xl">
            <Link to="/auction"> 경매</Link>
            
          </div>
        </div>
      )}

      {/* 회원 메뉴 드롭다운 */}
      { isAboveMediumScreens && isDropdownOpen && (
        <div className="absolute z-20 top-20 right-20 bg-white border border-gray-300 rounded shadow-lg">
          <ul className="flex flex-col justify-center pl-0 mb-0">
            <li>
              <Link to="/mypage" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>마이페이지</Link>
            </li>
            <li className="border-t">
              <a onClick={handleLogout} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">로그아웃</a>
            </li>
            <li className="border-t">
              {/* Add an event handler for 회원탈퇴 */}
              <a className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">회원탈퇴</a>
            </li>
          </ul>
        </div>
      )}

      {/* 알림 드롭다운 */}
      { isAboveMediumScreens && isNotificationOpen && (
        <div className="absolute z-20 top-20 right-20 bg-white border border-gray-300 rounded shadow-lg">
          {/* 알림 내용 */}
          {notifications.map((noti, index) => (
            <div key={index} className="p-2 border-b flex justify-between items-center">
              <div className="mr-6">
                {formattedDate(noti.createdDate)} - {noti.content}
              </div>
              <button
                className="text-gray-500 hover:text-red-500 mr-2"
                onClick={() => {
                    // 해당 알림을 삭제하는 로직을 추가하세요
                    // notifications 배열에서 해당 알림을 제거하는 방식으로 구현하면 됩니다.
                    const updatedNotifications = [...notifications];
                    updatedNotifications.splice(index, 1);
                    setNotifications(updatedNotifications);
                  }}
                >
                X
              </button>
            </div>
          ))}
        </div>
      )}
      <ToastContainer limit={1}/>
    </nav>
  )
}

export default Navbar