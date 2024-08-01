"use client"; // 클라이언트 컴포넌트로 선언

import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

let socket;

const randomNicknames = ["사용자1", "사용자2", "사용자3", "사용자4", "사용자5"];

const getRandomNickname = () => {
  const randomIndex = Math.floor(Math.random() * randomNicknames.length);
  return randomNicknames[randomIndex];
};

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");
  const [nickname] = useState(getRandomNickname());
  const chatWindowRef = useRef(null);
  const [isComposing, setIsComposing] = useState(false);
  const [roomInput, setRoomInput] = useState(""); // 방 이름 입력 상태

  // URL에서 region 파라미터를 가져오고 방 이름으로 설정
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const region = params.get("region");
    if (region) {
      setRoom(region);
    }
  }, []);

  useEffect(() => {
    if (room) {
      socket = io("http://localhost:4000");
      socket.emit("join", room);

      socket.on("message", (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [room]);

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

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const joinRoom = () => {
    if (roomInput.trim()) {
      setRoom(roomInput); // 방 이름 설정
      setRoomInput(""); // 입력 필드 초기화
    }
  };

  return (
    <div className="container">
      {!room ? ( // 방 이름이 설정되지 않은 경우
        <div>
          <input
            type="text"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
            placeholder="방 이름 입력"
            style={{ marginRight: "10px" }}
          />
          <button onClick={joinRoom}>방 입장</button>
        </div>
      ) : (
        <>
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
        </>
      )}
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
