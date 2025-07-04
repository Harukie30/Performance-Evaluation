import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    console.log("Login attempt:", { email, password: password ? "[REDACTED]" : "undefined" });

    if (!email || !password) {
      console.log("Missing email or password");
      return new NextResponse(
        JSON.stringify({ 
          error: "Email and password are required",
          details: { email: !!email, password: !!password }
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log("Attempting to authenticate user...");
    const user = await auth.login(email, password);
    console.log("Authentication successful:", { id: user.id, email: user.email, role: user.role });

    // Create a session token (in a real app, this would be a JWT)
    const token = Buffer.from(JSON.stringify({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      department: user.department,
      permissions: user.permissions
    })).toString('base64');

    // Set the token in a cookie
    const response = NextResponse.json({ user });
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 86400, // 24 hours
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    });

    console.log("Login successful, token set in cookie");
    return response;
  } catch (error: any) {
    console.error("Login error:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return new NextResponse(
      JSON.stringify({ 
        error: "Invalid email or password",
        details: error.message || "Authentication failed"
      }),
      { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 