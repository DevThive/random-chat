"use client"; // 클라이언트 컴포넌트로 선언

import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

let socket;

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");
  const [nickname, setNickname] = useState(""); // 사용자 이름 상태
  const chatWindowRef = useRef(null);
  const [isComposing, setIsComposing] = useState(false);
  const [roomInput, setRoomInput] = useState(""); // 방 이름 입력 상태

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const region = params.get("region");
    if (region) {
      setRoom(region); // 지역 정보를 방 이름으로 설정
    }

    // 로컬 스토리지에서 사용자 이름 가져오기
    const storedNickname = localStorage.getItem("username");
    if (storedNickname) {
      setNickname(storedNickname); // 로컬 스토리지에서 사용자 이름 설정
    } else {
      const username = prompt("사용자 이름을 입력하세요:"); // 사용자에게 이름 입력 요청
      if (username) {
        setNickname(username);
        localStorage.setItem("username", username); // 로컬 스토리지에 사용자 이름 저장
      }
    }
  }, []);

  useEffect(() => {
    if (room) {
      socket = io("http://localhost:4000");
      socket.emit("join", { room, username: nickname }); // 방에 입장 시 닉네임 전송

      socket.on("message", (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [room, nickname]); // 방과 닉네임이 바뀔 때마다 소켓 연결

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
    if (roomInput.trim() && nickname.trim()) {
      setRoom(roomInput); // 방 이름 설정
      socket.emit("join", { room: roomInput, username: nickname }); // 방에 입장 시 닉네임 전송
      setRoomInput(""); // 입력 필드 초기화
    } else {
      alert("방 이름과 닉네임을 입력해주세요."); // 방 이름이나 닉네임이 비어 있을 경우 경고
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
