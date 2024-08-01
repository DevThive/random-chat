// components/ChatList.js
import React from "react";
import Link from "next/link";

const ChatList = () => {
  return (
    <main style={styles.main}>
      <h2>채팅방 리스트</h2>
      <ul style={styles.chatList}>
        <li>채팅방 1</li>
        <li>채팅방 2</li>
        <li>채팅방 3</li>
        <li>채팅방 4</li>
      </ul>
      <Link href="/chat">
        <button style={styles.button}>새 채팅방 만들기</button>
      </Link>
    </main>
  );
};

const styles = {
  main: {
    width: "55%",
    minWidth: "300px",
    padding: "10px",

    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },
  chatList: {
    listStyleType: "none",
    padding: "0",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    marginTop: "10px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#0070f3",
    color: "#fff",
    cursor: "pointer",
  },
};

export default ChatList;
