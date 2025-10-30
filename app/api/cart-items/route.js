import { getUserFromReq } from "@/lib/cartHelpers";
import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const user = getUserFromReq(req);

  if (!user) return NextResponse.json({ error: "No Token" }, { status: 400 });

  try {
    const { searchParams } = new URL(req.url);
    const cart_id = searchParams.get("cart_id");

    if (!cart_id)
      return NextResponse.json({ error: "cart details is " }, { status: 400 });
    const res = await pool.query(
      "SELECT COUNT(*) from cart_items WHERE cart_id= $1",
      [cart_id]
    );
    return NextResponse.json({ count: res?.rows[0]?.count });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error getting cart details" },
      { status: 400 }
    );
  }
}
