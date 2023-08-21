import React, { useEffect, useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { login } from '@/reducer/store/authSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from "@/assets/logo.png";
// import { RootState } from '@/reducer/store';
import { toast } from 'react-toastify';

const Login = () => {
	const navigate = useNavigate();
	const { state } = useLocation();

	// 만약 회원가입에서 넘어왔으면 이메일을 바로 대입
	// let emailFromRedux = useSelector((state:RootState) => state?.auth?.email); // Redux 스토어의 email 상태 가져오기
	// const [email, setEmail] = useState(emailFromRedux ? emailFromRedux : '');
	const [email, setEmail] = useState('');
	
	const [ password, setPassword] = useState('');


	// const [ emailValid, setEmailValid ] = useState(emailFromRedux ? true : false);
	const [ emailValid, setEmailValid ] = useState(false);
	const [ passwordValid, setPasswordValid ] = useState(false);
	const [ notAllow, setNotAllow ] = useState(true);
	const checkLogin = () => {
		toast.error("아이디, 비밀번호를 확인해주세요", {
			position: "top-center",
			hideProgressBar: true,
			autoClose: 2000
		})
	}

	const dispatch = useDispatch();

	const goTohome = () => {
		navigate("/");
	}
	// 이메일 검증 함수
	const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newEmail = e.target.value
		// emailFromRedux = e.target.value;
		setEmail(newEmail);

		// 이메일 정규표현식
		const regex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i

		// 정규표현식이 true 이면
		if (regex.test(newEmail)) {
			setEmailValid(true);
		} else {
			setEmailValid(false);
		}
	}

	// 비밀번호 검증 함수
	const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newPw = e.target.value;
		setPassword(newPw);

		const regex = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
		if (regex.test(newPw)) {
			setPasswordValid(true);
		} else {
			setPasswordValid(false);
		}
	}

	const loginSubmit = (e: { preventDefault: () => void; }) => {
		e.preventDefault();

		const data = {
			"email" : email,
			"password" : password
		}

		// POST 요청 보내기
		axios({
			method: "post",
			url: "https://i9c204.p.ssafy.io/api/user-service/login", // 프록시 경로인 /api를 사용
			// url: "/api/api/user-service/login", // 프록시 경로인 /api를 사용
			headers: {
				"Content-Type": "application/json"
			},
			data: data
		})
		.then(res => {
			console.log(res)
			// 로그인 요청이 성공하면 받아온 정보를 redux로 보냄
			dispatch(login({
				"mem_key" : res.headers.memberkey,
				"mem_token" : res.headers.token,
			}))
				
			// 이전에 state에서 왔으면 로그인후 state으로 이동w
			console.log(state);
			if (state) {
				navigate(state);
			} else {
				// 이전에 온곳이 없다면 고정으로 / 로 보낸다
				navigate("/");
			}

		})
		.catch((err) => {
			console.log(err);
			// alert("아이디와 비밀번호를 다시 확인해주세요")
			checkLogin();
		});
	}

	useEffect(() => {
		if (emailValid && passwordValid) {
			setNotAllow(false);
			return;
		}
		setNotAllow(true);
	}, [emailValid, passwordValid]);

  return (
		<form className='login_form' onSubmit={loginSubmit}>
			<img src={Logo} alt="" onClick={goTohome} className='w-[30%] cursor-pointer' />

			<div className="login_title">
				로그인
			</div>
		
			<input 
				type='text'
				className="login_input"
				placeholder='이메일 형식을 맞춰주세요'
				// value={emailFromRedux? emailFromRedux : email}
				value={email}
				onChange={handleEmail} 
			/>
			<div className="errorMessageWrap">
				{
					!emailValid && email.length > 0 && (
						<div>
							올바른 이메일을 입력해주세요.
						</div>
					)
				}
			</div>

			<input
				type="password"
				className="login_input t-[10px]"
				placeholder="영문, 숫자, 특수문자 포함 8자 이상" 
				value={ password }
				onChange={ handlePassword }
			/>
			<div className="errorMessageWrap">
				{
					!passwordValid && password.length > 0 && (
						<div>
							영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.
						</div>
					)
				}
			</div>
		
			<button type="submit" className='login_button w-[60%]' disabled={ notAllow }>
				확인
			</button>
		</form>
  )
}

export default Login