"use client";
import { useRouter } from "next/navigation";
import useFormState from "@/hooks/useFormState";
import { loginSchema } from "@/lib/validators";
import { api, setAuthToken } from "@/lib/api";
import { useStore } from "@/store/useStore";
import Header from "@/components/Header";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const form = useFormState({ email: "", password: "" }, loginSchema);
  const {setUser,setupAxios} = useStore();
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault();
    const v = form.validate();
    if (!v.ok) return;
    setError('')
    console.log('login',form)
    try {
      const res = await api.post("/auth/login", form.values);
      const { user, token } = res.data;
      setUser(user, token);
      setupAxios();
      if(user?.role == "admin"){
        router.push("/admin");

      }else{

        router.push("/product");
      }
    } catch (err) {
      // alert("Login failed");
      setError('Invalid credentials')
    }
  }

  return (
    <div>
      <main className="max-w-md mx-auto p-6">
        <h1 className="text-2xl mb-4">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={form.values.email}
            onChange={(e) => form.setField("email", e.target.value)}
            placeholder="Email"
            className="border p-2 rounded w-full"
          />
          {form.errors.email && (
            <div className="text-red-600">{form.errors.email}</div>
          )}
          <input
            type="password"
            value={form.values.password}
            onChange={(e) => form.setField("password", e.target.value)}
            placeholder="Password"
            className="border p-2 rounded w-full"
          />
          {form.errors.password && (
            <div className="text-red-600">{form.errors.password}</div>
          )}
          <button className="px-4 py-2 bg-black text-white rounded">
            Login
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </main>
    </div>
  );
}
