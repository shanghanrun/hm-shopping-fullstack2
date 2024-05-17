import React from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Row, Col, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { currencyFormat } from "../utils/number";
import cartStore from '../store/cartStore'

const CartProductCard = ({ item }) => {
   const {deleteCartItem, updateQty} = cartStore() 
   console.log('재고 수량 :', item.product.stock)
   console.log('지금 보는 상품 size :', item.size)
   const stock = {...item.product.stock}
   const stockCount = stock[item.size]
   console.log('내 아이템 재고량:', stockCount)

  const handleQtyChange = (event) => {
    //아이템 수량을 수정한다
    // setQty(event.target.value)
    updateQty(item.productId, item.size, event.target.value)
    // setTotal(item.productId.price *event.target.value)

  };

  const deleteCart = () => {
    deleteCartItem(item.productId, item.size)
  };

  return (
    <div className="product-card-cart">
      <Row>
        <Col md={2} xs={12}>
          <img src={item.product.image} width={112} alt='' />
        </Col>
        <Col md={10} xs={12}>
          <div className="display-flex space-between">
            <h3>{item.product.name}</h3>
            <button className="trash-button">
              <FontAwesomeIcon
                icon={faTrash}
                width={24}
                onClick={() => deleteCart()}
              />
            </button>
          </div>

          <div>
            <strong>₩ {currencyFormat(item.product.price)}</strong>
          </div>
          <div>Size: {item.size}</div>
          <div>Total: ₩ {currencyFormat(item.product.price*item.qty)}</div>
          <div>
            Quantity:
            <Form.Select
              onChange={(event) => handleQtyChange(event)}
              required
              defaultValue={item.qty}
              className="qty-dropdown"
            >
              {[...Array(stockCount)].map((_, index) => (
                <option key={index + 1} value={index + 1}>{index + 1}</option>
              ))}
              {/* <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={7}>7</option>
              <option value={8}>8</option>
              <option value={9}>9</option>
              <option value={10}>10</option> */}
            </Form.Select>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CartProductCard;
