"use client";
import Header from "@/components/Header";
import { api, APICall } from "@/lib/api";
import { useEffect, useState } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    APICall
      .get("/admin/users")
      .then((r) => setUsers(r?.data || []))
      .catch(console.error);
  }, []);
  return (
    <div>
      <main className="p-6 max-w-4xl mx-auto">
        <h2 className="text-xl mb-4">Users</h2>
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="border p-3 rounded flex justify-between">
              <div>
                <div className="font-medium">{u.name}</div>
                <div className="text-sm text-gray-600">{u.email}</div>
              </div>
              <div>{u.role}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
