import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthHeader } from "../../model/Model";
import { showErrorToast } from "../../utlis/toast";

const API_URL = "https://stylaro.zeabur.app/categories";

export const fetchCategories = createAsyncThunk(
  "category/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL,
        { headers: getAuthHeader() });
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
      const { category } = getState();
      return category.categories.length === 0;
    },
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCategories: (state) => {
      state.categories = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearCategories } = categorySlice.actions;
export default categorySlice.reducer;
