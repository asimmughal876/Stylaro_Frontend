import React, { useState } from "react";
import { addApi } from "../../../model/Model";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearColors } from "../../../redux/slice/colorSlice";

const AddColors = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { name };
    const success = await addApi(data, "add-color", navigate);

    if (success) {
      setName("");
      dispatch(clearColors())
      navigate("/admin/ColorList")
    }
  };

  return (
    <div className="max-w-full w-full mx-auto bg-white shadow rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Colors</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Colors Name
          </label>
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g., Red, Blue"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
        >
          Add Color
        </button>
      </form>
    </div>
  );
};

export default AddColors;
