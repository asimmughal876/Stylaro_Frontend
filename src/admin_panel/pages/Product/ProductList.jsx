import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Search, Star } from "lucide-react";
import { fetchproducts } from "../../../redux/slice/productSlice";

const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { product, loadingproduct, errorproduct } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchproducts());
  }, [dispatch]);

  const handleAddProduct = () => {
    navigate("/admin/addProduct");
  };

  const handleUpdate = (Product) => {
    navigate(`/admin/EditProduct/${Product}`);
  };

  const filteredProduct = product.filter((color) =>
    color.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-full w-full mx-auto bg-white shadow rounded-xl p-6 mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold">Products</h2>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            onClick={handleAddProduct}
            className="bg-green-600 flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 shadow"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
      </div>

      {loadingproduct && <p className="text-gray-500">loading Products...</p>}
      {errorproduct && <p className="text-red-500">error: {errorproduct}</p>}

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
              <th className="px-4 py-2 border-b">Discount</th>
              <th className="px-4 py-2 border-b">Rating</th>
              <th className="px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProduct.map((prod, index) => (
              <tr key={prod._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 border-b">{prod.name}</td>
                <td className="px-4 py-3 border-b">${prod.price}</td>
                <td className="px-4 py-3 border-b"><img src={prod.image} width={100} height={100} /></td>
                <td className="px-4 py-3 border-b">{prod.category}</td>
                <td className="px-4 py-3 border-b">{prod.gender}</td>
                <td className="px-4 py-3 border-b">{prod.color}</td>
                <td className="px-4 py-3 border-b">{prod.quantity}</td>
                <td className="px-4 py-3 border-b">{prod.discount ? `${prod.discount}%` : "0%"}</td>
                <td className="px-4 py-3 border-b">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    {prod.rating ? prod.rating : "Not Rated"}
                  </div>
                </td>
                <td className="px-4 py-3 border-b">
                  <button
                    onClick={() => handleUpdate(prod._id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-green-500 text-green-600 hover:bg-green-600 hover:text-white transition duration-200 text-sm font-semibold"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {product.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  No Products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
