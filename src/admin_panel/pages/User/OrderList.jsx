import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, Pencil, Search } from "lucide-react";
import { clearorders, fetchorders } from "../../../redux/slice/orderSlice";
import { UpdateApi } from "../../../model/Model";

const OrderList = () => {
    const { id, name } = useParams();
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate()
    const { order, loadingorder, errororder } = useSelector((state) => state.order);

    useEffect(() => {
        dispatch(fetchorders(id));
    }, [dispatch]);



    const handleStatusChange = async (orderId, newStatus) => {
        const data = { status: newStatus };
        const success = await UpdateApi(data, "updateorderStatus", orderId);

        if (success) {
            dispatch(clearorders());
            dispatch(fetchorders(id));
        }
    };

    const filteredorder = order.filter((u) =>
        u.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-full w-full mx-auto bg-white shadow rounded-xl p-6 mt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h2 className="text-2xl font-bold">{name ? name : ""} Orders</h2>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search Address..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                </div>
            </div>

            {loadingorder && <p className="text-gray-500">loading orders...</p>}
            {errororder && <p className="text-red-500">error: {errororder}</p>}

            <div className="overflow-x-auto">
                <table className="min-w-full border text-left text-sm">
                    <thead className="bg-gray-100 text-gray-700 font-semibold">
                        <tr>
                            <th className="px-4 py-2 border-b">Address</th>
                            <th className="px-4 py-2 border-b">Payement Status</th>
                            <th className="px-4 py-2 border-b">Total Amount</th>
                            <th className="px-4 py-2 border-b">Date</th>
                            <th className="px-4 py-2 border-b">View Products</th>
                            <th className="px-4 py-2 border-b">Delivery Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredorder.map((data, index) => (
                            <tr key={data._id} className="hover:bg-gray-50 transition">


                                <td className="px-4 py-3 border-b">{data.address ? data.address : "Not Provided"}</td>
                                <td className="px-4 py-3 border-b">{data.paymentStatus}</td>
                                <td className="px-4 py-3 border-b">${data.totalAmount}</td>
                                <td className="px-4 py-3 border-b">{new Date(data.createdAt).toLocaleString()}</td>
                                <td className="px-4 py-3 border-b">
                                    <button
                                        onClick={() => navigate(`/admin/OrderProductList/${data._id}`)}
                                        className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-green-500 text-green-600 hover:bg-green-600 hover:text-white transition duration-200 text-sm font-semibold"
                                    >
                                        <Eye size={16} />
                                        View
                                    </button>

                                </td>
                                <td className="px-4 py-3 border-b space-y-2">

                                    <select
                                        value={data.deliveryStatus}
                                        onChange={(e) => handleStatusChange(data._id, e.target.value)}
                                        className="mt-2 block w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="processing">processing</option>
                                        <option value="shipped">shipped</option>
                                        <option value="delivered">delivered</option>
                                        <option value="cancelled">cancelled</option>
                                    </select>
                                </td>

                            </tr>
                        ))}
                        {order.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-500">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderList;
