import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Trash2, Minus, Plus } from "lucide-react";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "../redux/slice/cartSlice";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { getAuthHeader, getUserFromToken } from "../model/Model";
import { useNavigate } from "react-router-dom";
import { showErrorToast } from "../utlis/toast";
import { motion } from "framer-motion";
const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = getUserFromToken();
    if (user) {
      setAddress(user.address || "")
    }
    else {
      navigate("/")
    }
  }, []);

  const getDiscountedPrice = (price, discount) => {
    if (discount == null || discount === undefined) return price;
    return price - (price * discount) / 100;
  };

  const getTotalPrice = () =>
    cartItems.reduce((total, item) => {
      const finalPrice = getDiscountedPrice(item.price, item.discount);
      return total + finalPrice * item.quantity;
    }, 0);

  // ✅ Check if any item is out of stock
  const hasOutOfStockItem = () => {
    return cartItems.some(item => !item.stock || item.quantity > item.stock);
  };

  const handleCheckout = async () => {
    const validationErrors = {};
    if (!address.trim()) {
      validationErrors.address = "Address is required";
    }

    if (!stripe || !elements.getElement(CardElement)) {
      validationErrors.card = "Card information is incomplete";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (hasOutOfStockItem()) {
      showErrorToast("Some items are out of stock.");
      return;
    }

    try {
      setLoading(true);
      const user = getUserFromToken();

      if (!user) {
        showErrorToast("Invalid Credentials");
        navigate("/");
        return;
      }

      const response = await axios.post(
        "https://stylaro.zeabur.app/order",
        {
          items: cartItems,
          address: address,
        },
        { headers: getAuthHeader() }
      );

      const { clientSecret } = response.data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.name,
            address: {
              line1: address,
            },
          },
        },
      });

      if (result.error) {
        showErrorToast(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          dispatch(clearCart());
          setOrderDetails({
            totalAmount: getTotalPrice().toFixed(2),
            date: new Date().toLocaleString(),
            items: cartItems,
          });
          setPaymentSuccess(true);
        }
      }
    } catch (err) {
      console.error("❌ Error during payment", err);
      showErrorToast("Something went wrong during checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-16 h-16 border-4 border-white border-t-green-500 rounded-full animate-spin"></div>
        </div>
      )}
      <motion.div initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }} className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>

          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500 text-lg mt-10">Your cart is empty.</p>
          ) : (
            <>
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-2xl shadow-sm border hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-xl border"
                      />
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                          {item.name}
                        </h2>
                        <div className="flex items-center gap-3 mt-1">
                          <button
                            onClick={() => dispatch(decreaseQuantity(item._id))}
                            className="w-8 h-8 flex items-center justify-center rounded-full border text-gray-700 hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-2 font-medium text-gray-700">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => dispatch(increaseQuantity(item._id))}
                            className={`w-8 h-8 flex items-center justify-center rounded-full border text-gray-700 
                            ${item.quantity >= item.stock ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100"}`}
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus size={16} />
                          </button>
                          {item.stock ? (
                            <p className="text-sm text-gray-500 mt-1">In Stock: {item.stock}</p>
                          ) : (
                            <p className="text-sm text-red-600 mt-1">Not In Stock</p>
                          )}
                        </div>
                        <p className="mt-2 text-gray-900 font-semibold">
                          {item.discount > 0 ? (
                            <>
                              <span className="line-through text-gray-500 mr-2">
                                $: {(item.price * item.quantity).toLocaleString("en-PK", {
                                  minimumFractionDigits: 2,
                                })}
                              </span>
                              <span className="text-red-600">
                                $: {(getDiscountedPrice(item.price, item.discount) * item.quantity).toLocaleString("en-PK", {
                                  minimumFractionDigits: 2,
                                })}
                              </span>
                            </>
                          ) : (
                            <>
                              $: {(item.price * item.quantity).toLocaleString("en-PK", {
                                minimumFractionDigits: 2,
                              })}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => dispatch(removeFromCart(item._id))}
                      className="text-red-500 hover:text-red-600 mt-4 sm:mt-0"
                      title="Remove item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-6 bg-white rounded-2xl shadow-md border border-gray-200 space-y-6 max-w-5xl mx-auto">
                <div className="space-y-2">
                  <label className="block text-lg font-semibold text-gray-700">Address</label>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 ${errors.address ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-green-500"}`}
                    placeholder="Enter your address"
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500">{errors.address}</p>
                  )}
                </div>

                <div className="flex items-center justify-between text-lg font-semibold text-gray-700">
                  <span>Total:</span>
                  <span className="text-green-600 text-xl font-bold">
                    $ {getTotalPrice().toLocaleString("en-PK", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="border border-gray-300 rounded-xl p-4 bg-gray-50 shadow-sm">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#32325d",
                          "::placeholder": { color: "#a0aec0" },
                        },
                        invalid: {
                          color: "#e53e3e",
                        },
                      },
                    }}
                  />
                </div>

                {hasOutOfStockItem() && (
                  <p className="text-red-500 text-sm mt-2">
                    One or more items in your cart are out of stock or exceed available quantity.
                  </p>
                )}

                <button
                  onClick={handleCheckout}
                  className={`w-full font-semibold  text-base py-3 px-6 rounded-xl shadow-md transition duration-200
                    ${hasOutOfStockItem() ? "bg-gray-400 text-black cursor-not-allowed " : "text-white bg-green-600 hover:bg-green-700"}`}
                  disabled={hasOutOfStockItem()}
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>

        {paymentSuccess && orderDetails && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold text-green-600 mb-3">🎉 Payment Successful!</h2>
              <p className="text-sm text-gray-600 mb-4">
                Your order has been placed successfully.
              </p>

              <div className="text-sm text-gray-700 space-y-2">
                <p><span className="font-semibold">Date:</span> {orderDetails.date}</p>
                <p>
                  <span className="font-semibold">Total:</span> ${" "}
                  {parseFloat(orderDetails.totalAmount).toLocaleString("en-PK")}
                </p>
                <div>
                  <span className="font-semibold">Items:</span>
                  <ul className="list-disc ml-5 mt-1">
                    {orderDetails.items.map((item, index) => (
                      <li key={index}>
                        {item.name} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => {
                  setPaymentSuccess(false)
                  navigate("/")
                }}
                className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default CartPage;
