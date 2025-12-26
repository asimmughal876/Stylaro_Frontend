import React, { useState, useEffect } from "react";
import { UpdateApi } from "../../../model/Model";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearColors } from "../../../redux/slice/colorSlice";

const UpdateColor = () => {
  const [name, setName] = useState("");
  const location = useLocation();
  const Color = location.state;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (Color) {
      setName(Color.name);
    }
  }, [Color]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name };
    const success = await UpdateApi(data, "updateColor", Color._id,navigate);

    if (success) {
      setName("");
      dispatch(clearColors());
      navigate("/admin/ColorList");
    }
  };

  return (
    <div className="max-w-full w-full mx-auto bg-white shadow rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Update Color</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color Name
          </label>
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g., Shoes, Bags"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
        >
          Update Color
        </button>
      </form>
    </div>
  );
};

export default UpdateColor;
