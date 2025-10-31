import Link from "next/link";
import React from "react";

function StartHeader() {
  return (
    <header className="p-4 border-b flex items-center justify-around">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold text-lg">
          Ecom
        </Link>
      </div>
    </header>
  );
}

export default StartHeader;
