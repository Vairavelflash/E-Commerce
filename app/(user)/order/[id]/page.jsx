"use client";
import Header from "@/components/Header";
import { api, APICall } from "@/lib/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    APICall.get("/orders/" + id)
      .then((r) => setOrder(r.data.order ? r.data : r.data))
      .catch(console.error);
  }, [id]);

  if (!order)
    return (
      <div>
        <main className="p-6">Loading...</main>
      </div>
    );

  return (
    <div>
      <main className="max-w-3xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">Order {id}</h2>
        <div>Status: {order.order?.status || order.status}</div>
        <div className="mt-4">
          {(order.items || []).map((it) => (
            <div key={it.id} className="flex justify-between border-b py-2">
              <div>{it.name || it.product_id}</div>
              <div>
                {it.quantity} × ₹{it.price}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
