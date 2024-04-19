import React from "react";
import SideBar from "@/components/SideBar/SideBar";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex xs:relative">
      <SideBar />
      <div className="order-2 w-full">{children}</div>
    </div>
  );
}

export default layout;
