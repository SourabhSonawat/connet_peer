import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { createSocketConnection } from "../utils/socket";
import { Base_url } from "../utils/BASE_URL";
const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = useSelector((store) => store.user);
  const userId = user?.id;
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChatMessages();
  }, [targetUserId]);

  useEffect(() => {
    if (!userId) return;

    if (!socketRef.current) {
      socketRef.current = createSocketConnection();
    }

    socketRef.current.emit("joinChat", { userId, targetUserId });

    // Listen for incoming messages on the socket
    const handleMessageReceived = (msg) => {
      console.log("New message received:", msg);
      // Update messages when a message is received by either the sender or the target user
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    };

    socketRef.current.on("messageReceived", handleMessageReceived);

    return () => {
      socketRef.current.off("messageReceived", handleMessageReceived);
      socketRef.current.disconnect();
      socketRef.current = null;
    };
  }, [userId, targetUserId]);

  const fetchChatMessages = async () => {
    try {
      const response = await axios.get(`${Base_url}/api/chat/${targetUserId}`, {
        withCredentials: true,
      });
      console.log(response.data);

      const chatMessages =
        response?.data?.messages?.map((msg) => ({
          id: msg.id,
          firstName: msg.sender?.firstName || "Unknown",
          lastName: msg.sender?.lastName || "User",
          text: msg.text,
          userId: msg.sender?.id || null,
          createdAt: msg.created_at,
        })) || [];

      setMessages(chatMessages);
      scrollToBottom();
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !socketRef.current) return;

    const messageData = {
      id: Date.now(), // Temporary ID for instant UI update
      firstName: user?.first_name || "Unknown",
      lastName: user?.last_name || "User",
      userId,
      targetUserId,
      text: newMessage,
      createdAt: new Date().toISOString(),
      status: "pending", // Add a pending status
    };

    // Optimistic UI update
    setMessages((prev) => [...prev, messageData]);

    // Emit the message to the socket and also broadcast to target and sender
    socketRef.current.emit("sendMessage", messageData, (ack) => {
      if (!ack?.success) {
        console.error("Message sending failed:", ack?.error);
        setMessages((prev) => prev.filter((msg) => msg.id !== messageData.id)); // Remove failed message
        return;
      }

      // If successfully sent, update state with server-confirmed message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageData.id
            ? { ...msg, status: "sent", ...ack.message }
            : msg
        )
      );
    });

    // Emit to target user so they can receive the message in real-time
    socketRef.current.emit("messageReceived", messageData);

    // Clear input and scroll
    setNewMessage("");
    scrollToBottom();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col bg-black text-white rounded-lg">
      <h1 className="p-5 text-white font-semibold font-serif border-b border-gray-600">
        Chat
      </h1>
      <div className="flex-1 overflow-y-auto p-5">
        {messages.map((msg, index) => {
          const isSender = msg.userId === userId;
          return (
            <div
              key={index}
              className={`chat ${isSender ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-header text-gray-400">
                {msg.firstName} {msg.lastName}
                <time className="text-xs pl-1 opacity-50">
                  {msg.createdAt && !isNaN(new Date(msg.createdAt).getTime())
                    ? formatDistanceToNow(new Date(msg.createdAt), {
                        addSuffix: true,
                      })
                    : "Just now"}
                </time>
              </div>
              <div
                className={`chat-bubble ${
                  isSender
                    ? "bg-gray-900 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {msg.text}
              </div>
              <div className="chat-footer opacity-50">
                {isSender ? "Sent" : "Received"}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-5 border-t border-gray-600 flex items-center gap-2 bg-gray-900">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border bg-gray-800 border-gray-600 text-white rounded p-2"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          disabled={!newMessage.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
