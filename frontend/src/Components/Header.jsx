import { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Logout, getNotications } from "../api/curd";
import { logout } from "../store/slice/authSlice";
import { useSelector, useDispatch } from "react-redux";

const Header = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatach = useDispatch();

  const user = useSelector((state) => {
    console.log("state", state.auth.user);
    return state.auth.user;
  });

  const [open, setOpen] = useState(false);
  const [bell, setBell] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const check = async () => {
      try {
        if (!user.id) return;
        console.log(user);
        const data = await getNotications(user.id);
        console.log(data[0].message);
        setNotifications(data);
      } catch (e) {
        console.log(e, "error noti");
      }
    };
    check();
  }, [user]);

  const handleLogout = async () => {
    await Logout();
    dispatach(logout());
  };

  const handleClick = () => {
    setBell(!bell);
    console.log(user);
  };

  return (
    <div className="flex items-center justify-between px-5 py-3 w-full h-20 bg-[#898989] text-xl text-white sticky top-0">
      <div>
        <h1 className="font-bold">Customer Report</h1>
      </div>
      <div>
        {isAuthenticated && (
          <div>
            <div className="flex items-center justify-evenly gap-3">
              <FaBell onClick={handleClick} className="" />
              {bell && (
                <div className="absolute bg-white  text-black top-55 right-5  border border-black rounded-sm m-auto p-5 flex flex-col gap-2">
                  {notifications.length === 0 ? (
                    <p>No notifications</p>
                  ) : (
                    notifications.map((n, index) => (
                      <h1 key={index} className="font-mono text-red-500">
                        {n.message}
                      </h1>
                    ))
                  )}
                </div>
              )}
              <div className="flex flex-col items-center justify-center">
                <button onClick={() => setOpen(!open)}>
                  <FaUser className="ml-2" />
                  <p className="text-sm mt-1">{user && user.customerName}</p>
                </button>
              </div>
            </div>
            {open && (
              <div className="px-3 py-1 absolute right-0 top-15 text-gray-900 flex flex-col text-sm gap-1 bg-white border-white rounded-sm ">
                <Link to="/profile">Profile</Link>
                <Link to="/setting">Setting</Link>
                <p className="cursor-pointer" onClick={handleLogout}>
                  Sign out
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
