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
    const data = await request.json();
    
    // Create the recent activity
    const activity = await db.recentActivities.create({
      type: data.type,
      description: data.description,
      timestamp: data.timestamp,
      employeeName: data.employeeName,
      employeeId: data.employeeId
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error("Error creating recent activity:", error);
    return NextResponse.json(
      { error: "Failed to create recent activity" },
      { status: 500 }
    );
  }
} 