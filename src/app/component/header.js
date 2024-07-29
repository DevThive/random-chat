import React from "react";
import "./Header.css"; // CSS 파일 임포트

const Header = () => {
  return (
    <header className="header">
      <div className="logo">FFC</div>
      <nav className="navbar">
        <ul className="nav-list">
          {/* <li className="nav-item">
            <a href="#home">홈</a>
          </li> */}
          <li className="nav-item">
            <a href="#about">소개</a>
          </li>
          <li className="nav-item">
            <a href="#services">서비스</a>
          </li>
          {/* <li className="nav-item">
            <a href="#contact">연락처</a>
          </li> */}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
