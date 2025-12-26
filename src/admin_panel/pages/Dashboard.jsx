import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getAuthHeader } from "../../model/Model";
import { io } from "socket.io-client";

const Dashboard = () => {
  const [orderData, setOrderData] = useState([]);
  const [count, setCount] = useState({
    productCount: "",
    userCount: "",
    orderCount: ""
  });

  useEffect(() => {
    const socket = io("https://stylaro.zeabur.app");

    socket.on("connect", () => {
      console.log("🟢 Connected to WebSocket");
    });

    socket.on("paymentStatusUpdate", (data) => {
      console.log("📦 Payment Status Update:", data);
      fetchDashboardData();
    });

    socket.on("newOrderCreated", (data) => {
      console.log("📈 New Order Created:", data);
      fetchDashboardData();
    });

    return () => {
      socket.disconnect();
      console.log("🔴 Disconnected from WebSocket");
    };
  }, []);


  const fetchDashboardData = async () => {
    try {
      const [chartRes, countRes] = await Promise.all([
        axios.get("https://stylaro.zeabur.app/monthlyOrderChart", {
          headers: getAuthHeader()
        }),
        axios.get("https://stylaro.zeabur.app/getDashboardCount", {
          headers: getAuthHeader()
        }),
      ]);
      setOrderData(chartRes.data);
      setCount(countRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="flex">
      <div className="w-full min-h-screen bg-gray-100">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Welcome, Admin</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow">Users: {count.userCount}</div>
            <div className="bg-white p-6 rounded-xl shadow">Orders: {count.orderCount}</div>
            <div className="bg-white p-6 rounded-xl shadow">Product: {count.productCount}</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Monthly Orders</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#4ade80" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
