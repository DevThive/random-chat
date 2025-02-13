import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./component/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "find friends chat",
  description: "FFC",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko_KR">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
