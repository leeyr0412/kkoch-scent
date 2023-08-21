import React from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const AuctionModal = ({ modalMessage, onClose }) => {
  React.useEffect(() => {
    console.log("모달창 몇번 열리니?", modalMessage)
    if (modalMessage === "낙찰 성공") {
      toast.success("낙찰 성공!", {
        position: toast.POSITION.TOP_CENTER, // 알람 위치 지정
        autoClose: 3000, // 자동 off 시간
        hideProgressBar: false, // 진행시간바 숨김
        rtl: false, // 알림 좌우 반전
        theme:"light",
      });
    } else if (modalMessage === "이미 낙찰되었습니다.") {
      toast.error("낙찰 실패!", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }, [modalMessage]);
  
  return (
    <div>
    </div>
  )
}

export default AuctionModal