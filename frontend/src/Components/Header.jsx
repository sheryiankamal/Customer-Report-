import { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Logout, getAllMsg, getNotications, sendMessage } from "../api/curd";
import getAllUsers from "../api/curd";
import { logout } from "../store/slice/authSlice";
import { useSelector, useDispatch } from "react-redux";

const Header = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [customers, setCustomers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [admin, setAdmin] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [help, setHelp] = useState(false);
  const [bell, setBell] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [allMsg, setAllMsg] = useState([]);

  // Initial Data Fetch
  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const users = await getAllUsers();
        const noti = await getNotications(user.id);

        setCustomers(users);
        setNotifications(noti);
      } catch (err) {
        console.log("Error fetching data", err);
      }
    };

    fetchData();
  }, [user]);

  // Polling for messages
  useEffect(() => {
    if (!showChat || !selectedAdmin) return;

    const fetchMessages = async () => {
      console.log("setInterval called!")
      const msgs = await getAllMsg(user.id, selectedAdmin);
      setAllMsg(msgs);
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);

    return () => clearInterval(interval);
  }, [showChat, selectedAdmin, user]);

  const handleLogout = async () => {
    await Logout();
    dispatch(logout());
  };

  const handleChatStart = () => {
    if (!selectedAdmin) return;

    const selected = customers.find((c) => c.id === Number(selectedAdmin));

    setAdmin(selected);
    setShowChat(true);
    setHelp(false);
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    await sendMessage(selectedAdmin, user.id, message);
    setMessage("");

    const msgs = await getAllMsg(user.id, selectedAdmin);
    setAllMsg(msgs);
  };

  return (
    <div className="flex items-center justify-between px-5 py-3 w-full h-20 bg-gray-700 text-white sticky top-0">
      <h1 className="font-bold text-xl">Customer Report</h1>

      {isAuthenticated && (
        <div className="flex items-center gap-4 relative">
          {/* Help Button */}
          <button
            onClick={() => setHelp(!help)}
            className="bg-blue-500 px-3 py-1 rounded"
          >
            {user.role === "admin" ? "Chats" : "Ask for Help"}
          </button>

          {/* Admin Selection */}
          {help && (
            <div className="absolute right-0 top-55 bg-white text-black p-4 rounded shadow w-64">
              <label className="text-sm font-semibold">Choose Admin</label>

              <select
                value={selectedAdmin}
                onChange={(e) => {
                  setSelectedAdmin(e.target.value);
                  setShowChat(false);
                }}
                className="text-black w-full mt-2 px-3 py-2 border rounded"
              >
                <option value="">
                  {user.role == "customer" ? (
                    <div>select admins</div>
                  ) : (
                    <div>select admins or customer</div>
                  )}
                </option>
                {customers
                  .filter((c) => {
                    if (c.id === user.id) return false;
                    if (user.role === "admin") {
                      return true;
                    }
                    if (user.role === "customer") {
                      return c.role === "admin";
                    }
                    return false;
                  })
                  .map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.customerName}
                    </option>
                  ))}
              </select>

              {selectedAdmin && (
                <button
                  onClick={handleChatStart}
                  className="mt-3 w-full bg-blue-500 text-white py-2 rounded"
                >
                  Start Chat
                </button>
              )}
            </div>
          )}

          {showChat && (
            <div className="absolute right-0 top-30 w-80 h-100 bg-white text-black rounded-xl shadow-xl flex flex-col border">
            
              <div className="bg-blue-500 text-white px-4 py-3 rounded-t-xl flex justify-between">
                <h2 className="font-semibold">{admin?.customerName}</h2>
                <button onClick={() => setShowChat(false)}>✕</button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 bg-gray-100 space-y-2">
                {allMsg.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender_id === user.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-3 py-2 rounded-lg max-w-xs ${
                        msg.sender_id === user.id
                          ? "bg-blue-500 text-white"
                          : "bg-white border"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 p-3 border-t">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type message..."
                  className="flex-1 border rounded px-3 py-2"
                />
                <button
                  onClick={handleSend}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {/* Notifications */}
          <FaBell onClick={() => setBell(!bell)} className="cursor-pointer" />

          {bell && (
            <div className="absolute right-0 top-50 bg-white w-90 text-black px-3 py-2 rounded shadow">
              {notifications.length === 0 ? (
                <p>No notifications</p>
              ) : (
                notifications.map((n) => (
                  <p key={n.id} className="text-sm">
                    {n.message}
                  </p>
                ))
              )}
            </div>
          )}

          {/* Profile */}
          <div className="relative">
            <img
              onClick={() => setOpen(!open)}
              className="h-10 w-10 rounded object-cover cursor-pointer"
              src={`http://localhost:3000/uploads/${user?.profileImage}`}
              alt="profile"
            />
            {open && (
              <div className="w-20 absolute -right-4 top-8 bg-white text-black p-2 rounded shadow text-sm flex flex-col gap-1">
                <Link to="/profile">Profile</Link>
                <Link to="/setting">Setting</Link>
                <p onClick={handleLogout} className="cursor-pointer">
                  Sign out
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
