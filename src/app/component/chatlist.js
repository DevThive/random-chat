"use client";
// components/ChatList.js
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client"; // socket.io-client 임포트
import Modal from "./chatlistmodal";

const socket = io("http://43.203.75.81:4000", {
  withCredentials: true, // 쿠키와 같은 인증 정보를 포함할지 여부
});
// WebSocket 서버에 연결

const ChatList = ({ onJoinRoom }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    // 방 목록을 가져오는 이벤트 리스너 등록
    socket.on("updateRooms", (rooms) => {
      setChatRooms(rooms);
    });

    fetchChatRooms(); // 컴포넌트가 마운트될 때 방 목록 가져오기

    return () => {
      socket.off("updateRooms");
      socket.disconnect(); // 컴포넌트 언마운트 시 소켓 연결 끊기
    };
  }, []);

  const fetchChatRooms = () => {
    socket.emit("getRooms");
  };

  const handleCreateRoom = async (roomName) => {
    try {
      socket.emit("createRoom", roomName);
    } catch (error) {
      console.error("채팅방 생성 중 오류 발생:", error);
      alert("채팅방 생성 중 오류가 발생했습니다.");
    }
  };

  const handleJoinRoom = (roomName) => {
    if (onJoinRoom) {
      onJoinRoom(roomName); // 상위 컴포넌트의 joinRoom 함수 호출
    }
  };

  return (
    <div style={styles.main}>
      <div style={styles.header}>
        <h2 style={styles.title}>채팅방 목록</h2>
        <button onClick={() => setIsModalOpen(true)} style={styles.button}>
          채팅방 생성
        </button>
      </div>
      <div style={styles.chatListContainer}>
        <ul style={styles.chatList}>
          {chatRooms
            .filter((room) => room.name !== "default") // "default" 방을 필터링
            .map((room) => (
              <li
                key={room.name}
                onClick={() => handleJoinRoom(room.name)}
                style={styles.chatItem}
              >
                <span style={styles.userCount}>{room.userCount}명</span>
                {/* 인원수를 왼쪽에 배치 */}
                <span style={styles.roomName}>{room.name}</span>
                {/* 방 이름은 오른쪽에 배치 */}
              </li>
            ))}
        </ul>
      </div>
      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          onCreateRoom={handleCreateRoom}
        />
      )}
    </div>
  );
};

const styles = {
  main: {
    width: "100%",
    minWidth: "300px",
    padding: "10px",
    borderRadius: "8px",
    // backgroundColor: "#fff",
    // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between", // 양쪽 끝으로 배치
    alignItems: "center", // 세로 중앙 정렬
    marginBottom: "10px", // 아래 여백 추가
  },
  title: {
    fontSize: "24px",
    // marginBottom: "10px",
    // textAlign: "center",
  },
  chatList: {
    listStyleType: "none",
    padding: "0",
    margin: "0",
    maxHeight: "400px",
    overflowY: "scroll", // 스크롤 가능하게
  },
  chatItem: {
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    padding: "15px",
    borderBottom: "1px solid #eaeaea",
    transition: "background-color 0.3s",
    backgroundColor: "#f9f9f9",
  },
  chatItemHover: {
    backgroundColor: "#f1f1f1",
  },
  userCount: {
    fontWeight: "bold",
    color: "#0070f3",
  },
  roomName: {
    flexGrow: 1,
    textAlign: "left",
    paddingLeft: "10px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    // marginTop: "10px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#0070f3",
    color: "#fff",
    cursor: "pointer",
    width: "30%",
  },
};

export default ChatList;
