import api from "../utils/api";
import * as types from "../constants/cart.constants";
import { commonUiActions } from "../action/commonUiAction";
const addToCart =
  ({ id, size }) =>
  async (dispatch) => {};

const getCartList = () => async (dispatch) => {};
const deleteCartItem = (id) => async (dispatch) => {};

const updateQty = (id, value) => async (dispatch) => {};
const getCartQty = () => async (dispatch) => {};
export const cartActions = {
  addToCart,
  getCartList,
  deleteCartItem,
  updateQty,
  getCartQty,
};
