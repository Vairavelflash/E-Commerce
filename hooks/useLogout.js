"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function useLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post("/auth/logout");
      localStorage.removeItem("username")
      localStorage.removeItem("userId")
      localStorage.removeItem("role")
      return response.data;
    },

    onSuccess: () => {
      router.push("/login");
      router.refresh();
    },
    onError:() =>{
      router.push("/login");
      router.refresh();
    }
  });
}