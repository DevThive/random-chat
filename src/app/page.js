"use client";
// pages/index.js
import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

const Home = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("default");

  useEffect(() => {
    // NestJS 서버 URL로 소켓 연결
    socket = io("http://localhost:4000");

    socket.emit("join", room);

    socket.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [room]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("message", { room, text: message });
      setMessage("");
    }
  };

  return (
    <div className="container">
      <h1>랜덤 채팅</h1>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.user}</strong>: {msg.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
        />
        <button onClick={sendMessage}>전송</button>
      </div>
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .chat-window {
          height: 400px;
          overflow-y: auto;
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 10px;
          margin-bottom: 10px;
          background-color: #fafafa;
        }

        .message {
          margin: 5px 0;
        }

        .input-container {
          display: flex;
        }

        input {
          flex: 1;
          padding: 10px;
          border-radius: 4px;
          border: 1px solid #ccc;
        }

        button {
          padding: 10px 15px;
          margin-left: 10px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        button:hover {
          background-color: #005bb5;
        }
      `}</style>
    </div>
  );
};

export default Home;
