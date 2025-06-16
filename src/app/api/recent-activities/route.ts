import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/recent-activities
export async function GET() {
  try {
    const activities = await db.recentActivities.findMany();
    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent activities" },
      { status: 500 }
    );
  }
}

// POST /api/recent-activities
export async function POST(request: NextRequest) {
  try {
    const activity = await request.json();
    console.log("Received activity data:", activity);

    const createdActivity = await db.recentActivities.create(activity);
    console.log("Created activity:", createdActivity);

    return NextResponse.json(createdActivity);
  } catch (error) {
    console.error("Error creating recent activity:", error);
    return NextResponse.json(
      { error: "Failed to create recent activity" },
      { status: 500 }
    );
  }
} 