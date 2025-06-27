import { useState, useEffect } from 'react';
import { reviewService, Review, Activity, Notification } from '@/services/reviewService';

interface UseReviewDataOptions {
  autoRefresh?: boolean;
  initialLoad?: boolean;
}

export const useReviewData = (options: UseReviewDataOptions = {}) => {
  const { autoRefresh = false, initialLoad = true } = options; // Disable auto-refresh by default
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setError(null);
      const [reviewsData, activitiesData, notificationsData] = await Promise.all([
        reviewService.getReviews(),
        reviewService.getActivities(),
        reviewService.getNotifications()
      ]);
      
      setReviews(reviewsData);
      setActivities(activitiesData);
      setNotifications(notificationsData);
    } catch (err) {
      console.error('Error loading review data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await loadData();
  };

  useEffect(() => {
    if (initialLoad) {
      loadData();
    }
  }, [initialLoad]);

  return {
    reviews,
    activities,
    notifications,
    loading,
    error,
    refreshData,
    reloadNotifications: async () => {
      setLoading(true);
      try {
        const notificationsData = await reviewService.getNotifications();
        setNotifications(notificationsData);
      } finally {
        setLoading(false);
      }
    },
  };
}; 