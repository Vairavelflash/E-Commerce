"use client";

import api from "@/lib/api";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function page() {
  const router = useRouter();

  async function authMe() {
    try {
      const authMe = await api.get("/auth/me");

      if (authMe.data?.data.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.log(error);
      router.push("/login");
    }
  }
  useEffect(() => {
    authMe();
  }, []);
  return <div>...loading</div>;
}

export default page;
