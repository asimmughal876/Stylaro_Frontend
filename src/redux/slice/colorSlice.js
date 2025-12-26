import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthHeader } from "../../model/Model";
import { showErrorToast } from "../../utlis/toast";

const API_URL = "https://stylaro.zeabur.app/colors";

export const fetchColors = createAsyncThunk(
  "color/fetchAll",
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
      const { color } = getState();
      return color.Colors.length === 0;
    },
  }
);

const colorSlice = createSlice({
  name: "color",
  initialState: {
    Colors: [],
    loadingColor: false,
    errorColor: null,
  },
  reducers: {
    clearColors: (state) => {
      state.Colors = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchColors.pending, (state) => {
        state.loadingColor = true;
        state.errorColor = null;
      })
      .addCase(fetchColors.fulfilled, (state, action) => {
        state.loadingColor = false;
        state.Colors = action.payload;
      })
      .addCase(fetchColors.rejected, (state, action) => {
        state.loadingColor = false;
        state.errorColor = action.payload || action.error.message;
      });
  },
});

export const { clearColors } = colorSlice.actions;
export default colorSlice.reducer;
