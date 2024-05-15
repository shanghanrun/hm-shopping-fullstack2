import React, { useEffect } from "react";
import { useLocation } from "react-router";
import { Col, Row } from "react-bootstrap";
import Sidebar from "../component/Sidebar";
import Navbar from "../component/Navbar";
import userStore from '../store/userStore'
import ToastMessage from "../component/ToastMessage";
import uiStore from "../store/uiStore";

const AppLayout = ({ children }) => {
  const { toastMessage } = uiStore()
  const location = useLocation();
	const {user, loginWithToken} = userStore()

  useEffect(() => {
    loginWithToken()
  }, []);

  return (
    <div>
      <ToastMessage toastMessage={toastMessage}/>
      {location.pathname.includes("admin") ? (
        <Row className="vh-100">
          <Col xs={12} md={3} className="sidebar mobile-sidebar">
            <Sidebar />
          </Col>
          <Col xs={12} md={9}>
            {children}
          </Col>
        </Row>
      ) : (
        <>
          <Navbar user={user} />
          {children}
        </>
      )}
    </div>
  );
};

export default AppLayout;
