import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Get all cookies
  const cookies = request.cookies.getAll();
  
  // Get the user cookie specifically
  const userCookie = request.cookies.get("user");
  
  return NextResponse.json({
    allCookies: cookies.map(c => ({ name: c.name, value: c.value })),
    userCookie: userCookie ? {
      name: userCookie.name,
      value: userCookie.value,
      parsed: JSON.parse(userCookie.value)
    } : null,
    headers: Object.fromEntries(request.headers.entries())
  });
} 