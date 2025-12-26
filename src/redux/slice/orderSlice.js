import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthHeader } from "../../model/Model";
import { showErrorToast } from "../../utlis/toast";

const API_URL = "https://stylaro.zeabur.app/getOrder";

export const fetchorders = createAsyncThunk(
    "order/fetchAll",
    async (id = null, { rejectWithValue }) => {
        
        if (!id) {
            return {
                data: [],
                fetchedById: "",
            };
        }

        try {
            const endpoint = `${API_URL}/${id}`;
            const response = await axios.get(endpoint, {
                headers: getAuthHeader(),
            });
            
            return {
                data: response.data,
                fetchedById: id,
            };
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
        condition: (id, { getState }) => {
            const { order } = getState();

            if (order.fetchedById === id) {
                return false;
            }

            return true;
        },
    }
);


const orderSlice = createSlice({
    name: "order",
    initialState: {
        order: [],
        loadingorder: false,
        errororder: null,
        fetchedById: "",
    },
    reducers: {
        clearorders: (state) => {
            state.order = [];
            state.fetchedById = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchorders.pending, (state) => {
                state.loadingorder = true;
                state.errororder = null;
                state.fetchedById = "";
            })
            .addCase(fetchorders.fulfilled, (state, action) => {
                state.loadingorder = "";
                state.order = action.payload.data;
                state.fetchedById = action.payload.fetchedById;
            })
            .addCase(fetchorders.rejected, (state, action) => {
                state.loadingorder = false;
                state.errororder = action.payload || action.error.message;
                state.fetchedById = "";
            });
    },
});

export const { clearorders } = orderSlice.actions;
export default orderSlice.reducer;
