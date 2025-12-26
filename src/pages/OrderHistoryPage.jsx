

import React, { useEffect, useState } from "react";
import { Eye, Loader, X } from "lucide-react";
import { getUserFromToken } from "../model/Model";
import { useDispatch, useSelector } from "react-redux";
import { fetchorders } from "../redux/slice/orderSlice";
import { useNavigate } from "react-router-dom";
import { fetchorderProducts } from "../redux/slice/orderProductSlice";
import { motion } from "framer-motion";
const OrderHistoryPage = () => {
    const { order, loadingorder } = useSelector((state) => state.order);
    const { orderProduct, loadingorderProduct, errororderProduct } = useSelector(
        (state) => state.orderProduct
    );
    const [selectedOrder, setSelectedOrder] = useState(null);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        const user = getUserFromToken();
        if (user) {
            dispatch(fetchorders(getUserFromToken()._id))
        }
        else {
            navigate("/")
        }
    }, []);

    return (
        <motion.div    initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

                {loadingorder ? (
                    <div className="flex items-center justify-center h-40">
                        <Loader className="animate-spin text-gray-500" size={32} />
                    </div>

                ) : order.length === 0 ? (
  <div className="text-center text-gray-500 text-lg mt-10">
    You haven’t placed any orders yet.
  </div>
) : (
                    <div className="space-y-6">
                        {order.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition-all"
                            >
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">
                                            Placed on: {new Date(order.createdAt).toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Address:{" "}
                                            <span className="text-gray-700">{order.address}</span>
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Payment:{" "}
                                            <span className="text-green-600 font-semibold">
                                                {order.paymentStatus}
                                            </span>
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Delivery:{" "}
                                            <span className="text-blue-600 font-semibold">
                                                {order.deliveryStatus}
                                            </span>
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-end space-y-2">
                                        <p className="text-green-600 font-bold text-xl">
                                            ${order.totalAmount.toLocaleString("en-PK")}
                                        </p>

                                        <button
                                            onClick={() => {
                                                setSelectedOrder(order._id)
                                                dispatch(fetchorderProducts(order._id))

                                            }}
                                            className="flex items-center gap-1 px-3 py-2 rounded-md border border-green-500 text-green-600 hover:bg-green-600 hover:text-white transition duration-200 text-sm font-semibold"
                                        >
                                            <Eye size={16} />
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedOrder && (

                <motion.div initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }} className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white max-w-3xl w-full rounded-xl p-6 relative">
                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-bold mb-4">Order Items</h2>

                        <div className="overflow-x-auto">
                            <table className="min-w-full border text-left text-sm">
                                <thead className="bg-gray-100 text-gray-700 font-semibold">
                                    <tr>
                                        <th className="px-4 py-2 border-b">Name</th>
                                        <th className="px-4 py-2 border-b">Image</th>
                                        <th className="px-4 py-2 border-b">Category</th>
                                        <th className="px-4 py-2 border-b">Color</th>
                                        <th className="px-4 py-2 border-b">Gender</th>
                                        <th className="px-4 py-2 border-b">Qty</th>
                                        <th className="px-4 py-2 border-b">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderProduct?.items?.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition">
                                            <td className="px-4 py-2 border-b">{item.productName}</td>
                                            <td className="px-4 py-2 border-b">
                                                <img
                                                    src={item.image}
                                                    alt={item.productName}
                                                    className="w-16 h-16 object-cover rounded-md"
                                                />
                                            </td>
                                            <td className="px-4 py-2 border-b">{item.category}</td>
                                            <td className="px-4 py-2 border-b">{item.color}</td>
                                            <td className="px-4 py-2 border-b">{item.gender}</td>
                                            <td className="px-4 py-2 border-b">{item.quantity}</td>
                                            <td className="px-4 py-2 border-b">
                                                ${item.originalPrice * item.quantity}
                                            </td>
                                        </tr>
                                    ))}
                                    {orderProduct.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="text-center text-gray-500 py-4"
                                            >
                                                No items in this order.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div >
            )}
        </motion.div >
    );
};

export default OrderHistoryPage;
