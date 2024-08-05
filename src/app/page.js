"use client";
// app/page.js
import React, { useState } from "react"; // useState 추가
import RegionList from "./component/region";
import ChatList from "./component/chatlist";
import OnlineUsers from "./component/OnlineUsers"; // 추가된 부분
import Chat from "./chat/page"; // 채팅 컴포넌트 추가

const Home = () => {
  const [currentRoom, setCurrentRoom] = useState(null); // 현재 방 상태 추가

  const handleJoinRoom = (roomName) => {
    setCurrentRoom(roomName); // 방 이름을 업데이트
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftContainer}>
        <div style={styles.regionContainer}>
          <RegionList />
        </div>
        <div style={styles.onlineUsersContainer}>
          <OnlineUsers />
        </div>
      </div>

      <div style={styles.chatContainer}>
        {currentRoom ? (
          <Chat room={currentRoom} /> // 현재 방으로 채팅 컴포넌트 렌더링
        ) : (
          <ChatList onJoinRoom={handleJoinRoom} /> // ChatList에 onJoinRoom 함수 전달
        )}
      </div>

      <aside style={styles.advertisement}>
        <h3>광고</h3>
        <p>여기에 광고를 넣을 수 있습니다.</p>
      </aside>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px",
    gap: "20px",
    flexWrap: "wrap",
    height: "92vh",
    boxSizing: "border-box", // 패딩을 포함하여 높이 계산
  },
  leftContainer: {
    display: "flex",
    flexDirection: "column",
    flex: "1",
  },
  regionContainer: {
    flex: "1",
    minHeight: "200px", // 최소 높이를 px 단위로 설정
    marginBottom: "20px", // 아래쪽 여백 추가
    borderRadius: "5px",
    backgroundColor: "#fff",
    padding: "10px", // 내부 여백 추가
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // 그림자 추가
  },
  onlineUsersContainer: {
    flex: "1", // flex: "2"에서 "1"로 변경
    minHeight: "200px",
    borderRadius: "5px",
    backgroundColor: "#fff",
    padding: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  chatContainer: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    borderRadius: "5px",
    backgroundColor: "#fff",
    padding: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  advertisement: {
    width: "20%",
    minWidth: "200px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
};

export default Home;
