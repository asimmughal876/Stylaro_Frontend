import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  useParams } from "react-router-dom";
import { Search } from "lucide-react";
import { fetchorderProducts } from "../../../redux/slice/orderProductSlice";

const OrderProductList = () => {
  const dispatch = useDispatch();
  const {id} = useParams()
  const [searchTerm, setSearchTerm] = useState("");

  const { orderProduct, loadingorderProduct, errororderProduct } = useSelector(
    (state) => state.orderProduct
  );

  useEffect(() => {
    dispatch(fetchorderProducts(id));
  }, [dispatch]);

  const filteredItems =
    orderProduct?.items?.filter((item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="max-w-full w-full mx-auto bg-white shadow rounded-xl p-6 mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold">Order Products</h2>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search order products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {loadingorderProduct && <p className="text-gray-500">Loading order products...</p>}
      {errororderProduct && <p className="text-red-500">Error: {errororderProduct}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border text-left text-sm">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Price</th>
              <th className="px-4 py-2 border-b">Image</th>
              <th className="px-4 py-2 border-b">Category</th>
              <th className="px-4 py-2 border-b">Gender</th>
              <th className="px-4 py-2 border-b">Color</th>
              <th className="px-4 py-2 border-b">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((prod, index) => (
              <tr key={index} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 border-b">{prod.productName}</td>
                <td className="px-4 py-3 border-b">${prod.originalPrice * prod.quantity}</td>
                <td className="px-4 py-3 border-b">
                  <img src={prod.image} alt={prod.productName} width={80} height={80} />
                </td>
                <td className="px-4 py-3 border-b">{prod.category}</td>
                <td className="px-4 py-3 border-b">{prod.gender}</td>
                <td className="px-4 py-3 border-b">{prod.color}</td>
                <td className="px-4 py-3 border-b">{prod.quantity}</td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No order products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderProductList;
