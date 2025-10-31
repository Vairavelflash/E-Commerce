"use client";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function page() {
  const router = useRouter();
  const { user } = useStore();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user?.role == "admin") {
      router.push("/admin");
    } else if (user.role == "user") {
      router.push("/product");
    }
  }, [user]);
  return <div>...loading</div>;
}

export default page;
