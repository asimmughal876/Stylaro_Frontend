import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Chatbox from "../../layout/Chatbox";

const LayoutAdmin = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 min-h-screen bg-gray-100 lg:ml-64">
        <Header toggleSidebar={toggleSidebar} />
              <Chatbox/>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default LayoutAdmin;
