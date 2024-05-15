import React, {useState, useEffect} from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { currencyFormat } from "../utils/number";
import cartStore from '../store/cartStore'
import uiStore from '../store/uiStore'
import orderStore from '../store/orderStore'

const OrderReceipt = ({items}) => {
  
  const {showToastMessage} = uiStore()
  const {getCart} = cartStore()
  const location = useLocation();
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const {setTotalPrice} = orderStore()
  
  useEffect(()=>{
    // if(!items){
    //   return(<div>None</div>)
    // }
    const newTotal = items.reduce((sum, item) => sum + (item.productId.price * item.qty), 0);
    setTotal(newTotal);
    setTotalPrice(newTotal)
  },[items])

  return (
    <div className="receipt-container">
      <h3 className="receipt-title">주문 내역</h3>
      <ul className="receipt-list">
        <li>
          {items.map((item)=>(
            <div key={item._id} className="display-flex space-between">
              <div>{item.productId.name}</div>
              <div>₩ {currencyFormat(item.productId.price*item.qty)}</div>
            </div>
          ))}
        </li>
      </ul>
      <div className="display-flex space-between receipt-title">
        <div>
          <strong>Total:</strong>
        </div>
        <div>
          <strong>₩ {currencyFormat(total)}</strong>
        </div>
      </div>
      {location.pathname.includes("/cart") && (
        <Button
          variant="dark"
          className="payment-button"
          onClick={async() => {
            if(items.length===0){
              showToastMessage('결제할 아이템이 없습니다. 첫페이지로 이동합니다.', 'error')
              setTimeout(() => {
                navigate('/')
              }, 3000);
            } else{
              await getCart()
              navigate("/payment")}
            }}
        >
          결제 계속하기
        </Button>
      )}

      <div>
        가능한 결제 수단 귀하가 결제 단계에 도달할 때까지 가격 및 배송료는
        확인되지 않습니다.
        <div>
          30일의 반품 가능 기간, 반품 수수료 및 미수취시 발생하는 추가 배송 요금
          읽어보기 반품 및 환불
        </div>
      </div>
    </div>
  );
};

export default OrderReceipt;
