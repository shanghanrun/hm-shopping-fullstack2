import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router";
import "../style/register.style.css";
import userStore from '../store/userStore'
import uiStore from '../store/uiStore'

const RegisterPage = () => {
  const {user, error, registerUser} = userStore()
  const {showToastMessage}= uiStore()
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    policy: false,
  });
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState("");
  const [policyError, setPolicyError] = useState(false);

  const register = async(event) => {
    event.preventDefault();
    // 비번 중복확인 일치하는지 확인
    const {name, email, password, confirmPassword,policy} = formData
    if(password !== confirmPassword){
      setPasswordError('두 비밀번호가 일치하지 않습니다.')
      return
    }
    // 이용약관에 체크했는지 확인
    if(!policy){
      setPolicyError(true)
      return
    }
    // FormData에 있는 값을 가지고 백엔드로 넘겨주기
    setPasswordError('')
    setPolicyError(false)
    await registerUser({name, email,password}, navigate,showToastMessage)
    //성공후 로그인 페이지로 넘어가기
    // navigate('/login')
  };

  const handleChange = (event) => {
    event.preventDefault();
    // 값을 읽어서 FormData에 넣어주기
    const {id, value, checked} = event.target
    if(id ==='policy'){
      setFormData({...formData, [id]: checked})  //checked값을 넣어준다.
    } else{
      setFormData({...formData, [id]: value}) //각각의 필드가 들어온 것을 펼치고, 다시 추가
    // 변수값을 필드로 할 경우에는 [id] 형식으로 한다.
    }
  };

  return (
    <Container className="register-area">
      {error && (
        <div>
          <Alert variant="danger" className="error-message">
            {error}
          </Alert>
        </div>
      )}
      <Form onSubmit={register}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            id="email"
            placeholder="Enter email"
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            id="name"
            placeholder="Enter name"
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            id="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
            isInvalid={passwordError}
          />
          <Form.Control.Feedback type="invalid">
            {passwordError}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="이용약관에 동의합니다"
            id="policy"
            onChange={handleChange}
            isInvalid={policyError}
          />
        </Form.Group>
        <Button variant="danger" type="submit">
          회원가입
        </Button>
      </Form>
    </Container>
  );
};

export default RegisterPage;
