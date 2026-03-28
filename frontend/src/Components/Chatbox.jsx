import React from "react";
import { useSelector } from "react-redux";

const Chatbox = ({
  allMsg,
  admin,
  setShowChat,
  message,
  setMessage,
  handleSend,
}) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div>
      <div className="absolute right-0 top-20 w-80 h-100 bg-white text-black rounded-xl shadow-xl flex flex-col border">
        <div className="bg-blue-500 text-white px-4 py-3 rounded-t-xl flex justify-between">
          <h2 className="font-semibold">{admin?.customerName}</h2>
          <button onClick={() => setShowChat(false)}>✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100 space-y-2">
          {allMsg.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender_id === user.id ? "justify-end" : "justify-start"
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
    </div>
  );
};

export default Chatbox;
