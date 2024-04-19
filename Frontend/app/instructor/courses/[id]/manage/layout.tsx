import React from "react";
import SideBar from "../../../SideBar";
import Navbar from "./Navbar";
import Footer from "@/components/Footer/Footer";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex">
        <SideBar />

        {children}
      </div>
      <Footer />
    </div>
  );
}

export default layout;
