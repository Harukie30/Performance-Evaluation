import { z } from "zod";

// Base schema for common fields
const baseSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  employeeName: z.number(),
  position: z.string().min(1, "Position is required"),
  department: z.string().min(1, "Department is required"),
  immediateSupervisorInput: z.string().min(1, "Supervisor name is required"),
  performanceCoverage: z.string().min(1, "Performance coverage is required"),
  reviewDate: z.date(),
  datehired: z.date(),
  reviewType: z.enum(["quarterly", "annual", "probationary"]),
  reviewPeriod: z.string(),
  ForRegular: z.enum(["Q1 2023", "Q2 2023", "Q3 2023", "Q4 2023", "Q1 2024", "Q2 2024"]).optional(),
  ForProbationary: z.enum(["3 months", "5 months"]).optional(),
  otherReviewType: z.string().optional(),
  otherReviewDetails: z.string().optional(),
  attendance: z.number().optional(),
  punctuality: z.number().optional(),
  correctiveActionWarningReprimandsOralOrWritten: z.number().optional(),
  honesty: z.number().optional(),
  loyalty: z.number().optional(),
  courteous: z.number().optional(),
  communication: z.number().optional(),
  initiative: z.number().optional(),
  jobKnowledge: z.number(),
  promptnessOfWork: z.number(),
  qualityOfWork: z.number(),
  jobKnowledgeComments: z.string(),
  qualityofworkComments: z.string(),
  promptnessofworkComments: z.string(),
  punctualityComments: z.string().optional(),
  attendanceComments: z.string().optional(),
  correctiveactionComments: z.string().optional(),
  honestyComments: z.string().optional(),
  loyaltyComments: z.string().optional(),
  courteousComments: z.string().optional(),
  communicationComments: z.string().optional(),
  initiativeComments: z.string().optional(),
});

// Review type specific schemas
const reviewTypeSchema = z.object({
  ForProbationary: z.enum(["3 months", "5 months"]).optional(),
  ForRegular: z.enum(["Q1 2023", "Q2 2023", "Q3 2023", "Q4 2023", "Q1 2024", "Q2 2024"]).optional(),
  otherReviewType: z.enum(["Performance Improvement"]).optional(),
  otherReviewDetails: z.string().optional(),
  otherReviewChecked: z.boolean().optional(),
});

// Job performance schema
const jobPerformanceSchema = z.object({
  jobKnowledge: z.number().min(1).max(5),
  promptnessOfWork: z.number().min(1).max(5),
  qualityOfWork: z.number().min(1).max(5),
  jobKnowledgeComments: z.string().optional(),
  promptnessofworkComments: z.string().optional(),
  qualityofworkComments: z.string().optional(),
});

// Quality metrics schema
const qualityMetricsSchema = z.object({
  qualityMeetsStandards: z.number().min(1).max(5),
  qualityMeetsStandardsComments: z.string().optional(),
  qualityTimeliness: z.number().min(1).max(5),
  qualityTimelinessComments: z.string().optional(),
  qualityWorkOutputVolume: z.number().min(1).max(5),
  qualityWorkOutputVolumeComments: z.string().optional(),
  qualityConsistency: z.number().min(1).max(5),
  qualityConsistencyComments: z.string().optional(),
  qualityJobTargets: z.number().min(1).max(5),
  qualityJobTargetsComments: z.string().optional(),
});

// Adaptability schema
const adaptabilitySchema = z.object({
  adaptabilityOpenness: z.number().min(1).max(5),
  adaptabilityOpennessComments: z.string().optional(),
  adaptabilityFlexibility: z.number().min(1).max(5),
  adaptabilityFlexibilityComments: z.string().optional(),
  adaptabilityResilience: z.number().min(1).max(5),
  adaptabilityResilienceComments: z.string().optional(),
});

// Teamwork schema
const teamworkSchema = z.object({
  activeParticipationScore: z.number().min(1).max(5),
  activeParticipationRating: z.enum(["Needs Improvement", "Below Expectations", "Meets Expectations", "Exceeds Expectations", "N/A"]),
  activeParticipationExample: z.string().optional(),
  activeParticipationExplanation: z.string().optional(),
  positiveTeamCultureScore: z.number().min(1).max(5),
  positiveTeamCultureRating: z.enum(["Needs Improvement", "Below Expectations", "Meets Expectations", "Exceeds Expectations", "N/A"]),
  positiveTeamCultureExample: z.string().optional(),
  positiveTeamCultureExplanation: z.string().optional(),
  effectiveCommunicationScore: z.number().min(1).max(5),
  effectiveCommunicationRating: z.enum(["Needs Improvement", "Below Expectations", "Meets Expectations", "Exceeds Expectations", "N/A"]),
  effectiveCommunicationExample: z.string().optional(),
  effectiveCommunicationExplanation: z.string().optional(),
});

// Reliability schema
const reliabilitySchema = z.object({
  consistentAttendanceScore: z.number().min(1).max(5),
  consistentAttendanceExplanation: z.string().optional(),
  punctualityScore: z.number().min(1).max(5),
  punctualityExplanation: z.string().optional(),
  followsThroughScore: z.number().min(1).max(5),
  followsThroughExplanation: z.string().optional(),
  reliableHandlingScore: z.number().min(1).max(5),
  reliableHandlingExplanation: z.string().optional(),
});

// Ethics schema
const ethicsSchema = z.object({
  ethicalFollowsPoliciesScore: z.number().min(1).max(5),
  ethicalFollowsPoliciesExplanation: z.string().optional(),
  ethicalProfessionalismScore: z.number().min(1).max(5),
  ethicalProfessionalismExplanation: z.string().optional(),
  ethicalAccountabilityScore: z.number().min(1).max(5),
  ethicalAccountabilityExplanation: z.string().optional(),
  ethicalRespectScore: z.number().min(1).max(5),
  ethicalRespectExplanation: z.string().optional(),
});

// Customer service schema
const customerServiceSchema = z.object({
  customerListeningScore: z.number().min(1).max(5),
  customerListeningExplanation: z.string().optional(),
  customerProblemSolvingScore: z.number().min(1).max(5),
  customerProblemSolvingExplanation: z.string().optional(),
  customerProductKnowledgeScore: z.number().min(1).max(5),
  customerProductKnowledgeExplanation: z.string().optional(),
  customerProfessionalAttitudeScore: z.number().min(1).max(5),
  customerProfessionalAttitudeExplanation: z.string().optional(),
  customerTimelyResolutionScore: z.number().min(1).max(5),
  customerTimelyResolutionExplanation: z.string().optional(),
});

// Overall performance schema
const overallPerformanceSchema = z.object({
  overallPerformanceScore: z.number().min(1).max(5),
  overallPerformanceRating: z.enum(["Needs Improvement", "Below Expectations", "Meets Expectations", "Exceeds Expectations", "N/A"]),
  overallPerformanceExplanation: z.string().optional(),
  keyStrengths: z.string(),
  areasForImprovement: z.string(),
  developmentGoals: z.string(),
  additionalComments: z.string().optional(),
  comments: z.string().optional(),
  strengths: z.string().optional(),
  improvements: z.string().optional(),
  goals: z.string().optional(),
  overallTeamworkScore: z.number().optional(),
  overallReliabilityScore: z.number().optional(),
  overallCustomerServiceScore: z.number().optional(),
});

// Instead of using .extend() multiple times, we'll use a single merge
export const formSchema = z.object({
  ...baseSchema.shape,
  ...reviewTypeSchema.shape,
  ...jobPerformanceSchema.shape,
  ...qualityMetricsSchema.shape,
  ...adaptabilitySchema.shape,
  ...teamworkSchema.shape,
  ...reliabilitySchema.shape,
  ...ethicsSchema.shape,
  ...customerServiceSchema.shape,
  ...overallPerformanceSchema.shape,
});

export interface PerformanceFormValues {
  employeeId: string;
  employeeName: number;
  position: string;
  department: string;
  immediateSupervisorInput: string;
  performanceCoverage: string;
  reviewDate: Date;
  datehired: Date;
  reviewType: "quarterly" | "annual" | "probationary";
  reviewPeriod: string;
  ForRegular?: "Q1 2023" | "Q2 2023" | "Q3 2023" | "Q4 2023" | "Q1 2024" | "Q2 2024";
  ForProbationary?: "3 months" | "5 months";
  otherReviewType?: string;
  otherReviewDetails?: string;
  attendance: number | undefined;
  punctuality: number | undefined;
  correctiveActionWarningReprimandsOralOrWritten: number | undefined;
  honesty: number | undefined;
  loyalty: number | undefined;
  courteous: number | undefined;
  communication: number | undefined;
  initiative: number | undefined;
  jobKnowledge: number;
  promptnessOfWork: number;
  qualityOfWork: number;
  jobKnowledgeComments: string;
  qualityofworkComments: string;
  promptnessofworkComments: string;
  punctualityComments: string;
  attendanceComments: string;
  correctiveactionComments: string;
  honestyComments: string;
  loyaltyComments: string;
  courteousComments: string;
  communicationComments: string;
  initiativeComments: string;
  qualityMeetsStandards: number;
  qualityMeetsStandardsComments: string;
  qualityTimeliness: number;
  qualityTimelinessComments: string;
  qualityWorkOutputVolume: number;
  qualityWorkOutputVolumeComments: string;
  qualityConsistency: number;
  qualityConsistencyComments: string;
  qualityJobTargets: number;
  qualityJobTargetsComments: string;
  adaptabilityOpenness: number;
  adaptabilityOpennessComments: string;
  adaptabilityFlexibility: number;
  adaptabilityFlexibilityComments: string;
  adaptabilityResilience: number;
  adaptabilityResilienceComments: string;
  activeParticipationScore: number;
  activeParticipationRating: "Needs Improvement" | "Below Expectations" | "Meets Expectations" | "Exceeds Expectations" | "N/A";
  activeParticipationExample: string | undefined;
  activeParticipationExplanation: string | undefined;
  positiveTeamCultureScore: number;
  positiveTeamCultureRating: "Needs Improvement" | "Below Expectations" | "Meets Expectations" | "Exceeds Expectations" | "N/A";
  positiveTeamCultureExample: string | undefined;
  positiveTeamCultureExplanation: string | undefined;
  effectiveCommunicationScore: number;
  effectiveCommunicationRating: "Needs Improvement" | "Below Expectations" | "Meets Expectations" | "Exceeds Expectations" | "N/A";
  effectiveCommunicationExample: string | undefined;
  effectiveCommunicationExplanation: string | undefined;
  consistentAttendanceScore: number;
  consistentAttendanceExplanation: string | undefined;
  punctualityScore: number;
  punctualityExplanation: string | undefined;
  followsThroughScore: number;
  followsThroughExplanation: string | undefined;
  reliableHandlingScore: number;
  reliableHandlingExplanation: string | undefined;
  ethicalFollowsPoliciesScore: number;
  ethicalFollowsPoliciesExplanation: string | undefined;
  ethicalProfessionalismScore: number;
  ethicalProfessionalismExplanation: string | undefined;
  ethicalAccountabilityScore: number;
  ethicalAccountabilityExplanation: string | undefined;
  ethicalRespectScore: number;
  ethicalRespectExplanation: string | undefined;
  customerListeningScore: number;
  customerListeningExplanation: string | undefined;
  customerProblemSolvingScore: number;
  customerProblemSolvingExplanation: string | undefined;
  customerProductKnowledgeScore: number;
  customerProductKnowledgeExplanation: string | undefined;
  customerProfessionalAttitudeScore: number;
  customerProfessionalAttitudeExplanation: string | undefined;
  customerTimelyResolutionScore: number;
  customerTimelyResolutionExplanation: string | undefined;
  overallPerformanceScore: number;
  overallPerformanceRating: "Needs Improvement" | "Below Expectations" | "Meets Expectations" | "Exceeds Expectations" | "N/A";
  overallPerformanceExplanation: string | undefined;
  keyStrengths: string;
  areasForImprovement: string;
  developmentGoals: string;
  additionalComments: string | undefined;
  comments: string | undefined;
  strengths: string | undefined;
  improvements: string | undefined;
  goals: string | undefined;
  overallTeamworkScore: number | undefined;
  overallReliabilityScore: number | undefined;
  overallCustomerServiceScore: number | undefined;
}
