import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Button, Dropdown } from "react-bootstrap";
import { ColorRing } from "react-loader-spinner";

import productStore from '../store/productStore'
import userStore from '../store/userStore'
import cartStore from '../store/cartStore'
import uiStore from '../store/uiStore'
import { currencyFormat } from "../utils/number";
import "../style/productDetail.style.css";

const ProductDetail = () => {
  const {selectedProduct, getProduct} = productStore()
  const {user} = userStore()
  const {addToCart} = cartStore()
  console.log('디테일 페이지 selectedProduct:', selectedProduct)
  const [size, setSize] = useState("");
  const { id } = useParams();
  console.log('받은 id :', id)
  const [sizeError, setSizeError] = useState(false);

  const navigate = useNavigate();

  const addItemToCart = () => {
    //사이즈를 아직 선택안했다면 에러
    // 아직 로그인을 안한 유저라면 로그인페이지로  
    // 카트에 아이템 추가하기
    if(size ===''){
      setSizeError(true)
      return;
    }
    if(!user) {navigate('/login')}
    
    console.log('productDetail페이지 id:', id)
    addToCart({id, size})
    
  }
  const selectSize = (value) => {
    // 사이즈 추가하기
    console.log('선택 value :',value)
    setSize(value)
    setSizeError(false)
  };

  useEffect(() => {
    //상품 디테일 정보 가져오기
    getProduct(id)
  }, [id]);

  return (
    <Container className="product-detail-card">
      <Row>
        <Col sm={6}>
          <img
            src={selectedProduct?.image} className="w-100" alt="image" />
        </Col>
        <Col className="product-info-area" sm={6}>
          <div className="product-info">{selectedProduct?.name}</div>
          <div className="product-info">₩ {currencyFormat(selectedProduct?.price)}</div>
          <div className="product-info">{selectedProduct?.description}</div>

          <Dropdown
            className="drop-down size-drop-down"
            title={size}
            align="start"
            onSelect={(value) => selectSize(value)}
          >
            <Dropdown.Toggle
              className="size-drop-down"
              variant={sizeError ? "outline-danger" : "outline-dark"}
              id="dropdown-basic"
              align="start"
            >
              {size === "" ? "사이즈 선택" : size.toUpperCase()}
            </Dropdown.Toggle>

            <Dropdown.Menu className="size-drop-down">
              { selectedProduct && Object.keys(selectedProduct?.stock).length > 0 &&
                Object.keys(selectedProduct?.stock).map((sz, i) =>
                  selectedProduct?.stock[sz] > 0 ? (
                    <Dropdown.Item key={i} eventKey={sz}>
                      {sz.toUpperCase()}
                    </Dropdown.Item>
                  ) : (
                    <Dropdown.Item key={i} eventKey={sz} disabled={true}>
                      {sz.toUpperCase()}
                    </Dropdown.Item>
                  )
                )}
            </Dropdown.Menu>
          </Dropdown>
          <div className="warning-message">
            {sizeError && "사이즈를 선택해주세요."}
          </div>
          <Button variant="dark" className="add-button" onClick={addItemToCart}>
            추가
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
