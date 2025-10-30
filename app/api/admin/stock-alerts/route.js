import { pool } from "@/lib/db";
import { verifyToken, isAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "No token" }, { status: 401 });
  const token = auth.split(" ")[1];
  const decoded = verifyToken(token);
  if (!isAdmin(decoded)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const result = await pool.query(`
      SELECT id, name, stock
      FROM products
      WHERE stock < 500
      ORDER BY stock ASC
      LIMIT 10;
    `);
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Stock alert failed" }, { status: 500 });
  }
}
