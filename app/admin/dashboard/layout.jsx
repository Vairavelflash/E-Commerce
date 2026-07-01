"use client";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function layout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function checkAuth() {
    setLoading(true);
    try {
      await api.get("auth/me");
    } catch (error) {
      return router.replace("/login");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) return <p>...Loading</p>;
  return <div>{children}</div>;
}

export default layout;
