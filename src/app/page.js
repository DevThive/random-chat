"use client";
// pages/index.js
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

let socket;

const randomNicknames = ["사용자1", "사용자2", "사용자3", "사용자4", "사용자5"];

const getRandomNickname = () => {
  const randomIndex = Math.floor(Math.random() * randomNicknames.length);
  return randomNicknames[randomIndex];
};

const Home = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("default");
  const [nickname] = useState(getRandomNickname());
  const [image, setImage] = useState(null);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    socket = io("http://localhost:4000");

    socket.emit("join", room);

    socket.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [room]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  // useEffect(() => {
  //   socket.on("message", (msg) => {
  //     console.log("Received message from server:", msg); // 수신된 메시지 확인
  //     setMessages((prevMessages) => [...prevMessages, msg]);
  //   });
  // }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("message", { room, user: nickname, text: message });
      setMessage("");
    }
  };

  // const sendImage = () => {
  //   if (image) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       console.log(reader.result); // 이미지 데이터 확인
  //       socket.emit("message", { room, user: nickname, image: reader.result });
  //       setImage(null);
  //     };
  //     reader.readAsDataURL(image);
  //   }
  // };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      sendImage(file); // 이미지가 선택될 때 바로 전송
    }
  };

  const sendImage = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log(reader.result); // 이미지 데이터 확인
        socket.emit("message", { room, user: nickname, image: reader.result });
        setImage(null); // 이미지 상태 초기화
      };
      reader.readAsDataURL(file); // 파일을 데이터 URL로 읽기
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  // const handleImageChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setImage(file);
  //   }
  // };

  return (
    <div className="container">
      <h1>랜덤 채팅</h1>
      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className="message"
            style={{ color: msg.user === nickname ? "red" : "black" }}
          >
            <strong>{msg.user}</strong>: {msg.text}
            {msg.image && (
              <img
                src={msg.image}
                alt="전송된 이미지"
                className="message-image"
              />
            )}
          </div>
        ))}
      </div>
      <div className="input-container">
        <label
          htmlFor="image-upload"
          style={{ cursor: "pointer", marginRight: "10px" }}
        >
          <span style={{ fontSize: "24px", lineHeight: "0" }}>+</span>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }} // 숨기기
          />
        </label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요"
          style={{ flex: 1, marginRight: "10px" }} // 입력창을 더 넓게
        />
        <button onClick={sendMessage}>전송</button>
      </div>

      <style jsx>{`
        .input-container {
          display: flex; /* Flexbox를 사용하여 수평 정렬 */
          align-items: center; /* 세로 가운데 정렬 */
        }

        .input-container input[type="file"] {
          display: none; /* 파일 입력 버튼 숨기기 */
        }

        .input-container label {
          background-color: #f0f0f0; /* 배경색 */
          border-radius: 50%; /* 원 모양 */
          width: 40px; /* 크기 */
          height: 40px; /* 크기 */
          display: flex; /* Flexbox 사용 */
          justify-content: center; /* 가로 가운데 정렬 */
          align-items: center; /* 세로 가운데 정렬 */
          cursor: pointer; /* 커서 변경 */
        }

        .input-container button {
          margin-left: 10px; /* 버튼 간격 */
        }

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

        .message-image {
          max-width: 100%;
          max-height: 200px;
          margin-top: 5px;
        }

        .input-container {
          display: flex;
          align-items: center;
        }

        input[type="text"] {
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
