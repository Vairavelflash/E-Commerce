import Header from "@/components/Header";
import React from "react";

function layout({ children }) {
  return (
    <div>
      <Header role={"user"} />
      {children}
    </div>
  );
}

export default layout;
