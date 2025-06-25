import { BehaviorSubject } from 'rxjs';

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
}

const initialReviews: Review[] = [
  // Start with some pending reviews for demonstration
  { id: '1', employeeName: 'John Doe', employeeId: '001', status: 'Pending', date: '2024-07-28', score: 0 },
  { id: '2', employeeName: 'Jane Smith', employeeId: '002', status: 'Pending', date: '2024-07-29', score: 0 },
];

const initialActivities: Activity[] = [];

// Use RxJS BehaviorSubject to create observable data stores
// This allows components to subscribe and automatically receive updates when data changes
const reviews$ = new BehaviorSubject<Review[]>(initialReviews);
const activities$ = new BehaviorSubject<Activity[]>(initialActivities);

export const reviewService = {
  // --- Observables for Subscribing ---
  reviews$: reviews$.asObservable(),
  activities$: activities$.asObservable(),

  // --- Actions to Modify Data ---
  
  /**
   * Completes a review, updating its status and score.
   * Also creates a "completed evaluation" activity log.
   * This would be called by the Evaluator dashboard.
   */
  completeReview: (reviewId: string, score: number) => {
    const currentReviews = reviews$.getValue();
    const reviewIndex = currentReviews.findIndex((r: Review) => r.id === reviewId);

    if (reviewIndex === -1) {
      console.error(`Review with id ${reviewId} not found.`);
      return;
    }

    // Update the review
    const updatedReviews = [...currentReviews];
    const completedReview = { ...updatedReviews[reviewIndex], status: 'Completed' as const, score };
    updatedReviews[reviewIndex] = completedReview;
    
    // Create a new activity
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      type: 'evaluation_completed',
      text: `Evaluation for ${completedReview.employeeName} was completed with a score of ${score}.`,
      timestamp: new Date().toISOString(),
    };
    
    const currentActivities = activities$.getValue();

    // Push new data to the observables, which will notify all subscribers
    reviews$.next(updatedReviews);
    activities$.next([newActivity, ...currentActivities]);
  },

  /**
   * Adds a new completed review to the list.
   * This is for when a review is created and submitted from scratch.
   */
  addNewReview: (reviewData: { id: string, employeeName: string, employeeId: string, score: number }) => {
    const newReview: Review = {
      ...reviewData,
      status: 'Completed' as const,
      date: new Date().toISOString(),
    };

    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      type: 'evaluation_completed',
      text: `A new evaluation for ${newReview.employeeName} was submitted with a score of ${newReview.score}.`,
      timestamp: new Date().toISOString(),
    };

    reviews$.next([newReview, ...reviews$.getValue()]);
    activities$.next([newActivity, ...activities$.getValue()]);
  },

  /**
   * A function to get the current state of all data, useful for initial loads.
   */
  getData: () => ({
    reviews: reviews$.getValue(),
    activities: activities$.getValue(),
  }),
}; 