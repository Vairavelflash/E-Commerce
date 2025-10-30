import { getUserFromReq } from "@/lib/cartHelpers";
import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * POST -> create or return existing active cart for logged-in user or create anonymous cart
 * GET -> optionally pass ?cartId=... to fetch cart basic info
 */

export async function POST(req) {
  const user = getUserFromReq(req);
  if (user) {
    // check if user already has a cart (simple: latest cart)
    const res = await pool.query(
      "SELECT * FROM carts WHERE user_id=$1 ORDER BY created_at DESC LIMIT 1",
      [user.id]
    );
    if (res.rows.length) return NextResponse.json({ cart: res.rows[0] });
    // create
    const create = await pool.query(
      "INSERT INTO carts (user_id) VALUES ($1) RETURNING *",
      [user.id]
    );
    return NextResponse.json({ cart: create.rows[0] });
  } else {
    // create anonymous cart
    const create = await pool.query(
      "INSERT INTO carts (user_id) VALUES (NULL) RETURNING *"
    );
    return NextResponse.json({ cart: create.rows[0] });
  }
}

export async function GET(req) {
  const user = getUserFromReq(req);

  if (!user) return NextResponse.json({ error: "No Token" }, { status: 400 });
try{
  const res = await pool.query('SELECT * FROM carts WHERE user_id = $1',[user?.id])

  if (!res.rows.length)
    return NextResponse.json({ error: "Cart not found" }, { status: 404 });
  return NextResponse.json({ cart: res.rows[0] });
  } catch(err){
     console.error(err);
    return NextResponse.json(
      { error: "Error getting cart details" },
      { status: 400 }
    );
  }
}


