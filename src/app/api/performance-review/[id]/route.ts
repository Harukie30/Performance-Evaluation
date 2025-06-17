import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import usersData from '@/data/users.json';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching review with ID:', params.id);
    const review = await db.performanceReviews.findById(params.id);
    console.log('Found review:', review);
    
    // Find employee information
    const employee = usersData.find(emp => emp.employeeId === review.employeeId);
    console.log('Found employee:', employee);

    // Format the scores into categories
    const scores = [
      {
        category: "Job Knowledge",
        score: review.jobKnowledge || 0,
        weight: 15,
        comments: review.jobKnowledgeComments || ''
      },
      {
        category: "Quality of Work",
        score: review.qualityOfWork || 0,
        weight: 15,
        comments: review.qualityofworkComments || ''
      },
      {
        category: "Promptness of Work",
        score: review.promptnessOfWork || 0,
        weight: 10,
        comments: review.promptnessofworkComments || ''
      },
      {
        category: "Quality Standards",
        score: review.qualityMeetsStandards || 0,
        weight: 10,
        comments: review.qualityMeetsStandardsComments || ''
      },
      {
        category: "Timeliness",
        score: review.qualityTimeliness || 0,
        weight: 10,
        comments: review.qualityTimelinessComments || ''
      },
      {
        category: "Work Output",
        score: review.qualityWorkOutputVolume || 0,
        weight: 10,
        comments: review.qualityWorkOutputVolumeComments || ''
      },
      {
        category: "Consistency",
        score: review.qualityConsistency || 0,
        weight: 10,
        comments: review.qualityConsistencyComments || ''
      },
      {
        category: "Job Targets",
        score: review.qualityJobTargets || 0,
        weight: 10,
        comments: review.qualityJobTargetsComments || ''
      },
      {
        category: "Adaptability",
        score: review.adaptabilityOpenness && review.adaptabilityFlexibility && review.adaptabilityResilience 
          ? (review.adaptabilityOpenness + review.adaptabilityFlexibility + review.adaptabilityResilience) / 3 
          : 0,
        weight: 10,
        comments: [
          review.adaptabilityOpennessComments,
          review.adaptabilityFlexibilityComments,
          review.adaptabilityResilienceComments
        ].filter(Boolean).join('\n')
      }
    ];

    // Calculate total score
    const totalScore = scores.reduce((acc, curr) => {
      return acc + (curr.score * curr.weight / 100);
    }, 0);

    // Format the response
    const response = {
      employeeId: review.employeeId,
      employeeName: employee ? employee.name : 'Unknown Employee',
      department: review.department,
      ForRegular: review.ForRegular || 'Not Set',
      status: review.status,
      lastModified: review.submittedAt || review.updatedAt || review.createdAt,
      scores: scores,
      totalScore: totalScore,
      comments: review.additionalComments || 'No additional comments provided.'
    };

    console.log('Sending response:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch review" },
      { status: 500 }
    );
  }
} 