import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { readJsonFile, writeJsonFile } from './file-utils';

const DB_FILE_PATH = path.join(process.cwd(), 'src/data/db.json');

// Define the data structure
interface Database {
  performanceReviews: PerformanceReview[];
  recentActivities: RecentActivity[];
}

interface PerformanceReview {
  id: string;
  employeeId: string;
  position: string;
  department: string;
  reviewType: string;
  dateHired?: string;
  immediateSupervisor?: string;
  performanceCoverage?: string;
  status: string;
  submittedAt: string;
  // Add other fields as needed
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  employeeName: string;
  employeeId: string;
}

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
      await writeJsonFile(DB_FILE_PATH, initialData);
      console.log("Database initialized successfully");
    }
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

// Initialize database on module load
initializeDatabase().catch(console.error);

export const db = {
  performanceReviews: {
    async findMany(filters?: { employeeId?: string; status?: string }) {
      try {
        const data = await readJsonFile<Database>(DB_FILE_PATH);
        let reviews = data.performanceReviews || [];
        
        // Apply filters if provided
        if (filters) {
          reviews = reviews.filter(review => {
            if (filters.employeeId && review.employeeId !== filters.employeeId) {
              return false;
            }
            if (filters.status && review.status !== filters.status) {
              return false;
            }
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
        // Ensure database is initialized
        await initializeDatabase();
        
        const data = await readJsonFile<Database>(DB_FILE_PATH);
        const newReview = {
          ...review,
          id: crypto.randomUUID(),
        };
        
        data.performanceReviews = data.performanceReviews || [];
        data.performanceReviews.push(newReview);
        
        await writeJsonFile(DB_FILE_PATH, data);
        console.log("Created performance review:", newReview);
        return newReview;
      } catch (error) {
        console.error("Error creating performance review:", error);
        throw new Error(`Failed to create performance review: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },

    async update(id: string, data: Partial<PerformanceReview>) {
      try {
        const dbData = await readJsonFile<Database>(DB_FILE_PATH);
        const index = dbData.performanceReviews.findIndex(review => review.id === id);
        
        if (index === -1) {
          throw new Error(`Review with id ${id} not found`);
        }

        dbData.performanceReviews[index] = {
          ...dbData.performanceReviews[index],
          ...data,
        };

        await writeJsonFile(DB_FILE_PATH, dbData);
        return dbData.performanceReviews[index];
      } catch (error) {
        console.error("Error updating performance review:", error);
        throw error;
      }
    },

    async delete(id: string) {
      try {
        const dbData = await readJsonFile<Database>(DB_FILE_PATH);
        const index = dbData.performanceReviews.findIndex(review => review.id === id);
        
        if (index === -1) {
          throw new Error(`Review with id ${id} not found`);
        }

        dbData.performanceReviews.splice(index, 1);
        await writeJsonFile(DB_FILE_PATH, dbData);
      } catch (error) {
        console.error("Error deleting performance review:", error);
        throw error;
      }
    }
  },

  recentActivities: {
    async findMany() {
      try {
        const data = await readJsonFile<Database>(DB_FILE_PATH);
        return data.recentActivities || [];
      } catch (error) {
        console.error("Error reading recent activities:", error);
        return [];
      }
    },

    async create(activity: Omit<RecentActivity, "id">) {
      try {
        // Ensure database is initialized
        await initializeDatabase();
        
        const data = await readJsonFile<Database>(DB_FILE_PATH);
        const newActivity = {
          ...activity,
          id: crypto.randomUUID(),
        };
        
        data.recentActivities = data.recentActivities || [];
        data.recentActivities.push(newActivity);
        
        await writeJsonFile(DB_FILE_PATH, data);
        console.log("Created recent activity:", newActivity);
        return newActivity;
      } catch (error) {
        console.error("Error creating recent activity:", error);
        throw new Error(`Failed to create recent activity: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }
}; 