import { isAdmin, verifyToken } from "@/lib/auth";
import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  let query = "SELECT * FROM products";
  const values = [];

  if (category) {
    query += " WHERE category_id=$1";
    values.push(category);
  }
  const result = await pool.query(query + " ORDER BY created_at DESC", values);
  return NextResponse.json(result.rows);
}

export async function POST(req) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "No token" }, { status: 401 });

  const token = auth.split(" ")[1];
  const decoded = verifyToken(token);
  if (!isAdmin(decoded))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const { name, description, price, stock, category_id, image_url } =
      await req.json();
    if (!name || !price)
      return NextResponse.json(
        { error: "Name & price required" },
        { status: 400 }
      );

    const result = await pool.query(
      `INSERT INTO products (name, description, price, stock, category_id, image_url)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [name, description, price, stock || 0, category_id, image_url]
    );

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
