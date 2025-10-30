import { isAdmin, verifyToken } from "@/lib/auth";
import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const auth = req.headers.get("Authorization");
  if (!auth) return NextResponse.json({ message: "No token" }, { status: 401 });

  const token = auth.split(" ")[1];
  const decoded = verifyToken(token);
  if (!isAdmin(decoded))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  try {
    const res = await pool.query(`SELECT * FROM users`);
    return NextResponse.json(res.rows);
  } catch (err) {
    console.error("Error", err);
    return NextResponse.json({ error: "Get users Failed" }, { status: 500 });
  }
}
