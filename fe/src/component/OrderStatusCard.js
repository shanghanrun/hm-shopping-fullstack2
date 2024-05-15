import React from "react";
import { Row, Col, Badge } from "react-bootstrap";
import { badgeBg } from "../constants/order.constants";
import { currencyFormat } from "../utils/number";
import { convertUTCtoSeoulDate } from '../utils/timeTransfer'

const OrderStatusCard = ({order, item}) => {
  return (
    <div>
      <Row className="status-card">
        <Col xs={2}>
          <img
            src={item.image} alt="" height={96}
          />
        </Col>
        <Col xs={8} className="order-info">
          {/* <div>
            <strong>주문번호: 1234</strong>
          </div> */}

          {/* <div className="text-12">{convertUTCtoSeoulDate(date)}</div> */}
          
          <div>{item.name}</div>
          <div>{currencyFormat(item.price)} * {item.qty} = ₩ {currencyFormat(item.price *item.qty)}</div>
        </Col>
        {/* <Col md={2} className="vertical-middle">
          <div className="text-align-center text-12">주문상태</div>
          <Badge bg="warning">preparing</Badge>
        </Col> */}
      </Row>
    </div>
  );
};

export default OrderStatusCard;
