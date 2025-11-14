import { isAdmin, verifyToken } from "@/lib/auth";
import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } =  await params;
  const result = await pool.query("SELECT * FROM categories WHERE id=$1", [id]);
  if (!result.rows.length) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  return NextResponse.json(result.rows);
}

export async function PUT(req, { params }) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "No token" }, { status: 401 });

  const token = auth.split(" ")[1];
  const decoded = verifyToken(token);
  if (!isAdmin(decoded)){
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const { name, description } = await req.json();
    const result = await pool.query(
      "UPDATE categories SET name=$1, description=$2, updated_at=NOW() WHERE ID=$3 RETURNING *",
      [name, description, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Update failed" }, { status: 500 });
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
    const { id } =await params;
    await pool.query("DELETE FROM categories WHERE id=$1", [id]);
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
