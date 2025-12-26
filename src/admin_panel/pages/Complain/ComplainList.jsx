import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Eye, X } from "lucide-react";
import { fetchcomplains, clearcomplains } from "../../../redux/slice/complainSlice";

const ComplainList = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComplain, setSelectedComplain] = useState(null);
  const { complain = [], loadingcomplain, errorcomplain,fetchedById } = useSelector((state) => state.complain);

  useEffect(() => {
    
    if(!fetchedById){
      dispatch(clearcomplains());
    dispatch(fetchcomplains());
    }
  }, [fetchedById]);


  const handleView = (comp) => {
    setSelectedComplain(comp);
  };

  const handleCloseModal = () => {
    setSelectedComplain(null);
  };

  const filteredComplain = complain.filter((comp) =>
    comp.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-full w-full mx-auto bg-white shadow rounded-xl p-6 mt-6">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold">Complains</h2>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search Complains..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Loading and Error */}
      {loadingcomplain && <p className="text-gray-500">loading Complains...</p>}
      {errorcomplain && <p className="text-red-500">error: {errorcomplain}</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-left text-sm">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-2 border-b">Subject</th>
              <th className="px-4 py-2 border-b">Message</th>
              <th className="px-4 py-2 border-b">User Name</th>
              <th className="px-4 py-2 border-b">User Email</th>
              <th className="px-4 py-2 border-b">Date</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplain.map((comp) => (
              <tr key={comp._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 border-b">{comp.subject}</td>
                <td
                  className="px-4 py-3 border-b max-w-[200px] truncate"
                  title={comp.message}
                >
                  {comp.message}
                </td>
                <td className="px-4 py-3 border-b">{comp.userName}</td>
                <td className="px-4 py-3 border-b">{comp.userEmail}</td>
                <td className="px-4 py-3 border-b">{comp.createdAt ? new Date(comp.createdAt).toLocaleString() : ""}</td>
                <td className="px-4 py-3 border-b flex gap-2">
                  <button
                    onClick={() => handleView(comp)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-green-500 text-green-600 hover:bg-green-600 hover:text-white transition duration-200 text-sm font-semibold"
                  >
                    <Eye size={16} />
                    View
                  </button>
                
                </td>
              </tr>
            ))}
            {complain.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No Complains found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedComplain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md sm:max-w-lg relative">
            <h3 className="text-xl font-semibold mb-4">Complain Details</h3>
            <div className="space-y-2">
              <p><strong>Subject:</strong> {selectedComplain.subject}</p>
              <div>
                <p className="font-semibold mb-1">Message:</p>
                <div className="max-h-40 overflow-y-auto whitespace-pre-wrap break-words border p-2 rounded bg-gray-50">
                  {selectedComplain.message}
                </div>
              </div>
              <p><strong>User Name:</strong> {selectedComplain.userName}</p>
              <p><strong>User Email:</strong> {selectedComplain.userEmail}</p>
              <p><strong>Date:</strong> {selectedComplain.createdAt ? new Date(selectedComplain.createdAt).toLocaleString() : ""}</p>
            </div>
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
            >
              <X size={16}/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplainList;
