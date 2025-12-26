import { createSlice } from "@reduxjs/toolkit";
const savedCart = localStorage.getItem("cartItems");

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: savedCart ? JSON.parse(savedCart) : [],
  },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(item => item._id === action.payload._id);
      console.log(action.payload);
      
      if (existing) {
        if (existing.quantity < existing.stock) {
          existing.quantity += 1;
        }
      } else {
        state.items.push({ ...action.payload, quantity: action.payload.stock ? 1 : 0, stock: action.payload.stock ? action.payload.stock : 0 });
      }
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find(i => i._id === action.payload);
      if (item && item.quantity < item.stock) {
        item.quantity += 1;
      }
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find(i => i._id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cartItems");
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
