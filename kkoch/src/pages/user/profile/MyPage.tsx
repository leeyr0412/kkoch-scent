import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBCard
} from 'mdb-react-ui-kit';

import { useEffect, useState } from 'react';
import MyAuctionList from './MyAuctionList';
import MyProfile from './MyProfile';
import MyReservation from '@/pages/user/MyReservation/MyReservation';
import secureLocalStorage from 'react-secure-storage';
import { Navigate } from 'react-router-dom';

const MyPage = () => {
  const [basicActive, setBasicActive] = useState('tab1');
  const isLoggedIn = secureLocalStorage.getItem("memberkey") && secureLocalStorage.getItem("token");

  useEffect(() => {
    !isLoggedIn && alert("로그인 후 이용 가능합니다.")
  }, [isLoggedIn])

  const handleBasicClick = (value: string) => {
    if (value === basicActive) {
      return;
    }

    setBasicActive(value);
  };

  return (
    <div>
    {
      isLoggedIn ? 
      <section>
      <MDBContainer className="py-5">
        
        <MDBCard className='mb-4'>
          <h1 className='pl-5 pt-3'>마이페이지</h1>
          <MDBTabs className='rounded-3'>
            <MDBTabsItem>
              <MDBTabsLink onClick={() => handleBasicClick('tab1')} active={basicActive === 'tab1'}>
                <span className='text-base'>
                  프로필 변경
                </span>
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink onClick={() => handleBasicClick('tab2')} active={basicActive === 'tab2'}>
                <span className='text-base'>
                  낙찰 현황
                </span>
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink onClick={() => handleBasicClick('tab3')} active={basicActive === 'tab3'}>
                <span className='text-base'>
                  화훼 예약 현황
                </span>
              </MDBTabsLink>
            </MDBTabsItem>
          </MDBTabs>
        </MDBCard>

        <MDBTabsContent>
          <MDBTabsPane show={basicActive === 'tab1'}><MyProfile/></MDBTabsPane>
          <MDBTabsPane show={basicActive === 'tab2'}><MyAuctionList/></MDBTabsPane>
          <MDBTabsPane show={basicActive === 'tab3'}><MyReservation/></MDBTabsPane>
        </MDBTabsContent>
      </MDBContainer>
    </section> :
    
      <Navigate to='/login' replace={true} />
    }
    </div>
  )
}

export default MyPage