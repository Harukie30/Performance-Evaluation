import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { z } from "zod";
import { readJsonFile, writeJsonFile } from "@/lib/utils";

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
}

interface Review {
  id: string;
  employeeId: number;
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
  employeeId: z.union([z.string(), z.number()]),
  position: z.string(),
  department: z.string(),
  reviewType: z.string().optional(),
  dateHired: z.date().optional(),
  immediateSupervisor: z.string().optional(),
  performanceCoverage: z.string().optional(),
  
  jobKnowledge: z.number().optional(),
  qualityOfWork: z.number().optional(),
  promptnessOfWork: z.number().optional(),
  qualityMeetsStandards: z.number().optional(),
  qualityTimeliness: z.number().optional(),
  qualityWorkOutputVolume: z.number().optional(),
  qualityConsistency: z.number().optional(),
  qualityJobTargets: z.number().optional(),
  adaptabilityOpenness: z.number().optional(),
  adaptabilityFlexibility: z.number().optional(),
  adaptabilityResilience: z.number().optional(),
  activeParticipationScore: z.number().optional(),
  positiveTeamCultureScore: z.number().optional(),
  effectiveCommunicationScore: z.number().optional(),
  consistentAttendanceScore: z.number().optional(),
  punctualityScore: z.number().optional(),
  followsThroughScore: z.number().optional(),
  reliableHandlingScore: z.number().optional(),
  ethicalFollowsPoliciesScore: z.number().optional(),
  ethicalProfessionalismScore: z.number().optional(),
  ethicalAccountabilityScore: z.number().optional(),
  ethicalRespectScore: z.number().optional(),
  customerListeningScore: z.number().optional(),
  customerProblemSolvingScore: z.number().optional(),
  customerProductKnowledgeScore: z.number().optional(),
  customerProfessionalAttitudeScore: z.number().optional(),
  customerTimelyResolutionScore: z.number().optional(),

  jobKnowledgeComments: z.string().optional(),
  promptnessofworkComments: z.string().optional(),
  qualityofworkComments: z.string().optional(),
  qualityMeetsStandardsComments: z.string().optional(),
  qualityTimelinessComments: z.string().optional(),
  qualityWorkOutputVolumeComments: z.string().optional(),
  qualityConsistencyComments: z.string().optional(),
  qualityJobTargetsComments: z.string().optional(),
  adaptabilityOpennessComments: z.string().optional(),
  adaptabilityFlexibilityComments: z.string().optional(),
  adaptabilityResilienceComments: z.string().optional(),
  activeParticipationExplanation: z.string().optional(),
  positiveTeamCultureExplanation: z.string().optional(),
  effectiveCommunicationExplanation: z.string().optional(),
  consistentAttendanceExplanation: z.string().optional(),
  punctualityExplanation: z.string().optional(),
  followsThroughExplanation: z.string().optional(),
  reliableHandlingExplanation: z.string().optional(),
  ethicalFollowsPoliciesExplanation: z.string().optional(),
  ethicalProfessionalismExplanation: z.string().optional(),
  ethicalAccountabilityExplanation: z.string().optional(),
  ethicalRespectExplanation: z.string().optional(),
  customerListeningExplanation: z.string().optional(),
  customerProblemSolvingExplanation: z.string().optional(),
  customerProductKnowledgeExplanation: z.string().optional(),
  customerProfessionalAttitudeExplanation: z.string().optional(),
  customerTimelyResolutionExplanation: z.string().optional(),

  finalScore: z.number().optional(),
  finalRating: z.string().optional(),
  finalPercentage: z.number().optional(),
  areasForImprovement: z.string().optional(),
  additionalComments: z.string().optional(),

  status: z.enum(["Pending", "In Progress", "Completed", "Pending HR Review", "Rejected"]).default("Pending HR Review"),
  submittedAt: z.string().optional(),
  comments: z.string().optional(),
  hrComments: z.string().optional(),
});

// GET /api/performance-review
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const employeeId = searchParams.get("employeeId");
    const status = searchParams.get("status");

    const data = await readJsonFile<DataFile>(DATA_FILE_PATH);
    const employees = data.employees || [];

    // Get all reviews from all employees
    let reviews = employees.flatMap((employee: Employee) => {
      const employeeReviews = employee.performance_reviews || [];
      return employeeReviews.map((review: Review) => ({
        ...review,
        employee: {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          department: employee.department,
          position: employee.position,
        },
      }));
    });

    // Apply filters
    if (employeeId) {
      reviews = reviews.filter((review: Review) => review.employeeId === Number(employeeId));
    }
    if (status) {
      reviews = reviews.filter((review: Review) => review.status === status);
    }

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
    const body = await request.json();
      const validatedData = reviewSchema.parse(body);

    const data = await readJsonFile<DataFile>(DATA_FILE_PATH);
    const employees = data.employees || [];

    // Find the employee
    const employeeIndex = employees.findIndex(
      (emp: Employee) => emp.id === validatedData.employeeId
    );

    if (employeeIndex === -1) {
        return NextResponse.json(
        { error: "Employee not found" },
          { status: 404 }
        );
      }

      // Create new review
      const newReview: Review = {
        id: Date.now().toString(),
      ...validatedData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    // Add review to employee's performance_reviews array
    if (!employees[employeeIndex].performance_reviews) {
      employees[employeeIndex].performance_reviews = [];
    }
    employees[employeeIndex].performance_reviews.push(newReview);

    // Save updated data
    await writeJsonFile(DATA_FILE_PATH, { ...data, employees });

    return NextResponse.json(newReview);
  } catch (error) {
    console.error("Error creating review:", error);
    if (error instanceof z.ZodError) {
        return NextResponse.json(
        { error: "Invalid review data", details: error.errors },
          { status: 400 }
        );
      }
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

// PUT /api/performance-review
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("id");

    if (!reviewId) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = reviewSchema.partial().parse(body);

    const data = await readJsonFile<DataFile>(DATA_FILE_PATH);
    const employees = data.employees || [];
    
    // Find the employee and review
    let reviewFound = false;
    for (const employee of employees) {
      if (!employee.performance_reviews) continue;
      
      const reviewIndex = employee.performance_reviews.findIndex(
        (review: Review) => review.id === reviewId
      );

      if (reviewIndex !== -1) {
        // Update review
        employee.performance_reviews[reviewIndex] = {
          ...employee.performance_reviews[reviewIndex],
          ...validatedData,
          updatedAt: new Date().toISOString(),
        };
        reviewFound = true;
        break;
      }
    }

    if (!reviewFound) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    // Save updated data
    await writeJsonFile(DATA_FILE_PATH, { ...data, employees });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating review:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid review data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

// PATCH /api/performance-review
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("id");
    
    if (!reviewId) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, hrComments } = body;

    if (!status || !["Completed", "Rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const data = await readJsonFile<DataFile>(DATA_FILE_PATH);
    const employees = data.employees || [];

    // Find the employee and review
    let reviewFound = false;
    for (const employee of employees) {
      if (!employee.performance_reviews) continue;
      
      const reviewIndex = employee.performance_reviews.findIndex(
        (review: Review) => review.id === reviewId
      );

      if (reviewIndex !== -1) {
        // Update review status and HR comments
        employee.performance_reviews[reviewIndex] = {
          ...employee.performance_reviews[reviewIndex],
          status,
          hrComments: hrComments || "",
          updatedAt: new Date().toISOString(),
        };
        reviewFound = true;
        break;
      }
    }

    if (!reviewFound) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    // Save updated data
    await writeJsonFile(DATA_FILE_PATH, { ...data, employees });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating review status:", error);
    return NextResponse.json(
      { error: "Failed to update review status" },
      { status: 500 }
    );
  }
}

// DELETE /api/performance-review
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }

    // Read current data
    const usersData = await readJsonFile<DataFile>(DATA_FILE_PATH);
    
    // Find and remove the review
    let reviewFound = false;
    for (const employee of usersData.employees) {
      if (employee.performance_reviews) {
        const reviewIndex = employee.performance_reviews.findIndex(r => r.id === id);
        if (reviewIndex !== -1) {
          employee.performance_reviews.splice(reviewIndex, 1);
          reviewFound = true;
          break;
        }
      }
    }

    if (!reviewFound) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    // Write updated data back to file
    await writeJsonFile(DATA_FILE_PATH, usersData);

    return NextResponse.json({
      message: "Performance review deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}