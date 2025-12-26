import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addApi } from "../../../model/Model";
import { fetchCategories } from "../../../redux/slice/categorySlice";
import { fetchColors } from "../../../redux/slice/colorSlice";
import { clearproducts } from "../../../redux/slice/productSlice";
import { useNavigate } from "react-router-dom";
import { showErrorToast } from "../../../utlis/toast";

const AddProduct = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);
  const { Colors } = useSelector((state) => state.color);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    color: "",
    category: "",
    price: "",
    gender: "",
    image: "",
    quantity: "",
    rating: "",
    discount: "",
  });

  const [imageFile, setImageFile] = useState(null); // raw file
  const [previewUrl, setPreviewUrl] = useState(null); // for preview
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchColors());
  }, [dispatch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      showErrorToast("Only image files (jpeg, jpg, png) are allowed.");
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let imageUrl = "";

      if (imageFile) {
        const imageData = new FormData();
        imageData.append("file", imageFile);
        imageData.append("upload_preset", "Stylaro");

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dylzc8c7j/image/upload",
          {
            method: "POST",
            body: imageData,
          }
        );

        const data = await response.json();
        imageUrl = data.secure_url;
      }

      const success = await addApi(
        { ...formData, image: imageUrl },
        "add-product",
        navigate
      );

      if (success) {
        setFormData({
          name: "",
          color: "",
          category: "",
          price: "",
          gender: "",
          image: "",
          quantity: "",
          rating: "",
          discount: "",
        });
        setImageFile(null);
        setPreviewUrl(null);
        dispatch(clearproducts());
        navigate("/admin/ProductList");
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-full w-full mx-auto bg-white shadow rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            required
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g., Red Shirt"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            required
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g., 1200"
          />
        </div>
 <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            required
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g., 100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rating
          </label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            required
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g., 4.5"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Discount
          </label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            required
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g., 10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <select
            name="color"
            value={formData.color}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select Color</option>
            {Colors.map((color) => (
              <option key={color._id} value={color._id}>
                {color.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-green-50 file:text-green-700
              hover:file:bg-green-100"
          />
          {previewUrl && (
            <div className="mt-2">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-20 w-20 object-cover rounded-md"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50"
          disabled={isUploading}
        >
          {isUploading ? "Processing..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
