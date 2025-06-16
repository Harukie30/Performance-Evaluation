import { z } from "zod";
import fs from 'fs';
import path from 'path';

// Custom UUID generator function
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Database types
export interface PerformanceReview {
  id: string;
  employeeId: string;
  position: string;
  department: string;
  reviewType: string;
  dateHired: string;
  immediateSupervisor: string;
  performanceCoverage: string;
  jobKnowledge: number;
  qualityOfWork: number;
  promptnessOfWork: number;
  qualityMeetsStandards: number;
  qualityTimeliness: number;
  qualityWorkOutputVolume: number;
  qualityConsistency: number;
  qualityJobTargets: number;
  adaptabilityOpenness: number;
  adaptabilityFlexibility: number;
  adaptabilityResilience: number;
  activeParticipationScore: number;
  positiveTeamCultureScore: number;
  effectiveCommunicationScore: number;
  consistentAttendanceScore: number;
  punctualityScore: number;
  followsThroughScore: number;
  reliableHandlingScore: number;
  ethicalFollowsPoliciesScore: number;
  ethicalProfessionalismScore: number;
  ethicalAccountabilityScore: number;
  ethicalRespectScore: number;
  customerListeningScore: number;
  customerProblemSolvingScore: number;
  customerProductKnowledgeScore: number;
  customerProfessionalAttitudeScore: number;
  customerTimelyResolutionScore: number;
  jobKnowledgeComments: string;
  promptnessofworkComments: string;
  qualityofworkComments: string;
  qualityMeetsStandardsComments: string;
  qualityTimelinessComments: string;
  qualityWorkOutputVolumeComments: string;
  qualityConsistencyComments: string;
  qualityJobTargetsComments: string;
  adaptabilityOpennessComments: string;
  adaptabilityFlexibilityComments: string;
  adaptabilityResilienceComments: string;
  activeParticipationExplanation: string;
  positiveTeamCultureExplanation: string;
  effectiveCommunicationExplanation: string;
  consistentAttendanceExplanation: string;
  punctualityExplanation: string;
  followsThroughExplanation: string;
  reliableHandlingExplanation: string;
  ethicalFollowsPoliciesExplanation: string;
  ethicalProfessionalismExplanation: string;
  ethicalAccountabilityExplanation: string;
  ethicalRespectExplanation: string;
  customerListeningExplanation: string;
  customerProblemSolvingExplanation: string;
  customerProductKnowledgeExplanation: string;
  customerProfessionalAttitudeExplanation: string;
  customerTimelyResolutionExplanation: string;
  finalScore: number;
  finalRating: string;
  finalPercentage: number;
  areasForImprovement: string;
  additionalComments: string;
  status: string;
  submittedAt: string;
}

export interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  employeeName: string;
  employeeId: string;
  reviewId?: string;
}

interface Database {
  performanceReviews: PerformanceReview[];
  recentActivities: RecentActivity[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'src/data/db.json');

// Initialize database if it doesn't exist
async function initializeDatabase() {
  try {
    const dbExists = await fs.promises.access(DB_FILE_PATH)
      .then(() => true)
      .catch(() => false);

    if (!dbExists) {
      const initialData: Database = {
        performanceReviews: [],
        recentActivities: []
      };
      await fs.promises.writeFile(DB_FILE_PATH, JSON.stringify(initialData, null, 2));
      console.log("Database initialized with empty data");
    }
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

// Initialize database on module load
initializeDatabase().catch(console.error);

// Helper functions for database operations
async function readDatabase(): Promise<Database> {
  try {
    const data = await fs.promises.readFile(DB_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    console.log("Read database:", parsed);
    return parsed;
  } catch (error) {
    console.error("Error reading database:", error);
    return { performanceReviews: [], recentActivities: [] };
  }
}

async function writeDatabase(data: Database): Promise<void> {
  try {
    await fs.promises.writeFile(DB_FILE_PATH, JSON.stringify(data, null, 2));
    console.log("Wrote to database:", data);
  } catch (error) {
    console.error("Error writing to database:", error);
    throw new Error("Failed to write to database");
  }
}

export const db = {
  performanceReviews: {
    async findMany(filters?: { employeeId?: string; status?: string }) {
      try {
        const data = await readDatabase();
        let reviews = data.performanceReviews || [];
        
        if (filters) {
          reviews = reviews.filter(review => {
            if (filters.employeeId && review.employeeId !== filters.employeeId) return false;
            if (filters.status && review.status !== filters.status) return false;
            return true;
          });
        }
        
        return reviews;
      } catch (error) {
        console.error("Error reading performance reviews:", error);
        return [];
      }
    },

    async create(review: Omit<PerformanceReview, "id">) {
      try {
        const data = await readDatabase();
        const newReview = {
          ...review,
          id: generateUUID(),
        };
        data.performanceReviews = [...(data.performanceReviews || []), newReview];
        await writeDatabase(data);
        console.log("Created new performance review:", newReview);
        return newReview;
      } catch (error) {
        console.error("Error creating performance review:", error);
        throw new Error("Failed to create performance review");
      }
    },

    async update(id: string, review: Partial<PerformanceReview>) {
      try {
        const data = await readDatabase();
        const index = data.performanceReviews.findIndex(r => r.id === id);
        if (index === -1) {
          throw new Error("Review not found");
        }
        data.performanceReviews[index] = {
          ...data.performanceReviews[index],
          ...review,
        };
        await writeDatabase(data);
        return data.performanceReviews[index];
      } catch (error) {
        console.error("Error updating performance review:", error);
        throw new Error("Failed to update performance review");
      }
    },

    async delete(id: string) {
      try {
        const data = await readDatabase();
        data.performanceReviews = data.performanceReviews.filter(r => r.id !== id);
        await writeDatabase(data);
      } catch (error) {
        console.error("Error deleting performance review:", error);
        throw new Error("Failed to delete performance review");
      }
    },
  },

  recentActivities: {
    async findMany() {
      try {
        const data = await readDatabase();
        const activities = data.recentActivities || [];
        console.log("Found recent activities:", activities);
        return activities.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      } catch (error) {
        console.error("Error reading recent activities:", error);
        return [];
      }
    },

    async create(activity: Omit<RecentActivity, "id">) {
      try {
        const data = await readDatabase();
        const newActivity = {
          ...activity,
          id: generateUUID(),
        };
        data.recentActivities = [...(data.recentActivities || []), newActivity];
        await writeDatabase(data);
        console.log("Created new recent activity:", newActivity);
        return newActivity;
      } catch (error) {
        console.error("Error creating recent activity:", error);
        throw new Error("Failed to create recent activity");
      }
    },
  },
}; 