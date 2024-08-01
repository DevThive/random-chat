// components/RegionList.js
import React from "react";
import Link from "next/link";

const RegionList = () => {
  return (
    <aside style={styles.sidebar}>
      <h3 style={styles.title}>지역 카테고리</h3>
      <ul style={styles.categoryList}>
        {regions.map((region) => (
          <li key={region.value} style={styles.listItem}>
            <Link href={`/chat?region=${region.value}`}>
              <a style={styles.link}>{region.label}</a>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

const regions = [
  { value: "seoul", label: "서울" },
  { value: "busan", label: "부산" },
  { value: "daegu", label: "대구" },
  { value: "incheon", label: "인천" },
  { value: "jeju", label: "제주도" },
];

const styles = {
  sidebar: {
    flex: "1", // 남은 공간을 차지하도록 설정
    minHeight: "200px", // 최소 높이 설정
    // padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: "1.5em",
    marginBottom: "15px",
    color: "#333",
  },
  categoryList: {
    display: "flex", // Flexbox 사용
    flexWrap: "wrap", // 줄 바꿈 허용
    listStyleType: "none",
    padding: "0",
  },
  listItem: {
    flex: "1 1 calc(20% - 10px)", // 기본적으로 5개 정도 보여짐, 여백을 고려하여 계산
    margin: "5px", // 간격 추가
  },
  link: {
    textDecoration: "none",
    color: "#0070f3",
    fontSize: "1.1em",
    padding: "8px",
    borderRadius: "4px",
    transition: "background-color 0.3s",
    backgroundColor: "#e7f3ff", // 기본 배경색 추가
    display: "block", // 링크를 블록으로 설정하여 전체 영역 클릭 가능
    textAlign: "center", // 텍스트 가운데 정렬
  },
};

export default RegionList;
