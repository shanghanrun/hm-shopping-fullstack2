import React from "react";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Popup = ({popupContent}) => {

  useEffect(() => {
    if (popupContent) {
      const { message } = popupContent;
      if (message !== "" ) {
        toast(message, {
          className: "toast-message",
        });
      }
    }
  }, [popupContent]);
  return (
    <ToastContainer
      position="bottom-center"
      autoClose={50000000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};

export default Popup;
