import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Search } from "lucide-react";
import { clearuser, fetchuser } from "../../../redux/slice/userSlice";
import { UpdateApi } from "../../../model/Model";

const UserList = () => {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const { user, loadinguser, erroruser } = useSelector((state) => state.user);
    const navigate = useNavigate()
    function getRandomColor(seed = "") {
        const colors = [
            "#f59e0b",
            "#10b981",
            "#3b82f6",
            "#ef4444",
            "#8b5cf6",
            "#ec4899",
            "#14b8a6",
        ];
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = seed.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    }

    useEffect(() => {
        dispatch(fetchuser());
    }, [dispatch]);



    const handleStatusChange = async (userId, newStatus) => {
        const data = {userId, status: newStatus };
        const success = await UpdateApi(data, "updateUserStatus", userId);

        if (success) {
            dispatch(clearuser());
            dispatch(fetchuser());
        }
    };

    const filtereduser = user.filter((u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-full w-full mx-auto bg-white shadow rounded-xl p-6 mt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h2 className="text-2xl font-bold">Users</h2>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                </div>
            </div>

            {loadinguser && <p className="text-gray-500">loading users...</p>}
            {erroruser && <p className="text-red-500">error: {erroruser}</p>}

            <div className="overflow-x-auto">
                <table className="min-w-full border text-left text-sm">
                    <thead className="bg-gray-100 text-gray-700 font-semibold">
                        <tr>
                            <th className="px-4 py-2 border-b">Name</th>
                            <th className="px-4 py-2 border-b">Email</th>
                            <th className="px-4 py-2 border-b">Image</th>
                            <th className="px-4 py-2 border-b">Address</th>
                            <th className="px-4 py-2 border-b">Date</th>
                            <th className="px-4 py-2 border-b">Orders</th>
                            <th className="px-4 py-2 border-b">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtereduser.map((data, index) => (
                            <tr key={data._id} className="hover:bg-gray-50 transition">
                                <td className="px-4 py-3 border-b">{data.name}</td>
                                <td className="px-4 py-3 border-b">{data.email}</td>
                                <td className="px-4 py-3 border-b">
                                    {data.image ? (
                                        <img
                                            src={data.image}
                                            alt={data.name ? `${data.name}'s profile` : "User profile"}
                                            width={100}
                                            height={100}
                                            className="rounded-full object-cover w-16 h-16"
                                        />
                                    ) : (
                                        <div
                                            className="w-16 h-16 flex items-center justify-center rounded-full text-white text-xl font-semibold"
                                            style={{ backgroundColor: getRandomColor(data._id) }}
                                        >
                                            {data.name ? data.name[0].toUpperCase() : "U"}
                                        </div>
                                    )}
                                </td>

                                <td className="px-4 py-3 border-b">{data.address ? data.address : "Not Provided"}</td>
                                <td className="px-4 py-3 border-b">{new Date(data.createdAt).toLocaleString()}</td>
                                <td className="px-4 py-3 border-b">
                                    <button
                                        onClick={() => navigate(`/admin/OrderList/${data._id}/${data.name}`)}
                                        className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-green-500 text-green-600 hover:bg-green-600 hover:text-white transition duration-200 text-sm font-semibold"
                                    >
                                        <Eye size={16} />
                                        View
                                    </button>

                                </td>
                                <td className="px-4 py-3 border-b space-y-2">

                                    <select
                                        value={data.status}
                                        onChange={(e) => handleStatusChange(data._id, e.target.value)}
                                        className="mt-2 block w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="unverified">unverified</option>
                                        <option value="verified">verified</option>
                                        <option value="banned">banned</option>
                                    </select>
                                </td>



                            </tr>
                        ))}
                        {user.length === 0 && (
                            <tr>
                                <td colSpan="3" className="text-center py-4 text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserList;
