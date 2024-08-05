import React from "react";
import Link from "next/link";
import "./Header.css"; // CSS 파일 임포트

const Header = () => {
  return (
    <header className="header">
      <div className="logo">FFC</div>
      <nav className="navbar">
        <ul className="nav-list">
          <li className="nav-item">
            <a href="/">홈</a>
          </li>
          <li className="nav-item">
            <a href="#about">소개</a>
          </li>
          {/* <li className="nav-item">
            <Link href="/chat">채팅</Link> {/* 채팅 페이지 링크 
          </li> */}

          {/* <li className="nav-item">
            <a href="#contact">연락처</a>
          </li> */}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
