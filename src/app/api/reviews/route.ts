import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { readReviewsData, writeReviewsData, Review } from "../../../lib/data";
import { reviewSchema } from "../../../lib/schemas";

// PUT /api/reviews/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const validatedData = reviewSchema.parse(data);

    // Read existing reviews
    const reviews = readReviewsData();
    const reviewIndex = reviews.findIndex((r: Review) => r.id === params.id);

    if (reviewIndex === -1) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    // Update the review
    const updatedReview: Review = {
      ...reviews[reviewIndex],
      ...validatedData,
      lastModified: new Date().toISOString(),
      // Automatically mark as completed if final result is submitted
      status: validatedData.finalResult ? "completed" : reviews[reviewIndex].status
    };

    reviews[reviewIndex] = updatedReview;
    writeReviewsData(reviews);

    return NextResponse.json(updatedReview);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
} 