import { isAdmin, verifyToken } from "@/lib/auth";
import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await pool.query(
    "SELECT * FROM categories ORDER BY created_at DESC"
  );
  return NextResponse.json(result.rows);
}

export async function POST(req) {
  const auth = req.headers.get("Authorization");
  if (!auth) return NextResponse.json({ error: "No token" }, { status: 401 });

  const token = auth.split(" ")[1];
  const decoded = verifyToken(token);
  if (!isAdmin(decoded)){
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { name, description } = await req.json();
    if (!name)
      return Response.json({ error: "Name required" }, { status: 400 });

    const result = await pool.query(
      "INSERT INTO categories (name,description) VALUES ($1,$2) RETURNING *",
      [name, description]
    );

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Create Failed" }, { status: 500 });
  }
}
