import React from "react";
import { Table, Badge } from "react-bootstrap";
import { badgeBg } from "../constants/order.constants";
import { currencyFormat } from "../utils/number";
const OrderTable = ({ header, data, openEditForm }) => {
  console.log('orderTable이 받은 data(orderList)', data)
  return (
    <div className="overflow-x">
      <Table striped bordered hover>
        <thead>
          <tr>
            {header.map((title,i) => (
              <th key={i}>{title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index} onClick={() => openEditForm(item)}>
                <th>{index}</th>
                <th>{item.orderNum}</th>
                <th>{item.updatedAt.slice(0, 10)}</th>
                <th>{item.email}</th>
                {item.items.length > 0 ? (
                  <th>
                    {item.items[0].name}
                    {item.items.length > 1 && ` 외 ${item.items.length - 1}개`}
                  </th>
                ) : (
                  <th></th>
                )}

                <th>{item.shipTo.address + " " + item.shipTo.city}</th>

                <th>{currencyFormat(item.totalPrice)}</th>
                <th>
                  <Badge bg={badgeBg[item.status]}>{item.status}</Badge>
                </th>
              </tr>
            ))
          ) : (
            <tr>No Data to show</tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};
export default OrderTable;
