import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Chatbox from "./Chatbox";

export const Layout = ({ children }) => {
  return (
    <div className="">
      <Header />
      <Chatbox/>
      {children}
      <Footer />
    </div>
  );
};
