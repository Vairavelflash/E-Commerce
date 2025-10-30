// /app/api/cart/db/[cartId]/route.js
import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * GET -> return cart items with product details and totals
 * DELETE -> delete cart and items
 */

export async function GET(req, { params }) {
  const { cartId } =await params;
  // fetch cart
  const cartRes = await pool.query("SELECT * FROM carts WHERE id=$1", [cartId]);
  if (!cartRes.rows.length) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

  const itemsRes = await pool.query(
    `SELECT ci.id AS item_id, ci.quantity, p.id AS product_id, p.name, p.price, p.stock, p.image_url
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.cart_id = $1`,
    [cartId]
  );

  // compute totals
  const items = itemsRes.rows.map(r => {
    return {
      item_id: r.item_id,
      product_id: r.product_id,
      name: r.name,
      price: Number(r.price),
      quantity: r.quantity,
      subtotal: Number(r.price) * r.quantity,
      stock: r.stock,
      image_url: r.image_url
    };
  });

  const total = items.reduce((s, it) => s + it.subtotal, 0);
  return NextResponse.json({ cart: cartRes.rows[0], items, total });
}

export async function DELETE(req, { params }) {
  const { cartId } = params;
  await pool.query("DELETE FROM cart_items WHERE cart_id=$1", [cartId]);
  await pool.query("DELETE FROM carts WHERE id=$1", [cartId]);
  return NextResponse.json({ message: "Cart deleted" });
}
