import { isAdmin, verifyToken } from "@/lib/auth";
import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const auth = req.headers.get("Authorization");
  if (!auth) return NextResponse.json({ error: "No token" }, { status: 401 });
  const token = auth.split(" ")[1];
  const decoded = verifyToken(token);
  if (!isAdmin(decoded))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  try {
    const result = await pool.query(`
        SELECT DATE(created_at) AS day, SUM(total) AS total_sales, COUNT(*) AS orders_Count
        FROM orders WHERE created_at >= NOW() - INTERVAL '7days'
         GROUP BY day
      ORDER BY day DESC;
    `);
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Sales report failed" }, { status: 500 });
  }
}
