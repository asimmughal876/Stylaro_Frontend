import axios from "axios";

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn("Unauthorized: clearing token and redirecting");

            localStorage.removeItem("token");
            localStorage.removeItem("cartItems");

            setTimeout(() => {
                window.location.href = "/login";
            }, 5000);
        }

        return Promise.reject(error);
    }
);
