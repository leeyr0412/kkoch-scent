import { useEffect } from "react";
import { Navigate } from 'react-router-dom';
import LocationButton from "@/components/buttons/LocationButton"
import secureLocalStorage from 'react-secure-storage';
import { toast } from "react-toastify";

const ActionReady = () => {
  const location = ["aT화훼공판장(양재동)", "부산화훼공판장(엄궁동)", "광주원예농협(풍암)"
                    , "한국화훼농협(음성)", "부산경남화훼농협(강동동)", "한국화훼농협(과천)", "영남화훼농협(김해)"];
  const isLoggedIn = secureLocalStorage.getItem("memberkey") && secureLocalStorage.getItem("token");
  const needLogin = () => toast.info("로그인 후 이용 가능합니다.", {
    position: "top-center",
    hideProgressBar: true,
    autoClose: 2000
    }
  )
  
  useEffect(() => {
    !isLoggedIn && needLogin();
  }, [isLoggedIn])

  return (
    <div>
      {
        isLoggedIn ? 
          <section className="gap-16 bg-gray-20 py-10 "> 
            <div className="flex items-center justify-center">
              <h1>지역을 선택해주세요</h1>
            </div>
            {/* mx-auto w-5/6 items-center justify-center md:flex md:flex-wrap md:h-5/6 */}
            {/* flex items-center justify-center flex-col md:flex-row mt-[150px] */}
            <div className="flex items-center justify-center flex-col mt-[150px]">
              <div>
                <LocationButton location={location[0]} type="user"/>
                <LocationButton location={location[1]} type="user"/>
                <LocationButton location={location[2]} type="user"/>
              </div>
              <div className="mt-[100px]">
                <LocationButton location={location[3]} type="user"/>
                <LocationButton location={location[4]} type="user"/>
                <LocationButton location={location[5]} type="user"/>
                <LocationButton location={location[6]} type="user"/>
              </div>
            </div>
          </section>              
        :
        <Navigate to='/login' replace={true} />
      }
      
    </div>
  )
}

export default ActionReady