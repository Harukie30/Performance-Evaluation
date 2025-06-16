import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { z } from "zod";
import { readJsonFile, writeJsonFile } from "@/lib/utils";
import { db } from "@/lib/db";

// Path to JSON data file
const DATA_FILE_PATH = path.join(process.cwd(), 'src/data/users.json');

// Define types for our data structure
interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  performance_reviews?: Review[];
  status: string;
}

interface Review {
  id: string;
  employeeId: string | number;
  department: string;
  position: string;
  status: "Pending" | "In Progress" | "Completed" | "Pending HR Review" | "Rejected";
  createdAt: string;
  updatedAt?: string;
  submittedAt?: string;
  finalScore?: number;
  finalRating?: string;
  finalPercentage?: number;
  comments?: string;
  hrComments?: string;
  areasForImprovement?: string;
  additionalComments?: string;
}

interface AuthUser {
  id: number;
  email: string;
  password: string;
  role: "HR" | "Evaluator";
}

interface DataFile {
  employees: Employee[];
  users: AuthUser[];
}

// Schema for review validation
const reviewSchema = z.object({
  employeeId: z.string(),
  position: z.string(),
  department: z.string(),
  reviewType: z.string(),
  dateHired: z.string().optional(),
  immediateSupervisor: z.string().optional(),
  performanceCoverage: z.string().optional(),
  status: z.string(),
  submittedAt: z.string(),
  // Add other fields as needed
});

// GET /api/performance-review
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const employeeId = searchParams.get("employeeId");
    const status = searchParams.get("status");

    const reviews = await db.performanceReviews.findMany(
      employeeId || status ? {
        employeeId: employeeId || undefined,
        status: status || undefined,
      } : undefined
    );

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST /api/performance-review
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("Received review data:", data);

    // Validate the data
    try {
      reviewSchema.parse(data);
    } catch (validationError) {
      console.error("Validation error:", validationError);
      return NextResponse.json(
        { error: "Invalid review data", details: validationError },
        { status: 400 }
      );
    }

    // Create the performance review
    const review = await db.performanceReviews.create({
      ...data,
      status: "completed",
      submittedAt: new Date().toISOString()
    });
    console.log("Created review:", review);

    // Update the employee's status in the database
    try {
      const database = await readJsonFile<{ employees: Employee[] }>(DATA_FILE_PATH);
      const employeeIndex = database.employees.findIndex((emp: Employee) => emp.id === data.employeeId);
      
      if (employeeIndex !== -1) {
        database.employees[employeeIndex].status = "Evaluated";
        await writeJsonFile(DATA_FILE_PATH, database);
        console.log("Updated employee status in database");
      } else {
        console.warn("Employee not found in database:", data.employeeId);
      }
    } catch (dbError) {
      console.error("Error updating employee status:", dbError);
      // Don't fail the request if employee status update fails
    }

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { 
        error: "Failed to create review",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// PUT /api/performance-review/[id]
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    const data = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }

    const review = await db.performanceReviews.update(id, data);
    return NextResponse.json(review);
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

// DELETE /api/performance-review/[id]
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }

    await db.performanceReviews.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}