import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthHeader } from "../../model/Model";

const API_URL = "https://stylaro.zeabur.app/getUser";

export const fetchuser = createAsyncThunk(
  "user/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL,
        {
          headers : getAuthHeader()
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Unknown error";
      return rejectWithValue(message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { user } = getState();
      return user.user.length === 0;
    },
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearuser: (state) => {
      state.user = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchuser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchuser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchuser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearuser } = userSlice.actions;
export default userSlice.reducer;
