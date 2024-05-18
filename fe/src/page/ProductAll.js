import React, { useEffect } from "react";
import ProductCard from "../component/ProductCard";
import { Row, Col, Container } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import productStore from '../store/productStore';
import orderStore from '../store/orderStore'
import cartStore from '../store/cartStore'
import userStore from '../store/userStore'
import uiStore from '../store/uiStore'
import Popup from "../component/Popup";


const ProductAll = () => {
  const {productList, getAllProductList} = productStore()
  const {getOrderList} = orderStore()
  const {user} = userStore()
  const {popupContent} = uiStore() 
  const {getCart, cartCount} = cartStore()
  const navigate = useNavigate()
  const error =false
  console.log('ProductAll 페이지 productList:',productList)
  // productList를 구독하고 있으면 된다.

  useEffect(()=>{
    getAllProductList()
    if(user) {getCart(); getOrderList()}
    //여기서 cartStore의 cart를 업데이트하면,
    // Navbar에서 cartCount를 구독하고 있으므로,업데이트가 된다.
  },[cartCount])
  // useEffect(()=>{
  //   getProductList()  Navbar에서 불러온다.
  // },[])
 
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
