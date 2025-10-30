/**
 * POST -> { cart_id, product_id, quantity }  (add or increment)
 * PUT  -> { item_id, quantity } (update quantity)
 * DELETE -> ?item_id=... OR ?cart_id=...&product_id=...
 */

import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

async function fetchProduct(productId) {
  const r = await pool.query("SELECT id, stock, price, name FROM products WHERE id=$1", [productId]);
  return r.rows[0] || null;
}

export async function POST(req) {
    const body = await req.json();
    const {cart_id,product_id,quantity=1} = body || {};
    if (!cart_id || !product_id) return NextResponse.json({ error: "cart_id & product_id required" }, { status: 400 });

      const product = await fetchProduct(product_id);
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  if (product.stock < quantity) return NextResponse.json({ error: "Not enough stock" }, { status: 400 });

    // check cart exists
  const cartRes = await pool.query("SELECT * FROM carts WHERE id=$1", [cart_id]);
  if (!cartRes.rows.length) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

    // check if item exists -> increment
  const existing = await pool.query("SELECT * FROM cart_items WHERE cart_id=$1 AND product_id=$2", [cart_id, product_id]);
  if (existing.rows.length) {
    const newQty = Math.min(product.stock, existing.rows[0].quantity + quantity);
    const updated = await pool.query("UPDATE cart_items SET quantity=$1, updated_at=NOW() WHERE id=$2 RETURNING *", [newQty, existing.rows[0].id]);
    return NextResponse.json({ item: updated.rows[0] });
  } else {
    const insert = await pool.query(
      "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1,$2,$3) RETURNING *",
      [cart_id, product_id, quantity]
    );
    return NextResponse.json({ item: insert.rows[0] });
  }
}


export async function PUT(req) {
  const body = await req.json();
  const { item_id, quantity } = body || {};
  if (!item_id || typeof quantity !== "number") return NextResponse.json({ error: "item_id & quantity required" }, { status: 400 });

  if (quantity <= 0) {
    await pool.query("DELETE FROM cart_items WHERE id=$1", [item_id]);
    return NextResponse.json({ message: "Deleted" });
  }

  // fetch product via join to check stock
  const q = `
    SELECT ci.*, p.stock FROM cart_items ci
    JOIN products p ON p.id = ci.product_id
    WHERE ci.id=$1
  `;
  const r = await pool.query(q, [item_id]);
  if (!r.rows.length) return NextResponse.json({ error: "Item not found" }, { status: 404 });

  const row = r.rows[0];
  if (row.stock < quantity) return NextResponse.json({ error: "Not enough stock" }, { status: 400 });

  const upd = await pool.query("UPDATE cart_items SET quantity=$1, updated_at=NOW() WHERE id=$2 RETURNING *", [quantity, item_id]);
  return NextResponse.json({ item: upd.rows[0] });
}

export async function DELETE(req) {
  const url = new URL(req.url);
  const item_id = url.searchParams.get("item_id");
  const cart_id = url.searchParams.get("cart_id");
  const product_id = url.searchParams.get("product_id");

  if (item_id) {
    await pool.query("DELETE FROM cart_items WHERE id=$1", [item_id]);
    return NextResponse.json({ message: "Deleted" });
  }

  if (cart_id && product_id) {
    await pool.query("DELETE FROM cart_items WHERE cart_id=$1 AND product_id=$2", [cart_id, product_id]);
    return NextResponse.json({ message: "Deleted" });
  }

  return NextResponse.json({ error: "item_id or (cart_id & product_id) required" }, { status: 400 });
}