import React, {useState, useEffect} from "react";
import { Row, Col, Badge } from "react-bootstrap";
import { badgeBg } from "../constants/order.constants";
import { currencyFormat } from "../utils/number";
import { convertUTCtoSeoulDate } from '../utils/timeTransfer'
import OrderStatusCard from "./OrderStatusCard";

const OrderStatusCardOuter = ({order}) => {
  const [name, setName] = useState('리넨셔츠')
  const [image, setImage] = useState("https://res.cloudinary.com/dscla3iqu/image/upload/v1714914629/fvq7uu5qriukv3mde5zb.webp")
  const [showDetails, setShowDetails] = useState(false)

  function getFirstImageName(order){
    const name = order.items[0].name;
    const image = order.items[0].image;
    return {name, image}
  }

  useEffect(()=>{
    const {name, image} = getFirstImageName(order)
    setName(name)
    setImage(image)
  },[])

  return (
    <div>
      <Row className="status-card">
        <Col xs={2}>
          <img
            src={image} alt="" height={96}
          />
        </Col>
        <Col xs={8} className="order-info">
          <div>
            <strong>주문번호: {order.orderNum}</strong>
          </div>

          {/* <div className="text-12">{convertUTCtoSeoulDate(date)}</div> */}
          <div className="text-12">{convertUTCtoSeoulDate(order.updatedAt)}</div>

          <div>{name} 외 {order.items.length-1}개</div>
          <div>₩ {currencyFormat(order.totalPrice)}</div>
          <div style={{marginTop:'10px'}}>
            <button onClick={() => setShowDetails(!showDetails)}>
              {showDetails ? "간단히 보기": "주문상품 모두 보기" }
            </button>
          </div>
          <div style={{marginTop:'10px'}}>
            {showDetails && order.items.map((item, j) => (
              <OrderStatusCard key={j} order={order} item={item} />
            ))}
          </div>
        </Col>
        <Col md={2} className="vertical-middle">
          <div className="text-align-center text-12">주문상태</div>
          <Badge bg="warning">{order.status}</Badge>
        </Col>
      </Row>
    </div>
  );
};

export default OrderStatusCardOuter;
