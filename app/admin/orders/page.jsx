"use client";
import Header from "@/components/Header";
import { api, APICall } from "@/lib/api";
import { useStore } from "@/store/useStore";
import { useEffect, useState } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const { setTrigger, trigger } = useStore();
  useEffect(() => {
    APICall.get("/orders")
      .then((r) => setOrders(r.data.orders || []))
      .catch(console.error);
  }, [trigger]);

  async function updateStatus(id, status) {
    APICall.put("/orders/" + id, { status })
      .then((res) => setTrigger(new Date()))
      .catch((err) => console.error(err));
  }
  return (
    <div>
      <main className="p-6 max-w-4xl mx-auto">
        <h2 className="text-xl mb-4">Orders</h2>
        <div className="space-y-2">
          {orders.map((o) => (
            <div key={o.id} className="border p-3 rounded">
              <div className="flex justify-between">
                <div>Order: {o.id}</div>
                <div>{o.status}</div>
              </div>
              <div className="mt-2">Total: ₹{o.total}</div>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => updateStatus(o.id, "shipped")}
                  className="px-2 py-1 border rounded"
                >
                  Mark Shipped
                </button>
                <button
                  onClick={() => updateStatus(o.id, "delivered")}
                  className="px-2 py-1 border rounded"
                >
                  Mark Delivered
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
