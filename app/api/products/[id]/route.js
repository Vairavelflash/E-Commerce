import { isAdmin, verifyToken } from "@/lib/auth";
import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } =await params;
  const result = await pool.query(
    `SELECT p.*, c.name AS category_name
     FROM products p
     LEFT JOIN categories c ON p.category_id=c.id
     WHERE p.id=$1`,
    [id]
  );
  if (!result.rows.length)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(result.rows[0]);
}

export async function PUT(req, { params }) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "No token" }, { status: 401 });

  const token = auth.split(" ")[1];
  const decoded = verifyToken(token);
  if (!isAdmin(decoded))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const { id } =await params;
    const { name, description, price, stock, category_id, image_url } = await req.json();

    const result = await pool.query(
      `UPDATE products
       SET name=$1, description=$2, price=$3, stock=$4, category_id=$5, image_url=$6, updated_at=NOW()
       WHERE id=$7 RETURNING *`,
      [name, description, price, stock, category_id, image_url, id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "No token" }, { status: 401 });

  const token = auth.split(" ")[1];
  const decoded = verifyToken(token);
  if (!isAdmin(decoded))
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const { id } = await params;

    const result = await pool.query("DELETE FROM products WHERE id = $1", [id]);
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
}
