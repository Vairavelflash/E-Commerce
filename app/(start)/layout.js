import StartHeader from "@/components/StartHeader";
import React from "react";

function layout({ children }) {
  return (
    <div>
      <StartHeader />
      {children}
    </div>
  );
}

export default layout;
