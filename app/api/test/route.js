import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const res = await pool.query("SELECT NOW()");
  return NextResponse.json({ time: res.rows[0].now });
}

