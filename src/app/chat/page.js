"use client";
// // pages/index.js
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useRouter } from "next/router";

let socket;

const randomNicknames = ["사용자1", "사용자2", "사용자3", "사용자4", "사용자5"];

const getRandomNickname = () => {
  const randomIndex = Math.floor(Math.random() * randomNicknames.length);
  return randomNicknames[randomIndex];
};

const Chat = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("default");
  const [nickname] = useState(getRandomNickname());
  const [image, setImage] = useState(null);
  const chatWindowRef = useRef(null);
  const [isComposing, setIsComposing] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // 컴포넌트가 마운트되었는지 여부

  useEffect(() => {
    setIsMounted(true); // 컴포넌트가 마운트되면 true로 설정
  }, []);

  useEffect(() => {
    // router가 준비되고, 컴포넌트가 마운트된 후에만 room을 설정
    if (isMounted && router.isReady && router.query.region) {
      setRoom(router.query.region);
    }
  }, [isMounted, router.isReady, router.query.region]); // isMounted와 region이 변경될 때마다 실행

  useEffect(() => {
    if (!isMounted || !router.isReady) return; // 라우터가 준비되지 않았고, 컴포넌트가 마운트되지 않았으면 아무 것도 하지 않음

    socket = io("http://localhost:4000");
    socket.emit("join", room);

    socket.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [room, isMounted, router.isReady]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("message", { room, user: nickname, text: message });
      setMessage("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !isComposing) {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      sendImage(file);
    }
  };

  const sendImage = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new window.Image();
      img.src = reader.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const maxWidth = 300;
        const maxHeight = 300;
        let width = img.width;
        let height = img.height;

        // 이미지 리사이즈
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const resizedImage = canvas.toDataURL("image/png");
        socket.emit("message", { room, user: nickname, image: resizedImage });
        setImage(null);
      };

      img.onerror = (error) => {
        console.error("이미지 로드 오류:", error);
      };
    };

    reader.onerror = (error) => {
      console.error("파일 읽기 오류:", error);
    };

    reader.readAsDataURL(file);
  };

  if (!isMounted) {
    return <div>로딩 중...</div>; // 컴포넌트가 마운트되지 않았을 때 로딩 메시지
  }

  return (
    <div className="container">
      {/* <h1 className="header">랜덤 채팅</h1> */}
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
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder="메시지를 입력하세요"
          style={{ flex: 1, marginRight: "10px" }}
        />
        <button onClick={sendMessage}>전송</button>
      </div>

      <style jsx>{`
        .container {
          max-width: 800px;
          width: 100%; /* 100%로 설정 */
          height: 92vh; /* 전체 높이 */
          margin: 0 auto;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column; /* 세로 방향으로 정렬 */
        }

        .header {
          height: 60px; /* 헤더 높이 설정 */
          display: flex;
          align-items: center; /* 세로 가운데 정렬 */
          margin-bottom: 20px; /* 헤더와 채팅창 간격 */
        }

        .chat-window {
          flex: 1; /* 남은 공간을 모두 차지 */
          overflow-y: auto;
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 10px;
          margin-bottom: 10px;
          background-color: #fafafa;
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

export default Chat;
