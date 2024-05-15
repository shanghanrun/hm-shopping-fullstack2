import * as types from "../constants/product.constants";
const initialState = {};

function productReducer(state = initialState, action) {
  const { type, payload } = action;
  return state;
}

export default productReducer;
