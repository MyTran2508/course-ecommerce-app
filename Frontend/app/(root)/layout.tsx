import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";

import React, { Fragment } from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <Fragment>
      <Navbar />
      {children}
      <Footer />
    </Fragment>
  );
}

export default layout;
