import * as types from "../constants/cart.constants";
import {
  LOGIN_SUCCESS,
  GOOGLE_LOGIN_SUCCESS,
  LOGOUT,
} from "../constants/user.constants";

const initialState = {};

function cartReducer(state = initialState, action) {
  const { type, payload } = action;
  return state;
}
export default cartReducer;
