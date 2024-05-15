import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import SearchBox from "../component/SearchBox";
import OrderDetailDialog from "../component/OrderDetailDialog";
import OrderTable from "../component/OrderTable";
import * as types from "../constants/order.constants";
import ReactPaginate from "react-paginate";
import { useSearchParams, useNavigate } from "react-router-dom";
import orderStore from '../store/orderStore'
import uiStore from '../store/uiStore'

const AdminOrderPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useSearchParams();
  const { orderList, getOrderList2, totalPageNum,setSelectedOrder,selectedOrder } = orderStore()
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    orderNum: query.get("orderNum") || "",
  });
  const [open, setOpen] = useState(false);
  const tableHeader = [
    "#",
    "Order#",
    "Order Date",
    "User",
    "Order Item",
    "Address",
    "Total Price",
    "Status",
  ];

  useEffect(() => {
    getOrderList2(searchQuery)
  }, [query, selectedOrder]);

  useEffect(() => {
    if (searchQuery.orderNum === "") {
      delete searchQuery.orderNum;
    }
    const params = new URLSearchParams(searchQuery);
    const queryString = params.toString();
    console.log('admin orderPage queryString:', queryString)

    navigate("?" + queryString);
  }, [searchQuery]);

  const openEditForm = (order) => {
    setOpen(true);
    setSelectedOrder(order)
  };

  const handlePageClick = ({ selected }) => {
    setSearchQuery({ ...searchQuery, page: selected + 1 });
  };

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <div className="locate-center">
      <Container>
        <div className="mt-2 display-center mb-2">
          <SearchBox
            query={query}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="오더번호"
            field="orderNum"
          />
        </div>

        <OrderTable
          header={tableHeader}
          data={orderList}
          openEditForm={openEditForm}
        />
        <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={totalPageNum}
          forcePage={searchQuery.page - 1}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          className="display-center list-style-none"
        />
      </Container>

      {open && <OrderDetailDialog open={open} handleClose={handleClose} />}
    </div>
  );
};

export default AdminOrderPage;
