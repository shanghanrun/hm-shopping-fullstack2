import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import userStore from '../store/userStore'
import "../style/login.style.css";
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const {user, error, setError, loginWithEmail, loginWithGoogle} = userStore()
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login= async(event)=>{
		event.preventDefault();
		await loginWithEmail({email,password})	
	}
  const handleGoogleLogin = async (googleData) => {
    // 구글로 로그인 하기
    console.log('구글로그인', googleData)
    loginWithGoogle(googleData.credential)
  };

	// if(user){
	// 	navigate('/')
	// }

  useEffect(() => {
    setError(false)//기존 에러를 초기화
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);


  return (
    <>
      <Container className="login-area">
        {error && (
          <div className="error-message">
            <Alert variant="danger">{error}</Alert>
          </div>
        )}
        <Form className="login-form" onSubmit={login}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              required
              onChange={(event) => setEmail(event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              required
              onChange={(event) => setPassword(event.target.value)}
            />
          </Form.Group>
          <div className="display-space-between login-button-area">
            <Button variant="danger" type="submit">
              Login
            </Button>
            <div>
              아직 계정이 없으세요?<Link to="/register">회원가입 하기</Link>{" "}
            </div>
          </div>

          <div className="text-align-center mt-2">
            <p>-외부 계정으로 로그인하기-</p>
            <div className="display-center">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                  console.log('Login Failed');
                }}
                useOneTap
              />;
            </div>
          </div>
        </Form>
      </Container>
    </>
  );
};

export default Login;
