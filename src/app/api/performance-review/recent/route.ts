import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const reviews = await db.performanceReviews.findMany();
    // Sort by submission date and get the 5 most recent reviews
    const recentReviews = reviews
      .sort((a, b) => new Date(b.submittedAt || b.createdAt).getTime() - new Date(a.submittedAt || a.createdAt).getTime())
      .slice(0, 5);
    return NextResponse.json(recentReviews);
  } catch (error) {
    console.error("Error fetching recent reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent reviews" },
      { status: 500 }
    );
  }
} 