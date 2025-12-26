import React, { useEffect, useState } from "react";
import { addApi, getUserFromToken } from "../model/Model";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearcomplains, fetchcomplains } from "../redux/slice/complainSlice";
import { showErrorToast } from "../utlis/toast";
import { motion } from "framer-motion";
const Complain = () => {
  const [form, setForm] = useState({ subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { complain, loadingcomplain, errorcomplain } = useSelector(
    (state) => state.complain
  );

  useEffect(() => {
    const user = getUserFromToken();
    if (user) {
      setIsLogin(true);
      dispatch(fetchcomplains());
    }
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user = await getUserFromToken();
    if (user == null) {
      showErrorToast("Must Login For Complain");
      setLoading(false);
      return;
    }
    try {
      const res = await addApi(form, "add-complain", navigate);
      if (res === true) {
        setForm({ subject: "", message: "" });
        dispatch(clearcomplains());
        dispatch(fetchcomplains());
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    
     <motion.div    initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}  className="relative px-4 pb-20">
      {/* Loader overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-16 h-16 border-4 border-white border-t-green-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Complaint Form */}
      <div className="max-w-[600px] mx-auto p-6 mt-10 bg-white shadow rounded-2xl">
        <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">
          Submit a Complaint
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Message</label>
            <textarea
              name="message"
              rows="5"
              value={form.message}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Complaint List */}
      {isLogin && (
        <div className="max-w-[600px] mx-auto mt-10 bg-white shadow rounded-2xl p-4">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Your Complaints
          </h3>
          {loadingcomplain ? (
            <p className="text-gray-500">Loading complaints...</p>
          ) : errorcomplain ? (
            <p className="text-red-500">Error: {errorcomplain}</p>
          ) : complain.length === 0 ? (
            <p className="text-gray-500">No complaints found.</p>
          ) : (
            <ul className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {complain.map((c) => (
                <li
                  key={c._id}
                  className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-green-600">
                      {" "}
                      <span className="font-semibold text-black">
                        Subject:{" "}
                      </span>
                      {c.subject}
                    </p>
                    <span className="text-xs text-gray-500">
                      {new Date(c.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-line mt-1">
                    <span className="font-semibold text-black">Message: </span>{" "}
                    {c.message}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Complain;
