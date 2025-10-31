"use client";
import { useRouter } from "next/navigation";
import useFormState from "@/hooks/useFormState";
import { signupSchema } from "@/lib/validators";
import { api, setAuthToken } from "@/lib/api";
import { useStore } from "@/store/useStore";
import Header from "@/components/Header";

export default function SignupPage() {
  const router = useRouter();
  const form = useFormState(
    { name: "", email: "", password: "", role: "admin" },
    signupSchema
  );
  const store = useStore();

  async function handleSubmit(e) {
    e.preventDefault();
    // const v = form.validate();
    // console.log('first',v.ok)
    // if (!v.ok) return;
    try {
      const res = await api.post("/auth/signup", form.values);
      const { user, token } = res.data;
      // store.setUser(user, token);
      // setAuthToken(token);
      router.push("/login");
    } catch (err) {
      alert("Signup failed");
    }
  }
  return (
    <div>
      <main className="max-w-md mx-auto p-6">
        <h1 className="text-2xl mb-4">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={form.values.name}
            onChange={(e) => form.setField("name", e.target.value)}
            placeholder="Name"
            className="border p-2 rounded w-full"
          />
          {form.errors.name && (
            <div className="text-red-600">{form.errors.name}</div>
          )}
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

          <select
            value={form?.values?.role}
            onChange={(e) => form.setField("role", e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value={"admin"}>admin</option>
            <option value={"user"}>user</option>
          </select>
          <button className="px-4 py-2 bg-black text-white rounded">
            Create account
          </button>
        </form>
      </main>
    </div>
  );
}
