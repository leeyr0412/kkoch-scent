import {
  MDBCol,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
} from 'mdb-react-ui-kit';
import basicProfile from "@/assets/basicProfile.jpg";
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import "./btn.css"

interface pwChangeForm {
  newPw: string;
  newPwCheck: string;
}

const MyProfile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [bn, setBn] = useState('');
  const [reservCnt, setReservCnt] = useState(0);
  const [auctionCnt, setAuctionCnt] = useState(0);
  
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [curPwd, setCurPwd] = useState('');
  const [newPw, setNewPw] = useState("");
  const [newPwCheck, setNewPwCheck] = useState("");
	const [newPwValid, setNewPwValid ] = useState(false);
  const [newPwCheckValid, setNewPwCheckValid ] = useState(false);
	const [ notAllow, setNotAllow ] = useState(true);


	useEffect(() => {
    if (newPwValid && newPwCheckValid) {
      setNotAllow(false);
			return;
		}
		setNotAllow(true);
	}, [newPwValid, newPwCheckValid]);
  
  // 비밀번호 검증 함수
  const handleCurPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPw = e.target.value;
    setCurPwd(newPw);
  }

  // 비밀번호 검증 함수
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPw = e.target.value;
    setNewPw(newPw);
    
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (regex.test(newPw)) {
      setNewPwValid(true);
    } else {
      setNewPwValid(false);
    }
  }

  // 비밀번호 확인 검증 함수
  const handlePasswordCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPwCheck = e.target.value;
    setNewPwCheck(newPwCheck);
    
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (regex.test(newPwCheck)) {
      setNewPwCheckValid(true);
    } else {
      setNewPwCheckValid(false);
    }
  }

  const {
    register, // input 요소를 react-hook-form과 연결시켜 검증 규칙을 적용하는 메서드
    formState: { errors }, // form state 정보 담는 객체
    handleSubmit, // form을 제출할 때 실행할 함수.
    setError, // error 관련 설정 함수
  } = useForm<pwChangeForm>({ mode: 'onBlur' }) // onBlur 이벤트 발생할 때 validation 실행

  // submitHandler
  const onValid = (data: pwChangeForm) => {
    if (data.newPw !== data.newPwCheck) {
      setError(
        'newPwCheck',
        { message: '비밀번호가 일치하지 않습니다.' },
        { shouldFocus: true },
      );
    }
  }
  
  useEffect(() => {
    axios({
      method: 'get',
      url: `https://i9c204.p.ssafy.io/api/user-service/${secureLocalStorage.getItem('memberkey')}/reservations?pageNum=0`,
      // url: `/api/api/user-service/${secureLocalStorage.getItem('memberkey')}/reservations?pageNum=0`,
      headers: {
        Authorization: `Bearer ${secureLocalStorage.getItem("token")}`
      }
    })
    .then((res) => {
      setReservCnt(res.data.data.totalElements) 
    })
    .catch(err => {
      console.log(err);
    })
  
    axios({
      method: "get",
      url: `https://i9c204.p.ssafy.io/api/admin-service/trades/${secureLocalStorage.getItem("memberkey")}?term=1&page=0`,
      // url: `/api/api/admin-service/trades/${secureLocalStorage.getItem("memberkey")}?term=1&page=0`,
      headers: {
        Authorization: `Bearer ${secureLocalStorage.getItem("token")}`
      }
    })
    .then(res => {
      setAuctionCnt(res.data.data.totalElements);
    })
    .catch(err => {
      console.log(err);
    })
  
    axios({
      method: 'get',
      url: `https://i9c204.p.ssafy.io/api/user-service/${secureLocalStorage.getItem("memberkey")}`,
      // url: `/api/api/user-service/${secureLocalStorage.getItem("memberkey")}`,
      headers: {
        Authorization: `Bearer ${secureLocalStorage.getItem("token")}`
      }
    })
    .then((res) => {
      setUsername(res.data.data["name"]);
      setEmail(res.data.data["email"]);
      setTel(res.data.data["tel"]);
      setBn(res.data.data["businessNumber"]);
    })
  }, [])


  // 비밀번호 변경
  const handlePasswordChange = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    axios({
      method: "patch",
      // url: `/api/api/user-service/${secureLocalStorage.getItem("memberkey")}/pwd`,
      url: `https://i9c204.p.ssafy.io/api/user-service/${secureLocalStorage.getItem("memberkey")}/pwd`,
      headers: {
        "Content-Type" : "application/json",
        Authorization : `Bearer ${secureLocalStorage.getItem("token")}`
      },
      data: {
        "currentPwd" : curPwd,
        "newPwd" : newPw
      },
    })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      // 비밀번호 변경 실패 처리
      console.log(err);
    });
  };
  return (
    <>
      <MDBRow>
        <MDBCol lg="4">
          <MDBCard className="mb-4">
            <MDBCardBody className="text-center flex flex-col items-center justify-center">
              <MDBCardImage
                src={basicProfile}
                alt="profile"
                className="rounded-circle w-[150px] mb-3"
                fluid />
              <h4 className="text-bold">{username} </h4>
              <div className='flex justify-around w-[100%] mt-4'>
                <p className="text-muted">낙찰 건수: {reservCnt} 건</p>
                <p className="text-muted">예약 건수: {auctionCnt} 건</p>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol lg="8">
          <MDBCard className="mb-4">
            <MDBCardBody>
              <MDBRow>
                <MDBCol sm="3">
                  <MDBCardText>이름</MDBCardText>
                </MDBCol>
                <MDBCol sm="9">
                  <MDBCardText className="text-muted">{username}</MDBCardText>
                </MDBCol>
              </MDBRow>
              <hr />
              <MDBRow>
                <MDBCol sm="3">
                  <MDBCardText>Email</MDBCardText>
                </MDBCol>
                <MDBCol sm="9">
                  <MDBCardText className="text-muted">{email}</MDBCardText>
                </MDBCol>
              </MDBRow>
              <hr />
              <MDBRow>
                <MDBCol sm="3">
                  <MDBCardText>Phone</MDBCardText>
                </MDBCol>
                <MDBCol sm="9">
                  <MDBCardText className="text-muted">{tel}</MDBCardText>
                </MDBCol>
              </MDBRow>
              <hr />
              <MDBRow>
                <MDBCol sm="3">
                  <MDBCardText>사업자 번호</MDBCardText>
                </MDBCol>
                <MDBCol sm="9">
                  <MDBCardText className="text-muted">{bn}</MDBCardText>
                </MDBCol>
              </MDBRow>
              <hr />
              <MDBRow>
                <MDBCol sm="3">
                  <MDBCardText>비밀번호 변경</MDBCardText>
                </MDBCol>
                <MDBCol sm="9">
                {showChangePassword ? (
                  <form className='border flex flex-col' onSubmit={handleSubmit(onValid)}>
                    <input
                      type="password"
                      placeholder='기존 비밀번호를 입력해주세요'
                      onChange={ handleCurPassword }
                      value={curPwd}
                    />
                    <input
                      type="password"
                      {...register('newPw', {
                        required: '비밀번호를 입력해주세요.',
                        minLength: {
                          value: 8,
                          message: '비밀번호는 숫자, 영문 대소문자, 특수문자를 포함한 8글자 이상 입력해주세요.',
                        },
                        pattern: {
                          value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                          message: '비밀번호는 숫자, 영문 대소문자, 특수문자를 포함한 8글자 이상 입력해주세요.',
                        },
                      })}
                      placeholder='비밀번호를 입력해주세요'
                      onChange={ handlePassword }
                    />
                      {/* onChange={(e) => setNewPassword(e.target.value)} */}
                    <div className=''>
                      {
                        !newPwCheckValid && newPwCheck.length > 0 && (
                          <div>
                            {errors?.newPwCheck?.message}
                          </div>
                        )
                      }
                    </div>
                    <input
                      type="password"
                      {...register('newPwCheck', {
                        required: '비밀번호를 입력해주세요.',
                        minLength: {
                          value: 8,
                          message: '비밀번호는 숫자, 영문 대소문자, 특수문자를 포함한 8글자 이상 입력해주세요.',
                        },
                      })}
                      onChange={ handlePasswordCheck }
                      placeholder='비밀번호를 한 번 더 입력해주세요'
                    />
                    <div className=''>
                      {
                        !newPwCheckValid && newPwCheck.length > 0 && (
                          <div>
                            {errors?.newPwCheck?.message}
                          </div>
                        )
                      }
                    </div>
                    <div className='flex justify-end mt-2'>
                      <button className="changePwbtn" onClick={handlePasswordChange} disabled={notAllow}>
                        변경하기
                      </button>
                      <button className="changePwbtn ml-3" onClick={() => setShowChangePassword(false)}>
                        취소
                      </button>
                    </div>
                  </form>
                ) : (
                  <MDBCardText className="text-muted">
                    <button className='changePwbtn' onClick={() => setShowChangePassword(true)}>
                      비밀 번호 변경하기
                    </button>
                  </MDBCardText>
                )}
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        
      </MDBRow>
    </>
  )
}

export default MyProfile