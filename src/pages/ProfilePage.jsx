import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFromToken, authapi } from "../model/Model";
import { showErrorToast, showSuccessToast } from "../utlis/toast";
import { motion } from "framer-motion";
const CLOUDINARY_UPLOAD_PRESET = "Stylaro";
const CLOUDINARY_CLOUD_NAME = "dylzc8c7j";

const getRandomColor = () => {
  const colors = [
    "#F87171",
    "#FBBF24",
    "#34D399",
    "#60A5FA",
    "#A78BFA",
    "#F472B6",
    "#FCD34D",
    "#4ADE80",
    "#38BDF8",
    "#C084FC",
    "#FB7185",
    "#F59E0B",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [avatarBg, setAvatarBg] = useState(getRandomColor());

  const [avatarPreview, setAvatarPreview] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserFromToken();
        if (!userData) {
          navigate("/login");
        } else {
          setUser(userData);
          setFormData({
            name: userData.name || "",
            address: userData.address || "",
            image: userData.image || "",
          });
        }
      } catch (error) {
        showErrorToast("Something went wrong");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      showErrorToast("Only image files (jpg, jpeg, png) are allowed.");
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      showErrorToast("Image size should be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);

    setSelectedImageFile(file);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let imageUrl = formData.image;

      if (selectedImageFile) {
        const data = new FormData();
        data.append("file", selectedImageFile);
        data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: data,
          }
        );

        const result = await res.json();
        if (!result.secure_url) return showErrorToast("Image upload failed");
        imageUrl = result.secure_url;
        showSuccessToast("Image uploaded successfully");
      }

      const updatedData = { ...formData, image: imageUrl };
      const res = await authapi("updateUser", updatedData);
      if (res) {
        setUser({ ...user, ...updatedData });
        setFormData((prev) => ({ ...prev, image: imageUrl }));
        setEditMode(false);
        setSelectedImageFile(null);
        setAvatarPreview("");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-screen">
    <motion.div    initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }} className=" bg-gray-100 py-10 px-4 flex justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {editMode ? "Edit Profile" : "Your Profile"}
        </h2>

        <div className="flex justify-center">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover border"
            />
          ) : formData.image ? (
            <img
              src={formData.image}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border"
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-semibold border"
              style={{ backgroundColor: avatarBg }}
            >
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="space-y-4 text-gray-700">
          <div className="space-y-4 text-gray-700">
            {editMode ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Upload Profile Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-green-50 file:text-green-700
            hover:file:bg-green-100"
                  />
                </div>
                <div className="flex justify-between gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 font-semibold bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      setAvatarPreview("");
                      setSelectedImageFile(null);
                    }}
                    className="flex-1 bg-gray-400 font-semibold text-black py-2 rounded-md hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div>
                  <span className="font-medium">Name: </span> {user.name}
                </div>
                <div>
                  <span className="font-medium">Email: </span> {user.email}
                </div>
                <div>
                  <span className="font-medium">Address: </span>{" "}
                  {user.address || "N/A"}
                </div>
              </>
            )}
          </div>

          <div className="flex justify-between gap-3">
            {!editMode && (
              <>
                <button
                  onClick={() => setEditMode(true)}
                  className="flex-1 bg-green-600 font-semibold text-white py-2 rounded-md hover:bg-green-700"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("cartItems");
                    window.location.reload();
                  }}
                  className="flex-1 bg-gray-400 font-semibold text-black py-2 rounded-md hover:bg-gray-500"
                >
                  Log Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
    </div>
  );
};

export default ProfilePage;
