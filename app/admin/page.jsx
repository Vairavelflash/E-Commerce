"use client";
import Header from "@/components/Header";
import { api, APICall } from "@/lib/api";
import { useStore } from "@/store/useStore";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const { token, user } = useStore();

  const [summary, setSummary] = useState(null);
  const [stock, setStock] = useState(null);
  const [sales, setSales] = useState(null);
  useEffect(() => {
    if (token) {
      APICall.get("/admin/summary")
        .then((res) => setSummary(res.data))
        .catch((err) => console.error("Unauthorized or server error", err));

      APICall.get("/admin/stock-alerts")
        .then((res) => setStock(res?.data))
        .catch((err) => console.error("Unauthorized or server error", err));

      APICall.get("/admin/sales")
        .then((res) => setSales(res?.data))
        .catch((err) => console.error("Unauthorized or server error", err));
    }
  }, [token]);
  // console.log("first", stock, summary, sales);
  return (
    <div>
      <main className="p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
        {summary ? (
          <div className="grid grid-cols-4 gap-4">
            <div className="p-3 border rounded">
              Users
              <br />
              <strong>{summary.total_users}</strong>
            </div>
            <div className="p-3 border rounded">
              Products
              <br />
              <strong>{summary.total_products}</strong>
            </div>
            <div className="p-3 border rounded">
              Orders
              <br />
              <strong>{summary.total_orders}</strong>
            </div>
            <div className="p-3 border rounded">
              Sales
              <br />
              <strong>₹{summary.total_sales}</strong>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}

        <h2 className="text-md font-medium mb-4">Stock Details</h2>
        {stock && stock?.length > 0 ? (
          stock.map((i, index) => (
            <div className="grid grid-cols-4 gap-4" key={index}>
              <div className="p-3 border rounded">
                Name
                <br />
                <strong>{i?.name}</strong>
              </div>
              <div className="p-3 border rounded">
                Stock
                <br />
                <strong>{i?.stock}</strong>
              </div>
            </div>
          ))
        ) : (
          <div>Loading...</div>
        )}

        <h2 className="text-md font-medium mb-4">Sales Details</h2>
        {sales && sales.length > 0 ? (
          sales.map((s, i) => (
            <div className="grid grid-cols-4 gap-4" key={i}>
              <div className="p-3 border rounded">
                Total Sales
                <br />
                <strong>{s?.total_sales}</strong>
              </div>
              <div className="p-3 border rounded">
                Total Orders
                <br />
                <strong>{s?.orders_count}</strong>
              </div>
            </div>
          ))
        ) : (
          <div>Loading...</div>
        )}
      </main>
    </div>
  );
}
