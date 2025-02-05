import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("https://chat-app-backend-1qir.onrender.com");

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null); // For auto-scrolling

  const loggedInUser = {
    username: localStorage.getItem("username"),
    name: "You",
    image: localStorage.getItem("image") || "https://via.placeholder.com/40",
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("https://chat-app-backend-1qir.onrender.com/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          let usersList = await response.json();
          
          // Place the logged-in user at the top of the list
          usersList = usersList.sort((a, b) =>
            a.username === loggedInUser.username ? -1 : b.username === loggedInUser.username ? 1 : 0
          );

          setUsers(usersList);
        } else {
          setError("Failed to fetch users.");
        }
      } catch (error) {
        setError("Error fetching users.");
      }
    };

   
    
    fetchUsers();

    socket.emit("register", loggedInUser.username);

    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await fetch(
            `https://chat-app-backend-1qir.onrender.com/messages/${selectedUser.username}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (response.ok) {
            const data = await response.json();
            setMessages(data);
          } else {
            setError("Failed to fetch chat history.");
          }
        } catch (error) {
          setError("Error fetching chat history.");
        }
      };

      fetchMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom(); // Auto-scroll when messages change
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUser || selectedUser.username === loggedInUser.username) return;

    const sender = loggedInUser.username;
    const receiver = selectedUser.username;
    const newMessage = { sender, receiver, message: messageText };

    socket.emit("send_message", newMessage);
    setMessageText("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove JWT token
    localStorage.removeItem("username"); // Remove username if stored
    window.location.href = "/login"; // Redirect to login page
  };
  

  return (
    <div className="flex h-screen">
       
      {/* USERS LIST */}
      <div className="w-1/3 bg-gray-800 text-white p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-semibold text-violet-500">Users</h3>
      <button onClick={handleLogout} className="bg-purple-700 text-white px-3 py-1 rounded-md text-sm">
        Logout
      </button>
    </div>
        <ul>
          {users.map((user) => (
            <li
              key={user._id}
              className={`flex items-center gap-3 p-3 rounded cursor-pointer border-b border-gray-700 ${
                user.username === loggedInUser.username ? "bg-gray-700" : "hover:bg-violet-600"
              }`}
              onClick={() => user.username !== loggedInUser.username && setSelectedUser(user)}
            >
              <img
                src={user.image || "https://via.placeholder.com/40"}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <span className="text-lg">{user.username === loggedInUser.username ? "You" : user.name}</span>
              </div>
            </li>
          ))}
        </ul>
       

      </div>

      {/* CHAT WINDOW */}
      <div className="flex-1 flex flex-col p-6">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 border-b pb-2 mb-4">
              <img
                src={selectedUser.image || "https://via.placeholder.com/40"}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover"
              />
              <h3 className="text-xl font-semibold text-violet-500">{selectedUser.name}</h3>
            </div>

            {/* MESSAGES */}
            <div className="scrollable-content flex-1  space-y-4 p-2 border border-gray-300 rounded-lg overflow-y-scroll ">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 ${
                    msg.sender === loggedInUser.username ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender !== loggedInUser.username && (
                    <img
                      src={selectedUser.image || "https://via.placeholder.com/40"}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <div
                    className={`p-3 rounded-lg max-w-xs ${
                      msg.sender === loggedInUser.username
                        ? "bg-violet-500 text-white text-right"
                        : "bg-gray-200 text-black text-left"
                    }`}
                  >
                    <p>{msg.message}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} /> {/* Invisible div for auto-scroll */}
            </div>

            {/* MESSAGE INPUT */}
            <form onSubmit={sendMessage} className="flex mt-4">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
                required
                className="flex-1 p-2 border text-white border-gray-300 rounded-l-md"
              />
              <button
                type="submit"
                disabled={!selectedUser || selectedUser.username === loggedInUser.username}
                className={`p-2 rounded-r-md ${
                  !selectedUser || selectedUser.username === loggedInUser.username
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-violet-600 hover:bg-violet-700"
                } text-white`}
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <p className="text-center text-gray-500">Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default Chat;
