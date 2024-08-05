"use client"; // 클라이언트 컴포넌트로 선언

import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

let socket;

const Chat = ({ room }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [nickname, setNickname] = useState(""); // 사용자 이름 상태
  const chatWindowRef = useRef(null);
  const [isComposing, setIsComposing] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(room); // 방 상태
  const [region, setRegion] = useState(""); // 지역 상태
  const [image, setImage] = useState(null); // 이미지 상태
  const [fileInputRef, setFileInputRef] = useState(null); // 파일 입력 참조

  useEffect(() => {
    // URL에서 region 값 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const regionFromUrl = urlParams.get("region");

    if (regionFromUrl) {
      setRegion(regionFromUrl); // URL에서 지역 값 설정
    }

    // room이 없을 경우 region을 currentRoom에 설정
    if (!currentRoom && regionFromUrl) {
      setCurrentRoom(regionFromUrl);
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
  }, [currentRoom]);

  useEffect(() => {
    if (currentRoom) {
      socket = io("http://43.203.75.81:4000");
      socket.emit("join", { room: currentRoom, username: nickname }); // 방에 입장 시 닉네임 전송

      socket.on("message", (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [currentRoom, nickname]); // 방과 닉네임이 바뀔 때마다 소켓 연결

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() || image) {
      socket.emit("message", {
        room: currentRoom,
        user: nickname,
        text: message,
        image: image || null, // 이미지가 있을 경우 전송
      });
      setMessage("");
      setImage(null); // 메시지 전송 후 이미지 초기화
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // 이미지 크기를 300x300으로 조정
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = 300;
          canvas.height = 300;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const resizedImage = canvas.toDataURL("image/jpeg");
          setImage(resizedImage); // 조정된 이미지 미리보기 설정

          // 이미지가 업로드되면 바로 전송
          socket.emit("message", {
            room: currentRoom,
            user: nickname,
            text: "", // 텍스트는 비워두고
            image: resizedImage, // 조정된 이미지를 전송
          });

          // 이미지 전송 후 상태 초기화
          setImage(null); // 이미지 상태 초기화
        };
      };
      reader.readAsDataURL(file); // 이미지 파일을 URL로 변환
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef) {
      fileInputRef.click(); // 파일 입력 클릭 이벤트 발생
    }
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
      <>
        <h2>{currentRoom ? `${currentRoom} 채팅방` : "채팅방"}</h2>
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
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }} // 파일 입력 숨김
            ref={(input) => setFileInputRef(input)} // 파일 입력 참조 설정
          />
          <button onClick={triggerFileInput} style={{ marginRight: "10px" }}>
            + {/* '+' 버튼으로 파일 업로드 트리거 */}
          </button>
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
