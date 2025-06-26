import { reviewAPI } from './api';

export interface Review {
  id: string;
  employeeName: string;
  employeeId: string;
  status: 'Pending' | 'Completed';
  date: string;
  score: number;
}

export interface Activity {
  id: string;
  type: 'evaluation_completed' | 'evaluation_started';
  text: string;
  timestamp: string;
  reviewId?: string;
}

export interface Notification {
  id: string;
  type: "evaluation_completed" | "evaluation_started" | "reminder";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  employeeName?: string;
  evaluationId?: string;
}

export const reviewService = {
  // --- Data Fetching Methods ---
  
  /**
   * Get all reviews from the API
   */
  getReviews: async (): Promise<Review[]> => {
    try {
      const response = await reviewAPI.getAll();
      return response.data.map((review: any) => ({
        id: review.id,
        employeeName: review.employeeName || 'Unknown Employee',
        employeeId: review.employeeId,
        status: review.status === 'completed' ? 'Completed' : 'Pending',
        date: review.submittedAt || review.createdAt,
        score: review.finalScore || 0,
      }));
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  },

  /**
   * Get recent activities from the API
   */
  getActivities: async (): Promise<Activity[]> => {
    try {
      const response = await fetch('/api/recent-activities');
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }
      const activities = await response.json();
      return activities.map((activity: any) => ({
        id: activity.id,
        type: activity.type === 'evaluation' ? 'evaluation_completed' : 'evaluation_started',
        text: activity.description,
        timestamp: activity.timestamp,
        reviewId: activity.reviewId,
      }));
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  },

  /**
   * Get notifications based on activities
   */
  getNotifications: async (): Promise<Notification[]> => {
    try {
      const activities = await reviewService.getActivities();
      return activities.map((activity) => ({
        id: activity.id,
        type: activity.type,
        title: "Evaluation Completed",
        message: activity.text,
        timestamp: activity.timestamp,
        read: false,
      }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  // --- Actions to Modify Data ---
  
  /**
   * Completes a review, updating its status and score.
   * Also creates a "completed evaluation" activity log.
   * This would be called by the Evaluator dashboard.
   */
  completeReview: async (reviewId: string, score: number): Promise<void> => {
    try {
      // Update the review status
      await reviewAPI.update(reviewId, { 
        status: 'completed', 
        finalScore: score,
        completedAt: new Date().toISOString()
      });

      // Create a new activity
      await fetch('/api/recent-activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'evaluation',
          description: `Evaluation completed with a score of ${score}.`,
          timestamp: new Date().toISOString(),
          reviewId: reviewId
        }),
      });

      console.log(`Review ${reviewId} completed successfully`);
    } catch (error) {
      console.error(`Error completing review ${reviewId}:`, error);
      throw error;
    }
  },

  /**
   * Adds a new completed review to the list.
   * This is for when a review is created and submitted from scratch.
   */
  addNewReview: async (reviewData: { 
    id: string, 
    employeeName: string, 
    employeeId: string, 
    score: number 
  }): Promise<void> => {
    try {
      // Create a new activity for the new review
      await fetch('/api/recent-activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'evaluation',
          description: `A new evaluation for ${reviewData.employeeName} was submitted with a score of ${reviewData.score}.`,
          timestamp: new Date().toISOString(),
          employeeName: reviewData.employeeName,
          employeeId: reviewData.employeeId,
          reviewId: reviewData.id
        }),
      });

      console.log(`New review ${reviewData.id} added successfully`);
    } catch (error) {
      console.error(`Error adding new review ${reviewData.id}:`, error);
      throw error;
    }
  },

  /**
   * Mark a notification as read
   */
  markNotificationAsRead: async (notificationId: string): Promise<void> => {
    try {
      // In a real implementation, you might have an API endpoint for this
      // For now, we'll just log it
      console.log(`Notification ${notificationId} marked as read`);
    } catch (error) {
      console.error(`Error marking notification ${notificationId} as read:`, error);
      throw error;
    }
  },

  /**
   * Mark all notifications as read
   */
  markAllNotificationsAsRead: async (): Promise<void> => {
    try {
      // In a real implementation, you might have an API endpoint for this
      // For now, we'll just log it
      console.log('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  /**
   * A function to get the current state of all data, useful for initial loads.
   */
  getData: async () => {
    const [reviews, activities] = await Promise.all([
      reviewService.getReviews(),
      reviewService.getActivities()
    ]);
    
    return {
      reviews,
      activities,
    };
  },
}; 