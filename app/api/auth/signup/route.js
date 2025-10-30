import { generatetoken, hashpassword } from "@/lib/auth";
import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // check existing user
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (existing.rows.length) {
      return Response.json({ error: "User already exists" }, { status: 400 });
    }

    // hash password
    const hashed = await hashpassword(password);

    // insert user
    const result = await pool.query(
      "INSERT INTO users(name,email,password,role) VALUES ($1,$2,$3,$4) RETURNING id,name,email,role",
      [name, email, hashed, role]
    );

    const user = result.rows[0];
    const token = generatetoken(user);

    return NextResponse.json({ user, token });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
