import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthHeader, getUserFromToken } from "../../model/Model";
import { showErrorToast, showSuccessToast } from "../../utlis/toast";

const API_URL = "https://stylaro.zeabur.app";

// Fetch all favorite product IDs
export const fetchFavorites = createAsyncThunk(
  "favorites/fetch",
  async () => {
    const user = await getUserFromToken();
    if (!user) return [];

    const res = await axios.get(`${API_URL}/getFavorites`, {
      headers: getAuthHeader(),
    });
    return res.data; 
  },
  {
    condition: (_, { getState }) => {
      const { favorites } = getState();
      if (favorites.loading || favorites.hasFetched) {
        return false;
      }
    },
  }
);

export const toggleFavorite = createAsyncThunk(
  "favorites/toggle",
  async ({ productId }, thunkAPI) => {
    const user = await getUserFromToken();
    if (!user) {
      showErrorToast("Must Login For Favorites");
      return { productId: null };
    }

    const state = thunkAPI.getState();
    const isFavorite = state.favorites.items.includes(productId);

    try {
      if (isFavorite) {
        const res = await axios.delete(
          `${API_URL}/deleteFavorite/${productId}`,
          { headers: getAuthHeader() }
        );
        showSuccessToast(res.data.message);
        return { productId, removed: true };
      } else {
        const res = await axios.post(
          `${API_URL}/addFavorite`,
          { productId },
          { headers: getAuthHeader() }
        );
        showSuccessToast(res.data.message);
        return { productId, added: true };
      }
    } catch (error) {
      showErrorToast("Failed to update favorite");
      return { productId: null };
    }
  }
);

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [],
    loading: false,
    hasFetched: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.hasFetched = true;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { productId, added, removed } = action.payload || {};

        if (!productId) return;

        if (added && !state.items.includes(productId)) {
          state.items.push(productId);
        } else if (removed) {
          state.items = state.items.filter((id) => id !== productId);
        }
      });
  },
});

export default favoriteSlice.reducer;
