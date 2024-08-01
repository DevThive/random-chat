"use client";
// components/OnlineUsers.js
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000"); // 서버 URL에 맞게 수정

const OnlineUsers = () => {
  const [users, setUsers] = useState([]); // 사용자 목록 상태
  const [myUsername, setMyUsername] = useState(""); // 본인 사용자 이름 상태
  // components/OnlineUsers.js
  useEffect(() => {
    socket.emit("join", "default"); // 방 이름 전송

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

    // 5초마다 사용자 목록 요청
    const intervalId = setInterval(() => {
      socket.emit("getUsers"); // 서버에 사용자 목록 요청
    }, 5000);

    // 컴포넌트 언마운트 시 소켓 연결 해제 및 인터벌 클리어
    return () => {
      clearInterval(intervalId);
      socket.disconnect();
    };
  }, [myUsername]);

  // 본인 이름을 가장 위에 표시하기 위해 사용자 목록을 정렬
  const sortedUsers = [...users];
  if (myUsername) {
    sortedUsers.sort((a, b) => (a.username === myUsername ? -1 : 1));
  }

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
                user.username === myUsername ? "#d1e7dd" : "#e7f3ff", // 본인 이름에 다른 색상 적용
            }}
          >
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
    flex: "1",
    overflowY: "auto",
  },
  title: {
    fontSize: "1.5em",
    marginBottom: "15px",
    color: "#333",
  },
  userList: {
    listStyleType: "none",
    padding: "0",
    margin: "0",
  },
  userItem: {
    marginBottom: "5px",
    padding: "8px",
    borderRadius: "4px",
    transition: "background-color 0.2s",
  },
};

export default OnlineUsers;
