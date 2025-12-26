import { configureStore } from "@reduxjs/toolkit";
import categorySlice from "./slice/categorySlice";
import colorSlice from "./slice/colorSlice";
import productSlice from "./slice/productSlice";
import complainSlice from "./slice/complainSlice";
import favoriteReducer from "./slice/favoriteSlice";
import cartSlice from "./slice/cartSlice";
import userSlice from "./slice/userSlice";
import orderSlice from "./slice/orderSlice";
import orderProductSlice from "./slice/orderProductSlice";

export const store = configureStore({
  reducer: {
    category: categorySlice,
    color: colorSlice,
    product: productSlice,
    complain: complainSlice,
    favorites: favoriteReducer,
    cart: cartSlice,
    user: userSlice,
    order: orderSlice,
    orderProduct: orderProductSlice
  },
});