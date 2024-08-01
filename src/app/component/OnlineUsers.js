"use client";
// components/OnlineUsers.js
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Modal from "react-modal"; // 모달 라이브러리 추가

const socket = io("http://localhost:4000"); // 서버 URL에 맞게 수정

const OnlineUsers = () => {
  const [users, setUsers] = useState([]); // 사용자 목록 상태
  const [myUsername, setMyUsername] = useState(""); // 본인 사용자 이름 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태
  const [currentChatUser, setCurrentChatUser] = useState(null); // 현재 채팅 중인 사용자
  const [message, setMessage] = useState(""); // 메시지 상태
  const [chatMessages, setChatMessages] = useState([]); // 채팅 메시지 목록 상태

  useEffect(() => {
    // 로컬 스토리지에서 사용자 이름 가져오기
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setMyUsername(storedUsername);
      socket.emit("join", { room: "default", username: storedUsername }); // 방 이름과 사용자 이름 전송
    } else {
      const username = prompt("사용자 이름을 입력하세요:");
      if (username) {
        setMyUsername(username);
        localStorage.setItem("username", username); // 로컬 스토리지에 사용자 이름 저장
        socket.emit("join", { room: "default", username }); // 방 이름과 사용자 이름 전송
      }
    }

    socket.on("updateUsers", (userList) => {
      console.log("사용자 목록 업데이트:", userList); // 리스트가 업데이트될 때 로그 출력
      setUsers(userList); // 사용자 목록 업데이트
    });

    socket.on("userJoined", (newUser) => {
      setUsers((prevUsers) => {
        // 중복된 사용자 이름이 있는지 확인
        if (!prevUsers.some((user) => user.username === newUser.username)) {
          return [...prevUsers, newUser];
        }
        return prevUsers; // 중복이 있을 경우 그대로 반환
      });
    });
    socket.on("privateMessage", (message) => {
      console.log(
        `Received message from ${message.from} to ${message.to}: ${message.message}`
      );

      setChatMessages((prevMessages) => [...prevMessages, message]);

      // 로컬 스토리지에 채팅 내용 저장
      saveChatMessages(message.from, message.to, message.message); // 상대방 메시지 저장
    });
    // 5초마다 사용자 목록 요청
    const intervalId = setInterval(() => {
      socket.emit("getUsers"); // 서버에 사용자 목록 요청
    }, 5000);

    // 컴포넌트 언마운트 시 소켓 연결 해제 및 인터벌 클리어
    return () => {
      clearInterval(intervalId);
      socket.disconnect();
    };
  }, []);

  // 본인 이름을 가장 위에 표시하기 위해 사용자 목록을 정렬
  const sortedUsers = [...users];
  if (myUsername) {
    sortedUsers.sort((a, b) => (a.username === myUsername ? -1 : 1));
  }

  const handleUserClick = (username) => {
    setCurrentChatUser(username); // 현재 채팅 중인 사용자 설정
    setIsModalOpen(true); // 모달 열기
    setChatMessages(loadChatMessages(username)); // 이전 채팅 메시지 로드
  };

  const handleSendMessage = () => {
    if (!currentChatUser) {
      alert("채팅할 사용자를 선택해주세요.");
      return;
    }

    const messageData = {
      from: myUsername,
      to: currentChatUser,
      message,
    };

    socket.emit("privateMessage", messageData); // 개인 메시지 전송
    setChatMessages((prevMessages) => [...prevMessages, messageData]); // 메시지 목록 업데이트
    saveChatMessages(myUsername, currentChatUser, message); // 본인 메시지 저장
    setMessage(""); // 메시지 입력 초기화
  };
  const saveChatMessages = (from, to, message) => {
    if (!from || !to) {
      console.error("메시지를 저장할 때 'from' 또는 'to' 값이 누락되었습니다.");
      return;
    }

    const chatKey = `${from}-${to}`;
    const existingMessages = JSON.parse(localStorage.getItem(chatKey)) || [];
    existingMessages.push({ from, to, message }); // 'to' 속성 추가
    localStorage.setItem(chatKey, JSON.stringify(existingMessages));
  };

  const loadChatMessages = (username) => {
    const chatKey = `${myUsername}-${username}`;
    return JSON.parse(localStorage.getItem(chatKey)) || [];
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>현재 접속 중인 사용자</h3>
      <ul style={styles.userList}>
        {sortedUsers.map((user) => (
          <li
            key={user.id}
            style={{
              ...styles.userItem,
              backgroundColor:
                user.username === myUsername ? "#cce5ff" : "#e7f3ff", // 본인 이름에 다른 색상 적용
              color: user.username === myUsername ? "#0056b3" : "#333", // 본인 이름의 텍스트 색상
            }}
            onClick={() => handleUserClick(user.username)} // 사용자 클릭 시 개인 채팅 시작
          >
            {user.username}
          </li>
        ))}
      </ul>

      {/* 모달 컴포넌트 */}
      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
        <h2>{currentChatUser}와의 채팅</h2>
        <div style={styles.chatBox}>
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              style={
                msg.from === myUsername ? styles.myMessage : styles.theirMessage
              }
            >
              <strong>{msg.from}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)} // 메시지 입력 처리
          placeholder="메시지를 입력하세요..."
          style={styles.input}
        />
        <button onClick={handleSendMessage} style={styles.sendButton}>
          보내기
        </button>
        <button
          onClick={() => setIsModalOpen(false)}
          style={styles.closeButton}
        >
          닫기
        </button>
      </Modal>
    </div>
  );
};

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    width: "400px",
    maxHeight: "500px", // 최대 높이 추가
    overflow: "hidden", // 내용이 넘칠 경우 숨기기
  },
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "24px",
    marginBottom: "10px",
  },
  userList: {
    listStyleType: "none",
    padding: 0,
  },
  userItem: {
    padding: "10px",
    marginBottom: "5px",
    cursor: "pointer",
    borderRadius: "5px",
  },
  chatBox: {
    maxHeight: "400px", // 채팅 박스 높이 조정
    overflowY: "auto",
    marginBottom: "15px", // 입력란과의 간격 조정
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "10px",
    backgroundColor: "#f9f9f9",
  },
  input: {
    width: "100%", // 입력란을 전체 너비로 설정
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "10px", // 버튼과의 간격 조정
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  sendButton: {
    padding: "10px 15px",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  closeButton: {
    padding: "10px 15px",
    borderRadius: "5px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  modalTitle: {
    marginBottom: "15px",
    fontSize: "20px",
  },
  myMessage: {
    textAlign: "right",
    margin: "5px 0",
    backgroundColor: "#cce5ff",
    borderRadius: "5px",
    padding: "5px",
  },
  theirMessage: {
    textAlign: "left",
    margin: "5px 0",
    backgroundColor: "#e7f3ff",
    borderRadius: "5px",
    padding: "5px",
  },
};

export default OnlineUsers;
