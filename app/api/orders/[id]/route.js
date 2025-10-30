import { pool } from "@/lib/db";
import { verifyToken, isAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";
import { fetchOrderDetails } from "@/lib/order";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const auth = req.headers.get("authorization");
    if (!auth) return NextResponse.json({ error: "Authorization required" }, { status: 401 });
    const token = auth.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const data = await fetchOrderDetails(id);
    if (!data) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // allow admin or owner
    if (!isAdmin(decoded) && data.order.user_id !== decoded.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ order: data.order, items: data.items });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  // Admin only: update order status (e.g., pending -> shipped -> delivered -> cancelled)
  try {
    const { id } = params;
    const auth = req.headers.get("authorization");
    if (!auth) return NextResponse.json({ error: "Authorization required" }, { status: 401 });
    const token = auth.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    if (!isAdmin(decoded)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { status } = await req.json();
    if (!status) return NextResponse.json({ error: "status required" }, { status: 400 });

    const updated = await pool.query("UPDATE orders SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *", [status, id]);
    if (!updated.rows.length) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    return NextResponse.json({ order: updated.rows[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  // Allow user to cancel order only if it's still 'pending' (simple rule)
  try {
    const { id } = params;
    const auth = req.headers.get("authorization");
    if (!auth) return NextResponse.json({ error: "Authorization required" }, { status: 401 });
    const token = auth.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // fetch order
    const oRes = await pool.query("SELECT * FROM orders WHERE id=$1", [id]);
    if (!oRes.rows.length) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    const order = oRes.rows[0];

    if (isAdmin(decoded)) {
      // admin may delete any order (be careful)
      await pool.query("DELETE FROM order_items WHERE order_id=$1", [id]);
      await pool.query("DELETE FROM orders WHERE id=$1", [id]);
      return NextResponse.json({ message: "Order deleted by admin" });
    }

    if (order.user_id !== decoded.id) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    if (order.status !== "pending") {
      return NextResponse.json({ error: "Only pending orders can be cancelled" }, { status: 400 });
    }

    // When cancelling, we should restore stock. Use a transaction.
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const itemsRes = await client.query("SELECT product_id, quantity FROM order_items WHERE order_id=$1 FOR UPDATE", [id]);
      for (const it of itemsRes.rows) {
        await client.query("UPDATE products SET stock = stock + $1, updated_at = NOW() WHERE id=$2", [it.quantity, it.product_id]);
      }
      await client.query("DELETE FROM order_items WHERE order_id=$1", [id]);
      await client.query("DELETE FROM orders WHERE id=$1", [id]);
      await client.query("COMMIT");
      return NextResponse.json({ message: "Order cancelled and stock restored" });
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete/cancel order" }, { status: 500 });
  }
}
