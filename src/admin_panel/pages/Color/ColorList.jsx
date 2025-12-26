import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Search } from "lucide-react";
import { fetchColors } from "../../../redux/slice/colorSlice";

const ColorList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { Colors, loadingColor, errorColor } = useSelector((state) => state.color);

  useEffect(() => {
    dispatch(fetchColors());
  }, [dispatch]);

  const handleAddcolor = () => {
    navigate("/admin/addcolor");
  };

  const handleUpdate = (Color) => {
    navigate("/admin/EditColor", { state: Color });
  };

  const filteredColors = Colors.filter((color) =>
    color.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-full w-full mx-auto bg-white shadow rounded-xl p-6 mt-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold">Colors</h2>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search colors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            onClick={handleAddcolor}
            className="bg-green-600 flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 shadow"
          >
            <Plus size={18} />
            Add Color
          </button>
        </div>
      </div>

      {loadingColor && <p className="text-gray-500">Loading colors...</p>}
      {errorColor && <p className="text-red-500">Error: {errorColor}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border text-left text-sm">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-2 border-b">Color Name</th>
              <th className="px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredColors.map((cat) => (
              <tr key={cat._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 border-b">{cat.name}</td>
                <td className="px-4 py-3 border-b">
                  <button
                    onClick={() => handleUpdate(cat)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-green-500 text-green-600 hover:bg-green-600 hover:text-white transition duration-200 text-sm font-semibold"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {filteredColors.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  No matching colors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ColorList;
