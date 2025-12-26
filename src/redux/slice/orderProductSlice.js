import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthHeader } from "../../model/Model";
import { showErrorToast } from "../../utlis/toast";

const API_URL = "https://stylaro.zeabur.app/getOrderProduct";

export const fetchorderProducts = createAsyncThunk(
    "orderProduct/fetchAll",
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
            const { orderProduct } = getState();

            if (orderProduct.fetchedById === id) {
                return false;
            }

            return true;
        },
    }
);


const orderProductSlice = createSlice({
    name: "orderProduct",
    initialState: {
        orderProduct: [],
        loadingorderProduct: false,
        errororderProduct: null,
        fetchedById: "",
    },
    reducers: {
        clearorderProducts: (state) => {
            state.orderProduct = [];
            state.fetchedById = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchorderProducts.pending, (state) => {
                state.loadingorderProduct = true;
                state.errororderProduct = null;
                state.fetchedById = "";
            })
            .addCase(fetchorderProducts.fulfilled, (state, action) => {
                state.loadingorderProduct = "";
                state.orderProduct = action.payload.data;
                state.fetchedById = action.payload.fetchedById;
            })
            .addCase(fetchorderProducts.rejected, (state, action) => {
                state.loadingorderProduct = false;
                state.errororderProduct = action.payload || action.error.message;
                state.fetchedById = "";
            });
    },
});

export const { clearorderProducts } = orderProductSlice.actions;
export default orderProductSlice.reducer;
