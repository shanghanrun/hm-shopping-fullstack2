import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import OrderReceipt from "../component/OrderReceipt";
import PaymentForm from "../component/PaymentForm";
import "../style/paymentPage.style.css";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { cc_expires_format } from "../utils/number";
import orderStore from '../store/orderStore'
import uiStore from '../store/uiStore'
import cartStore from '../store/cartStore'

const PaymentPage = () => {
  const {setShip, setPayment,createOrder, createOrder2} = orderStore()
  const {cart, cartForOrder} = cartStore()
  const {showToastMessage} = uiStore()
  const {totalPrice} = orderStore()

  const [cardValue, setCardValue] = useState({
    cvc: "",
    expiry: "",
    focus: "",
    name: "",
    number: "",
  });
  const navigate = useNavigate();
  const [firstLoading, setFirstLoading] = useState(true);
  const [shipInfo, setShipInfo] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    address: "",
    city: "",
    zip: "",
  });
  
  //맨처음 페이지 로딩할때는 넘어가고  오더번호를 받으면 성공페이지로 넘어가기

  const handleSubmit = (event) => {
    event.preventDefault();
    if(!cart){
      showToastMessage('결제할 아이템이 없습니다. 첫페이지로 이동합니다.', 'error')
      setTimeout(() => {
        navigate('/')
      }, 3000);
    } else{
      //오더 생성하가ㅣ
      setShip(shipInfo)
      setPayment(cardValue)

      const {firstName,lastName,contact,address,city,zip} = shipInfo
      const {cvc, expiry,name,number} =cardValue

      // 기존의 order 생성방식을 주석처리하고, 몽고디비에서도 제거한다.
      // const data ={
      //   totalPrice, 
      //   shipTo:{address,city,zip},
      //   contact:{firstName,lastName,contact},
      //   items: cart.items.map((item)=>{
      //     return {
      //       productId: item.productId._id,
      //       price: item.productId.price,
      //       qty:item.qty,
      //       size: item.size
      //     }
      //   })
      // }

      // createOrder(data, navigate)
      
      // 잠시 주석처리한다. 에러상황에 대비해서
      const data2 ={
        totalPrice, 
        shipTo:{address,city,zip},
        contact:{firstName,lastName,contact},
        items: cart.items.map((item)=>{
          return {
            productId: item.productId._id,
            sku: item.productId.sku,
            name: item.productId.name,
            image: item.productId.image,
            price: item.productId.price,
            qty:item.qty,
            size: item.size
          }
        })
      }

      createOrder2(data2, navigate)
    }  
  };

  const handleFormChange = (event) => {
    //shipInfo에 값 넣어주기
    const {name,value} = event.target
    setShipInfo({...shipInfo, [name]: value})
  };

  const handlePaymentInfoChange = (event) => {
    //카드정보 넣어주기
    const {name,value} =event.target
    if(name === "expiry"){
      let newValue = cc_expires_format(value) 
      return setCardValue({...shipInfo, [name]: newValue})
    }
    setCardValue({...cardValue, [name]:value})
  };

  const handleInputFocus = (e) => {
    setCardValue({ ...cardValue, focus: e.target.name });
  };
  //카트에 아이템이 없다면 다시 카트페이지로 돌아가기 (결제할 아이템이 없으니 결제페이지로 가면 안됌)
  return (
    <Container>
      <Row>
        <Col lg={7}>
          <div>
            <h2 className="mb-2">배송 주소</h2>
            <div>
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="lastName">
                    <Form.Label>성</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleFormChange}
                      required
                      name="lastName"
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="firstName">
                    <Form.Label>이름</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={handleFormChange}
                      required
                      name="firstName"
                    />
                  </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="formGridAddress1">
                  <Form.Label>연락처</Form.Label>
                  <Form.Control
                    placeholder="010-xxx-xxxxx"
                    onChange={handleFormChange}
                    required
                    name="contact"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGridAddress2">
                  <Form.Label>주소</Form.Label>
                  <Form.Control
                    placeholder="Apartment, studio, or floor"
                    onChange={handleFormChange}
                    required
                    name="address"
                  />
                </Form.Group>

                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridCity">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      onChange={handleFormChange}
                      required
                      name="city"
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridZip">
                    <Form.Label>Zip</Form.Label>
                    <Form.Control
                      onChange={handleFormChange}
                      required
                      name="zip"
                    />
                  </Form.Group>
                </Row>
                <div className="mobile-receipt-area">
                  {/* <OrderReceipt /> */}
                </div>
                <div>
                  <h2 className="payment-title">결제 정보</h2>
                </div>
                <PaymentForm cardValue={cardValue}
                  handleInputFocus={handleInputFocus}
                  handlePaymentInfoChange={handlePaymentInfoChange}
                />
                <Button
                  variant="dark"
                  className="payment-button pay-button"
                  type="submit"
                >
                  결제하기
                </Button>
              </Form>
            </div>
          </div>
        </Col>
        <Col lg={5} className="receipt-area">
          <OrderReceipt items={cart.items}/>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentPage;
