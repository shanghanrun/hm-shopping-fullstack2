import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faBars,
  faBox,
  faSearch,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import userStore from '../store/userStore'
import productStore from '../store/productStore'
import cartStore from '../store/cartStore'
import {useSearchParams} from 'react-router-dom'
import PriceDropdown from "./PriceDropdown";
import CategoryDropdown from "./CategoryDropdown";
import SizeDropdown from "./SizeDropdown";

const Navbar = ({ user }) => {
  let [width, setWidth] = useState(0);
  let navigate = useNavigate();
  const {getProductList} =productStore()
  const {cartCount, getCart} = cartStore()
 
	const {logout} = userStore()
  const [query, setQuery] = useSearchParams()
  const [searchQuery, setSearchQuery] =useState({
    page: query.get('page') || '',
    //productAll 페이지는 페이지네이션 없이 모두 보이게
    name: query.get('name') || '',
  })
  const [keyword, setKeyword] = useState('')


  const isMobile = window.navigator.userAgent.indexOf("Mobile") !== -1;
  // let isMobile = false
  const [showSearchBox, setShowSearchBox] = useState(false);
  const menuList = [
    "여성",
    "Divided",
    "남성",
    "신생아/유아",
    "아동",
    "H&M HOME",
    "Sale",
    "지속가능성",
  ];
  

  const onCheckEnter = async (event) => {
    if (event.key === "Enter") {

      query.set('page', searchQuery.page)
      if(searchQuery.name ===''){
        delete searchQuery.name
      } else{
        query.set('name', searchQuery.name)
      }
      setSearchQuery({...searchQuery, name: event.target.value})
    }
  };
  const getLogout = () => {
    navigate('/')
    logout()
  };

  useEffect(()=>{
    getProductList(searchQuery)
    if(user){
      getCart()
    }

    if(searchQuery.name === ''){
      delete searchQuery.name;
    }
    
    const searchParamsString = new URLSearchParams(searchQuery).toString();
    navigate("?" + searchParamsString )
  },[searchQuery, cartCount])
  
  return (
    <div>
      {showSearchBox && (
        <div className="display-space-between mobile-search-box w-100">
          <div className="search display-space-between w-100">
            <div style={{zIndex:'2'}}>
              <FontAwesomeIcon className="search-icon" icon={faSearch} />
              <input
                type="text"
                placeholder="제품검색"
                onKeyPress={onCheckEnter}
              />
            </div>
            <button
              className="closebtn"
              onClick={() => setShowSearchBox(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
      <div className="side-menu" style={{ width: width }}>
        <button className="closebtn" onClick={() => setWidth(0)}>
          &times;
        </button>

        <div className="side-menu-list" id="menu-list">
          {menuList.map((menu, index) => (
            <button key={index}>{menu}</button>
          ))}
        </div>
      </div>
      {user && user.level === "admin" && (
        <Link to="/admin/product?page=1" className="link-area">
          Admin page
        </Link>
      )}
      <div className="nav-header">
        <div className="burger-menu hide">
          <FontAwesomeIcon icon={faBars} onClick={() => setWidth(250)} />
        </div>

        <div>
          <div className="display-flex">
            <div style={{marginRight: '20px'}}>
              <CategoryDropdown />
            </div>
            <div style={{marginRight: '20px'}}>
              <SizeDropdown />
            </div>
            <div style={{marginRight: '20px'}}>
              <PriceDropdown />
            </div>
            {user ? (
              <div onClick={getLogout} className="nav-icon">
                <FontAwesomeIcon icon={faUser} />
                {!isMobile && (
                  <span style={{ cursor: "pointer" }}>로그아웃</span>
                )}
              </div>
            ) : (
              <div onClick={() => navigate("/login")} className="nav-icon">
                <FontAwesomeIcon icon={faUser} />
                {!isMobile && <span style={{ cursor: "pointer" }}>로그인</span>}
              </div>
            )}
            <div onClick={() => navigate("/cart")} className="nav-icon">
              <FontAwesomeIcon icon={faShoppingBag} />
              {!isMobile && (
                <span style={{ cursor: "pointer" }}>{`쇼핑백(${
                   cartCount || 0
                })`}</span>
              )}
            </div>
            <div
              onClick={() => navigate("/account/purchase")}
              className="nav-icon"
            >
              <FontAwesomeIcon icon={faBox} />
              {!isMobile && <span style={{ cursor: "pointer" }}>내 주문</span>}
            </div>
            {isMobile && (
              <div className="nav-icon" onClick={() => setShowSearchBox(true)}>
                <FontAwesomeIcon icon={faSearch} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="nav-logo" onClick={()=>getProductList()}>
        <Link to="/">
          <img width={100} src="/image/hm-logo.png" alt="hm-logo.png" />
        </Link>
      </div>
      <div className="nav-menu-area">
        <ul className="menu">
          {menuList.map((menu, index) => (
            <li key={index}>
              <a href="#">{menu}</a>
            </li>
          ))}
        </ul>
        {!isMobile && ( // admin페이지에서 같은 search-box스타일을 쓰고있음 그래서 여기서 서치박스 안보이는것 처리를 해줌
          <div className="search-box landing-search-box ">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="제품검색"
              onKeyPress={onCheckEnter}
              onChange={(e)=>setKeyword(e.target.value)}
              value={keyword}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
