import Home from "./pages/Home";
import { Layout } from "./layout/Layout";
import Product from "./pages/Product";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Complain from "./pages/Complain";
import About from "./pages/About";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./admin_panel/pages/Dashboard";
import LayoutAdmin from "./admin_panel/layout/LayoutAdmin";
import { ToastContainer } from "react-toastify";
import CategoryList from "./admin_panel/pages/Category/CategoryList";
import AddCategory from "./admin_panel/pages/Category/AddCategory";
import EditCategory from "./admin_panel/pages/Category/EditCategory";
import AddColors from "./admin_panel/pages/Color/AddColors";
import ColorList from "./admin_panel/pages/Color/ColorList";
import EditColor from "./admin_panel/pages/Color/EditColor";
import AddProduct from "./admin_panel/pages/Product/AddProduct";
import ProductList from "./admin_panel/pages/Product/ProductList";
import EditProduct from "./admin_panel/pages/Product/EditProduct";
import ComplainList from "./admin_panel/pages/Complain/ComplainList";
import UserList from "./admin_panel/pages/User/UserList";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "./utlis/axiosInterceptor";
import OrderList from "./admin_panel/pages/User/OrderList";
import OrderProductList from "./admin_panel/pages/User/OrderProductList";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import ProtectedAdminRoute from "./utlis/ProtectedRoute";

const stripePromise = loadStripe("pk_test_51RdTvkPTy0kI4EYZ4CJfzjJ0Jxy0omtDT9pLGSMonxX7Sxx78ZdxWmIYAqeQFqVVpX8MnRci9dGb50xb70HC7x16001nraHEND");
export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route
          element={
            <Layout>
              <Home />
            </Layout>
          }
          path="/"
        />
        <Route
          element={
            <Layout>
              <Product />
            </Layout>
          }
          path="/products"
        />
        <Route
          element={
            <Layout>
              <OrderHistoryPage />
            </Layout>
          }
          path="/OrderHistoryPage"
        />
        <Route
          path="/complain"
          element={
            <Layout>
              <Complain />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        <Route
          path="/cartPage"
          element={
            <Layout>
              <Elements stripe={stripePromise}>
                <CartPage />
              </Elements>
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <AuthPage />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout>
              <ProfilePage />{" "}
            </Layout>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
            <LayoutAdmin>
              <Dashboard />
            </LayoutAdmin>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/addcategory"
          element={
                 <ProtectedAdminRoute>            <LayoutAdmin>
              <AddCategory />
            </LayoutAdmin>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/CategoryList"
          element={
                 <ProtectedAdminRoute>            <LayoutAdmin>
              <CategoryList />
            </LayoutAdmin>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/EditCategory"
          element={
                 <ProtectedAdminRoute>
            <LayoutAdmin>
              <EditCategory />
            </LayoutAdmin>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/addcolor"
          element={
                 <ProtectedAdminRoute>
            <LayoutAdmin>
              <AddColors />
            </LayoutAdmin>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/ColorList"
          element={
                 <ProtectedAdminRoute>
            <LayoutAdmin>
              <ColorList />
            </LayoutAdmin>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/EditColor"
          element={
                 <ProtectedAdminRoute>
            <LayoutAdmin>
              <EditColor />
            </LayoutAdmin>
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/addProduct"
          element={
                 <ProtectedAdminRoute>
            <LayoutAdmin>
              <AddProduct />
            </LayoutAdmin>
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/ProductList"
          element={
                 <ProtectedAdminRoute>
            <LayoutAdmin>
              <ProductList />
            </LayoutAdmin>
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/EditProduct/:id"
          element={
                 <ProtectedAdminRoute>
            <LayoutAdmin>
              <EditProduct />
            </LayoutAdmin>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/ComplainList"
          element={
                 <ProtectedAdminRoute>            <LayoutAdmin>
              <ComplainList />
            </LayoutAdmin>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/UserList"
          element={
                 <ProtectedAdminRoute>
            <LayoutAdmin>
              <UserList />
            </LayoutAdmin>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/OrderList/:id/:name"
          element={
                 <ProtectedAdminRoute>
            <LayoutAdmin>
              <OrderList />
            </LayoutAdmin>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/OrderProductList/:id"
          element={
                 <ProtectedAdminRoute>
            <LayoutAdmin>
              <OrderProductList />
            </LayoutAdmin>
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
