import api from "../utils/api";
import * as types from "../constants/product.constants";
// import { toast } from "react-toastify";
import { commonUiActions } from "./commonUiAction";

const getProductList = (query) => async (dispatch) => {};
const getProductDetail = (id) => async (dispatch) => {};

const createProduct = (formData) => async (dispatch) => {};
const deleteProduct = (id) => async (dispatch) => {};

const editProduct = (formData, id) => async (dispatch) => {};

export const productActions = {
  getProductList,
  createProduct,
  deleteProduct,
  editProduct,
  getProductDetail,
};
