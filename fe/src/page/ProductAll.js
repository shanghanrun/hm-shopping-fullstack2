import React, { useEffect } from "react";
import ProductCard from "../component/ProductCard";
import { Row, Col, Container } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import productStore from '../store/productStore';
import cartStore from '../store/cartStore'
import userStore from '../store/userStore'
import uiStore from '../store/uiStore'
import Popup from "../component/Popup";


const ProductAll = () => {
  const {productList, getProductList} = productStore()
  const {user} = userStore()
  const {popupContent} = uiStore() 
  const {getCart, cartCount} = cartStore()
  const navigate = useNavigate()
  const error =false
  // productList를 구독하고 있으면 된다.

  // useEffect(()=>{
  //   if(user) getCart()
  //   //여기서 cartStore의 cart를 업데이트하면,
  //   // Navbar에서 cartCount를 구독하고 있으므로,업데이트가 된다.
  // },[cartCount])
 
  return (
    <Container>
      <Row>
        {productList?.map((product,i) =>(
          <Col md={3} sm={12} key={i}>
            <ProductCard item={product}/>
          </Col>
        ))}
      </Row>
      <Popup popupContent={popupContent}/>
    </Container>
  );
};

export default ProductAll;
