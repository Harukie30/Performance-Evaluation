import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { z } from "zod";
import { readJsonFile, writeJsonFile } from "@/lib/utils";
import { db } from "@/lib/db";
import usersData from '@/data/users.json';

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
  ForRegular?: string;
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
  ForRegular: z.enum(["Q1 2023", "Q2 2023", "Q3 2023", "Q4 2023", "Q1 2024", "Q2 2024"]).optional(),
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

    // Transform the data to match the dashboard's expected format
    const transformedReviews = reviews.map(review => {
      // Find the employee in usersData
      const employee = usersData.find(emp => emp.employeeId === review.employeeId);
      
      return {
        id: review.id,
        employeeId: review.employeeId,
        employeeName: employee ? employee.name : 'Unknown Employee',
        department: review.department,
        ForRegular: review.ForRegular || 'Not Set',
        status: review.status.toLowerCase(),
        lastModified: review.submittedAt || review.updatedAt || review.createdAt
      };
    });

    return NextResponse.json(transformedReviews);
  } catch (error) {
    console.error("Error fetching performance reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch performance reviews" },
      { status: 500 }
    );
  }
}

// POST /api/performance-review
export async function POST(request: NextRequest) {
  try {
    const review = await request.json();
    console.log("Received review data:", review);

    const createdReview = await db.performanceReviews.create(review);
    console.log("Created review:", createdReview);

    return NextResponse.json(createdReview);
  } catch (error) {
    console.error("Error creating performance review:", error);
    return NextResponse.json(
      { error: "Failed to create performance review" },
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