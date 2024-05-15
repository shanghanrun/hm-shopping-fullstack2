import * as types from "../constants/order.constants";

const initialState = {};

function orderReducer(state = initialState, action) {
  const { type, payload } = action;
  return state;
}
export default orderReducer;
