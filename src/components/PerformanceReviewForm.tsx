"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { reviewAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const reviewSchema = z.object({
  employeeId: z.string(),
  position: z.string().min(1, "Position is required"),
  department: z.string().min(1, "Department is required"),
  reviewType: z.enum(["quarterly", "annual", "probationary"]),
  dateHired: z.string().min(1, "Date hired is required"),
  immediateSupervisor: z.string().min(1, "Supervisor name is required"),
  performanceCoverage: z.string().min(1, "Performance coverage is required"),
  
  // Job Performance
  jobKnowledge: z.number().min(1).max(5),
  jobKnowledgeComments: z.string(),
  qualityOfWork: z.number().min(1).max(5),
  qualityofworkComments: z.string(),
  promptnessOfWork: z.number().min(1).max(5),
  promptnessofworkComments: z.string(),
  
  // Additional Comments
  additionalComments: z.string().optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface PerformanceReviewFormProps {
  employeeId: string;
  onSuccess?: () => void;
}

export function PerformanceReviewForm({ employeeId, onSuccess }: PerformanceReviewFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      employeeId,
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    try {
      setIsLoading(true);
      await reviewAPI.create(data);
      toast.success("Performance review submitted successfully");
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to submit review");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            {...register("position")}
            className={errors.position ? "border-red-500" : ""}
          />
          {errors.position && (
            <p className="text-red-500 text-sm">{errors.position.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            {...register("department")}
            className={errors.department ? "border-red-500" : ""}
          />
          {errors.department && (
            <p className="text-red-500 text-sm">{errors.department.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="reviewType">Review Type</Label>
          <select
            id="reviewType"
            {...register("reviewType")}
            className="w-full p-2 border rounded-md"
          >
            <option value="quarterly">Quarterly</option>
            <option value="annual">Annual</option>
            <option value="probationary">Probationary</option>
          </select>
          {errors.reviewType && (
            <p className="text-red-500 text-sm">{errors.reviewType.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateHired">Date Hired</Label>
          <Input
            id="dateHired"
            type="date"
            {...register("dateHired")}
            className={errors.dateHired ? "border-red-500" : ""}
          />
          {errors.dateHired && (
            <p className="text-red-500 text-sm">{errors.dateHired.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="immediateSupervisor">Immediate Supervisor</Label>
        <Input
          id="immediateSupervisor"
          {...register("immediateSupervisor")}
          className={errors.immediateSupervisor ? "border-red-500" : ""}
        />
        {errors.immediateSupervisor && (
          <p className="text-red-500 text-sm">{errors.immediateSupervisor.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="performanceCoverage">Performance Coverage Period</Label>
        <Input
          id="performanceCoverage"
          {...register("performanceCoverage")}
          className={errors.performanceCoverage ? "border-red-500" : ""}
        />
        {errors.performanceCoverage && (
          <p className="text-red-500 text-sm">{errors.performanceCoverage.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Job Performance</h3>
        
        <div className="space-y-2">
          <Label htmlFor="jobKnowledge">Job Knowledge (1-5)</Label>
          <Input
            id="jobKnowledge"
            type="number"
            min="1"
            max="5"
            {...register("jobKnowledge", { valueAsNumber: true })}
            className={errors.jobKnowledge ? "border-red-500" : ""}
          />
          <Textarea
            placeholder="Comments on job knowledge..."
            {...register("jobKnowledgeComments")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="qualityOfWork">Quality of Work (1-5)</Label>
          <Input
            id="qualityOfWork"
            type="number"
            min="1"
            max="5"
            {...register("qualityOfWork", { valueAsNumber: true })}
            className={errors.qualityOfWork ? "border-red-500" : ""}
          />
          <Textarea
            placeholder="Comments on quality of work..."
            {...register("qualityofworkComments")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="promptnessOfWork">Promptness of Work (1-5)</Label>
          <Input
            id="promptnessOfWork"
            type="number"
            min="1"
            max="5"
            {...register("promptnessOfWork", { valueAsNumber: true })}
            className={errors.promptnessOfWork ? "border-red-500" : ""}
          />
          <Textarea
            placeholder="Comments on promptness of work..."
            {...register("promptnessofworkComments")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalComments">Additional Comments</Label>
        <Textarea
          id="additionalComments"
          placeholder="Any additional comments or observations..."
          {...register("additionalComments")}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
} 