import { isAdmin, verifyToken } from "@/lib/auth";
import { getUserFromReq } from "@/lib/cartHelpers";
import { pool } from "@/lib/db";
import { createOrderFromCart, createOrderFromSessionCart } from "@/lib/order";
import { NextResponse } from "next/server";

/**
 * POST -> create order
 *   Accepts body:
 *    - { cart_id }                        -> create from DB cart (recommended if you use DB cart)
 *    - OR { use_session_cart: true }       -> will read cookie 'session_cart' and create order from it
 *   Requires JWT for user (optional) - userId optional, but recommended
 *
 * GET -> list orders
 *   - If admin (Authorization header + role=admin) returns all orders (paginated optional)
 *   - If normal user returns orders where user_id = current user
 */
export async function POST(req) {
  try {
    const user = getUserFromReq(req); // may be null
    let body = {};
    try {
      body = await req.json();
    } catch (e) {
      body = {};
    }
    // If client provides cart_id -> expect DB-backed cart
    if (body.cart_id) {
      const cartId = body.cart_id;
      // fetch cart and ensure owner if user present
      const cartRes = await pool.query("SELECT * FROM carts WHERE id=$1", [
        cartId,
      ]);

      if (!cartRes.rows.length) {
        return Response.json({ error: "Cart not found" }, { status: 404 });
      }

      const cart = cartRes.rows[0];
      if (cart.user_id && user && cart.user_id !== user.id) {
        return Response.json(
          { error: "Cart does not belong to user" },
          { status: 403 }
        );
      }
      // If cart has user_id null and user exists, we could attach the cart to user — optional

      const result = await createOrderFromCart(cartId, user ? user.id : null);
      return Response.json({
        success: true,
        order: result.order,
        items: result.items,
        total: result.total,
      });
    }

    // Else, create from session cookie cart
    if (body.use_session_cart) {
      const cookies = parseCookies(req);
      let sessionCart;
      try {
        sessionCart = JSON.parse(cookies["session_cart"] || "[]");
      } catch (e) {
        sessionCart = [];
      }
      if (!sessionCart || sessionCart.length === 0)
        return Response.json({ error: "Cart empty" }, { status: 400 });

      // sessionCart items are expected { product_id, quantity }
      const normalized = sessionCart.map((i) => ({
        product_id: i.product_id,
        quantity: Number(i.quantity) || 1,
      }));
      const result = await createOrderFromSessionCart(
        normalized,
        user ? user.id : null
      );

      // Clear session cookie by returning Set-Cookie with empty cart
      const setCookie = `session_cart=${encodeURIComponent(
        JSON.stringify([])
      )}; Path=/; Max-Age=0`;
      return new Response(
        JSON.stringify({
          success: true,
          order: result.order,
          items: result.items,
          total: result.total,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": setCookie,
          },
        }
      );
    }

    return Response.json(
      { error: "Provide cart_id or use_session_cart: true" },
      { status: 400 }
    );
  } catch (err) {
    console.error(err);
    // handle our sentinel errors
    if (err.message && err.message.startsWith("OUT_OF_STOCK")) {
      return Response.json({ error: err.message }, { status: 400 });
    }
    if (err.message === "CART_EMPTY") {
      return Response.json({ error: "Cart empty" }, { status: 400 });
    }
    return Response.json({ error: "Order creation failed" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const auth = req.headers.get("Authorization");
    if (!auth) {
      return NextResponse.json(
        { error: "Authorization required" },
        { status: 401 }
      );
    }

    const token = auth.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    }

    if (isAdmin(decoded)) {
      // list all orders
      const res = await pool.query(
        "SELECT * FROM orders ORDER BY created_at DESC LIMIT 200"
      );
      return NextResponse.json({ orders: res.rows });
    } else {
      // list user;s orders
      const res = await pool.query(
        "SELECT * FROM orders WHERE user_id= $1 ORDER BY created_at DESC",
        [decoded?.id]
      );
      return NextResponse.json({ orders: res.rows });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
