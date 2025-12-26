import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserFromToken } from "../../model/Model";

const Header = ({ toggleSidebar }) => {
  const [user, setUser] = useState({
    name: "",
    address: "",
    image: "",
  });

  useEffect(() => {
    const getuser = getUserFromToken();
    if (getuser) {
      setUser({
        name: getuser.name || "",
        address: getuser.address || "",
        image: getuser.image || "", // fallback to avatar if blank
      });
    }
  }, []);

  return (
    <header className="bg-white shadow flex justify-between items-center p-4 px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button className="lg:hidden" onClick={toggleSidebar}>
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700 font-medium">{user.name}</span>

        <img
          src={
            user.image
              ? user.image
              : "https://i.pravatar.cc/150?img=3"
          }
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </header>
  );
};

export default Header;
