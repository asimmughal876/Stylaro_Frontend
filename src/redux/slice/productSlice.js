import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthHeader } from "../../model/Model";
import { showErrorToast } from "../../utlis/toast";

const API_URL = "https://stylaro.zeabur.app/product";

export const fetchproducts = createAsyncThunk(
  "product/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        showErrorToast(error.response.data.message);
        localStorage.removeItem("token");
        localStorage.removeItem("cartItems");

        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }

      const message =
        error.response?.data?.message || error.message || "Unknown error";
      return rejectWithValue(message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { product } = getState();
      return product.product.length === 0;
    },
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    product: [],
    loadingproduct: false,
    errorproduct: null,
  },
  reducers: {
    clearproducts: (state) => {
      state.product = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchproducts.pending, (state) => {
        state.loadingproduct = true;
        state.errorproduct = null;
      })
      .addCase(fetchproducts.fulfilled, (state, action) => {
        state.loadingproduct = false;
        state.product = action.payload;
      })
      .addCase(fetchproducts.rejected, (state, action) => {
        state.loadingproduct = false;
        state.errorproduct = action.payload || action.error.message;
      });
  },
});

export const { clearproducts } = productSlice.actions;
export default productSlice.reducer;
