/**
 * createOrderFromCart(cartId, userId)
 * - Reads cart_items for cartId
 * - Validates stock for each product
 * - In a DB transaction:
 *    * Inserts into orders
 *    * Inserts order_items
 *    * Decrements product stock
 *    * Deletes cart_items (optional) and cart
 *
 * Returns { orderId, total, items } on success
 * Throws Error with message on failure (e.g., 'OUT_OF_STOCK: productId')
 */

import { pool } from "./db";

export async function createOrderFromCart(cartId, userId = null) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Fetch cart items with product info and FOR UPDATE to lock rows (prevents race)
    const itemsQ = `
      SELECT ci.id as cart_item_id, ci.quantity, p.id as product_id, p.price::numeric, p.stock::int
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.cart_id = $1
      FOR UPDATE
    `;
    const itemsRes = await client.query(itemsQ, [cartId]);

    const items = itemsRes.rows;
    if (items.length === 0) {
      throw new Error("CART_EMPTY");
    }

    // Validate stock
    for (const it of items) {
      if (it.stock < it.quantity) {
        throw new Error(`OUT_OF_STOCK:${it.product_id}`);
      }
    }

    // Calculate total
    let total = items.reduce((s, it) => s + (Number(it.price) * it.quantity), 0);
    total = total.toFixed(2);

    // Insert order
    const orderIns = await client.query(
      `INSERT INTO orders (user_id, total, status) VALUES ($1, $2, 'pending') RETURNING *`,
      [userId, total]
    );
    const order = orderIns.rows[0];

    // Insert order_items and decrement stock
    for (const it of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [order.id, it.product_id, it.quantity, it.price]
      );

      // Decrement stock
      await client.query(
        `UPDATE products SET stock = stock - $1, updated_at = NOW() WHERE id = $2`,
        [it.quantity, it.product_id]
      );
    }

    // clean up: delete cart_items and cart
    await client.query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);
    await client.query("DELETE FROM carts WHERE id = $1", [cartId]);

    await client.query("COMMIT");

    // Return order summary
    const orderItemsQ = `
      SELECT oi.id, oi.product_id, oi.quantity, oi.price
      FROM order_items oi
      WHERE oi.order_id = $1
    `;
    const ordItems = await pool.query(orderItemsQ, [order.id]);

    return {
      order: order,
      items: ordItems.rows,
      total: Number(total)
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}



/**
 * createOrderFromSessionCart(sessionCartArray, userId = null)
 * - sessionCartArray: [{ product_id, quantity }]
 * - Similar logic but we lock product rows via SELECT ... FOR UPDATE and don't require cart rows.
 */
export async function createOrderFromSessionCart(sessionCartArray, userId = null) {
  if (!Array.isArray(sessionCartArray) || sessionCartArray.length === 0) {
    throw new Error("CART_EMPTY");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Build list of product IDs
    const productIds = sessionCartArray.map(i => i.product_id);
    // Fetch products FOR UPDATE
    const placeholders = productIds.map((_, i) => `$${i + 1}`).join(", ");
    const prodQ = `SELECT id, price::numeric, stock::int FROM products WHERE id IN (${placeholders}) FOR UPDATE`;
    const prodRes = await client.query(prodQ, productIds);
    const products = prodRes.rows.reduce((acc, p) => { acc[p.id] = p; return acc; }, {});

    // Validate all items exist and have enough stock
    for (const it of sessionCartArray) {
      const p = products[it.product_id];
      if (!p) throw new Error(`PRODUCT_NOT_FOUND:${it.product_id}`);
      if (p.stock < it.quantity) throw new Error(`OUT_OF_STOCK:${it.product_id}`);
    }

    // Calculate total
    let total = 0;
    for (const it of sessionCartArray) {
      const p = products[it.product_id];
      total += Number(p.price) * it.quantity;
    }
    total = total.toFixed(2);

    // Insert order
    const orderIns = await client.query(
      `INSERT INTO orders (user_id, total, status) VALUES ($1, $2, 'pending') RETURNING *`,
      [userId, total]
    );
    const order = orderIns.rows[0];

    // Insert order items and decrement stocks
    for (const it of sessionCartArray) {
      const p = products[it.product_id];
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)`,
        [order.id, it.product_id, it.quantity, p.price]
      );
      await client.query(
        `UPDATE products SET stock = stock - $1, updated_at = NOW() WHERE id = $2`,
        [it.quantity, it.product_id]
      );
    }

    await client.query("COMMIT");

    const orderItemsQ = `SELECT id, product_id, quantity, price FROM order_items WHERE order_id=$1`;
    const ordItems = await pool.query(orderItemsQ, [order.id]);

    return {
      order: order,
      items: ordItems.rows,
      total: Number(total)
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

/**
 * fetchOrderDetails(orderId, requestingUser)
 * - If requestingUser is admin, allow; otherwise ensure order.user_id === requestingUser.id
 */
export async function fetchOrderDetails(orderId) {
  const orderQ = `SELECT * FROM orders WHERE id=$1`;
  const orderRes = await pool.query(orderQ, [orderId]);
  if (!orderRes.rows.length) return null;
  const order = orderRes.rows[0];

  const itemsQ = `
    SELECT oi.id, oi.product_id, oi.quantity, oi.price, p.name, p.image_url
    FROM order_items oi
    LEFT JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = $1
  `;
  const itemsRes = await pool.query(itemsQ, [orderId]);

  return { order, items: itemsRes.rows };
}