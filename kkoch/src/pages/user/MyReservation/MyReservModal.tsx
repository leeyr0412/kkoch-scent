import React, { useState } from 'react';
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBInput
} from 'mdb-react-ui-kit';
import SelectForm from '@/pages/user/MyReservation/SelectForm';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import Select from "react-select";

const gradeOptions = [
  {value: "SUPER", label: "특"},
  {value: "ADVANCED", label: "상"},
  {value: "NORMAL", label: "보"},
];

export default function MyReservModal({ onReservationAdded }) {
  const [centredModal, setCentredModal] = useState(false);

  // Select 컴포넌트에서 받아온 값들 (카테고리 제외)
  const [selectedFlower, setSelectedFlower] = useState('');
  const [selectedVariety, setSelectedVariety] = useState('');

  // Input 값들 설정
  const [grade, setGrade] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const [isGradeValid, setIsGradeValid] = useState(true);
  const [quantityWarning, setQuantityWarning] = useState(false);

  const toggleShow = () => setCentredModal(!centredModal);
  
  // 예약 submit
  const reservSubmit = () => {
    // 등급이 특, 상, 보가 아니면 다시 입력하라고 경고
    if (!grade) {
      setIsGradeValid(false);
      return;
    }   
    // Check if "단수" exceeds 20
    if (parseInt(quantity) > 20) {
      setQuantityWarning(true);
      return;
    }else {
      setQuantityWarning(false);
    }

    // Prepare the data to be submitted
    const formData = {
      "type": selectedFlower,
      "name": selectedVariety,
      "grade": grade,
      "count": quantity,
      "price": price,
    };

    axios({
      method: 'post',
      url: `https://i9c204.p.ssafy.io/api/user-service/${secureLocalStorage.getItem("memberkey")}/reservations`,
      // url: `/api/api/user-service/${secureLocalStorage.getItem("memberkey")}/reservations`,
      headers: {
        "Content-Type" : "application/json",
        Authorization : `Bearer ${secureLocalStorage.getItem("token")}`
      },
      data: formData
    })
    .then((res) => {
      console.log(res)
      alert(`${selectedFlower} - ${selectedVariety} (이)가 예약 되었습니다`);
      setCentredModal(!centredModal);
      // 여기서 부모 컴포넌트에다가 실시간으로 회원낙찰 내역을 호출
      onReservationAdded();
    })
    .catch(err => console.log(err)) 
  }
  return (
    // .changePwbtn {
    //   background-color: #FFC132;
    //   color: black;
    //   border: none;
    //   padding: 8px 16px;
    //   border-radius: 4px;
    //   cursor: pointer;
    //   display: flex;
    //   align-items: center;
    //   justify-content: center;
    //   height: 70%;
    // }
    
    // /* 버튼에 호버 효과 추가 (선택사항) */
    // .changePwbtn:hover {
    //   background-color: #F25477;
    // }
    <>
      <div className='bg-[#FFC132] color-black h-[40px] w-[140px] rounded-4 text-center pt-[7px] cursor-pointer hover:bg-[#F25477]' onClick={toggleShow}>화훼 예약 하기</div>

      <MDBModal tabIndex='-1' show={centredModal} setShow={setCentredModal}>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>화훼 예약 하기</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody className='flex flex-col'>
              <form className=''>
                <SelectForm 
                  onFlowerChange={setSelectedFlower}
                  onVarietyChange={setSelectedVariety}
                />
                <div className='mt-3 flex justify-between'>
                  <Select
                    className="w-[100%]"
                    onChange={(e) => setGrade(e.value)}
                    options={gradeOptions}
                    placeholder="등급 선택"
                    value={gradeOptions.filter(function (option) {
                      return option.value === grade;
                    })}
                  />

                  <MDBInput
                    className=''
                    label='단수'
                    value={quantity}
                    type='number'
                    max={20}
                    onChange={(e) => setQuantity(e.target.value)}
                    />

                  <MDBInput
                    className=''
                    label='가격'
                    value={price}
                    type='number'
                    onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                {!isGradeValid && (
                  <div className='text-red text-base'>올바른 등급을 입력해주세요. (특, 상, 보 중 하나)</div>
                  )}
                {quantityWarning && (
                  <div className='text-red text-base'>
                    최대 단수는 '20' 입니다
                  </div>
                )}
              </form>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={toggleShow}>
                취소
              </MDBBtn>
              <MDBBtn onClick={reservSubmit}>예약 하기</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}