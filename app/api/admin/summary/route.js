import { isAdmin, verifyToken } from "@/lib/auth";
import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "No token" }, { status: 401 });
  const token = auth.split(" ")[1];
  const decoded = verifyToken(token);
  if (!isAdmin(decoded))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const [users, products, orders, sales] = await Promise.all([
      pool.query("SELECT count(*) FROM users"),
      pool.query("SELECT COUNT(*) from products"),
      pool.query("SELECT COUNT(*) FROM orders"),
      pool.query("SELECT COALESCE(SUM(total),0) FROM orders"),
    ]);

    return NextResponse.json({
      total_users: users.rows[0].count,
      total_products: products.rows[0].count,
      total_orders: orders.rows[0].count,
      total_sales: sales.rows[0].coalesce,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Summary failed" }, { status: 500 });
  }
}
