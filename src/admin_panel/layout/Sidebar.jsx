import {
  LayoutDashboard,
  Users,
  Package,
  LogOut,
  X,
  Tag,
  Palette,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { label: "Users", icon: Users, path: "/admin/UserList" },
    { label: "Products", icon: Package, path: "/admin/ProductList" },
    { label: "Category", icon: Tag, path: "/admin/CategoryList" },
    { label: "Color", icon: Palette, path: "/admin/ColorList" },
    { label: "Complain", icon: AlertCircle, path: "/admin/ComplainList" },
  ];

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cartItems");
    navigate("/");
  };

  return (
    <div
      className={`bg-green-600 text-white w-64 h-full fixed z-40 top-0 left-0 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      {/* Mobile Header */}
      <div className="flex justify-between items-center px-6 py-4 lg:hidden">
        <h1 className="text-xl font-bold">Menu</h1>
        <button onClick={toggleSidebar}>
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6 space-y-8">
        <h1 className="text-2xl font-bold hidden lg:block">Admin Panel</h1>
        <ul className="space-y-4">
          {navItems.map(({ label, icon: Icon, path }) => (
            <li key={label}>
              <Link
                to={path}
                className="flex items-center gap-3 p-2 hover:bg-green-700 rounded-lg transition-all"
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-2 hover:bg-green-700 rounded-lg transition-all w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
