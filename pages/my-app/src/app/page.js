"use client";
import "./globals.css";
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";


export default function Home() {
  return (
    <div className="text-black">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}
