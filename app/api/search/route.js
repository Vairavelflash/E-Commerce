import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    const {searchParams} = new URL(req.url);
    const q = searchParams.get("q")?.trim();

    if(!q) return NextResponse.json({error:"Missing ?q="},{status:400});
  try {
    // Use ILIKE for case-insensitive partial match
    const result = await pool.query(
        "SELECT id,name,price,image_url FROM products WHERE name ILIKE $1 or description ILIKE $1 ORDER BY created_at DESC LIMIT 20",[`%${q}%`]
    );
    return NextResponse.json(result?.rows)
  } catch (err) {
    console.error("Search Failed", err);
    return NextResponse.json({ error: "Search Failed" }, { status: 500 });
  }
}
