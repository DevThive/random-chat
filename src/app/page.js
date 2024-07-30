// app/page.js
import React from "react";
import Link from "next/link";

const Home = () => {
  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h3>지역 카테고리</h3>
        <ul style={styles.categoryList}>
          <li>
            <Link href="/chat?region=seoul">서울</Link>
          </li>
          <li>
            <Link href="/chat?region=busan">부산</Link>
          </li>
          <li>
            <Link href="/chat?region=daegu">대구</Link>
          </li>
          <li>
            <Link href="/chat?region=incheon">인천</Link>
          </li>
          <li>
            <Link href="/chat?region=jeju">제주도</Link>
          </li>
        </ul>
      </aside>

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
  },
  sidebar: {
    width: "20%",
    minWidth: "200px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
  },
  main: {
    width: "55%",
    minWidth: "300px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },
  advertisement: {
    width: "20%",
    minWidth: "200px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
  },
  categoryList: {
    listStyleType: "none",
    padding: "0",
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

// 미디어 쿼리 추가
const mediaStyles = {
  "@media (max-width: 768px)": {
    container: {
      flexDirection: "column", // 세로 방향으로 배치
      alignItems: "stretch", // 모든 요소를 가로로 맞춤
    },
    sidebar: {
      width: "100%", // 모바일에서는 전체 너비 사용
      marginBottom: "20px", // 아래쪽 여백 추가
    },
    main: {
      width: "100%", // 모바일에서는 전체 너비 사용
      marginBottom: "20px", // 아래쪽 여백 추가
    },
    advertisement: {
      width: "100%", // 모바일에서는 전체 너비 사용
    },
  },
};

// 스타일 적용
const applyStyles = (baseStyles, mediaStyles) => {
  const combinedStyles = { ...baseStyles };
  Object.keys(mediaStyles).forEach((media) => {
    const rules = mediaStyles[media];
    const mediaQuery = window.matchMedia(media);
    if (mediaQuery.matches) {
      Object.assign(combinedStyles, rules);
    }
  });
  return combinedStyles;
};

export default Home;
