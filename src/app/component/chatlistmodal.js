import React, { useState } from "react";

const Modal = ({ onClose, onCreateRoom }) => {
  const [roomName, setRoomName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateRoom(roomName);
    setRoomName("");
    onClose();
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <span style={styles.close} onClick={onClose}>
          &times;
        </span>
        <h2>채팅방 생성</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="방 이름"
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            생성
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  modal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    width: "300px",
    textAlign: "center",
    position: "relative",
  },
  close: {
    position: "absolute",
    top: "10px",
    right: "15px",
    fontSize: "24px",
    cursor: "pointer",
    color: "#aaa",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#0070f3",
    color: "white",
    cursor: "pointer",
  },
};

export default Modal;
