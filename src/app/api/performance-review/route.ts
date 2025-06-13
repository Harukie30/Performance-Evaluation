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

    const reviews = await db.performanceReviews.findMany({
      employeeId: employeeId || undefined,
      status: status || undefined,
    });

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
    const review = await db.performanceReviews.create(data);
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
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