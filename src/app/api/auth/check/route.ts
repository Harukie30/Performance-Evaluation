import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: "Not authenticated" }),
        { status: 401 }
      );
    }

    const user = await verifyAuth(token.value);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Auth check error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
} 