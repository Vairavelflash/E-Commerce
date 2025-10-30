import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";


export async function GET(req) {
    const auth = req.headers.get("authorization");
    if(!auth) return NextResponse.json({erro:"No token"},{status:401});

    const token = auth.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({error:"Invalid token"},{status:401})
        
    return NextResponse.json({message:"Protected data",user:decoded})
    
    

    
}