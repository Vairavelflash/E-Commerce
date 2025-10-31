"use client";
import Header from "@/components/Header";
import { api, APICall } from "@/lib/api";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    APICall
      .get("/orders")
      .then((r) => setOrders(r.data.orders || []))
      .catch(console.error);
  }, []);

  return (
    <div>
      <main className="max-w-3xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">My Orders</h2>
        <div className="space-y-2">
          {orders.map((o) => (
            <div key={o.id} className="border p-3 rounded">
              <div className="flex justify-between">
                <div>Order: {o.id}</div>
                <div>{o.status}</div>
              </div>
              <div className="text-sm text-gray-600">Total: ₹{o.total}</div>
              <a className="text-sm text-blue-600" href={`/order/${o.id}`}>
                View
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
