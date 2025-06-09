import { quarterlyReviews } from '../data/quarterly-reviews.json';

export interface QuarterlyReview {
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  overallRating: number;
  reviewer: string;
  reviewDate: string;
  status: string;
  categories: {
    technicalSkills: { rating: number; comments: string; };
    communication: { rating: number; comments: string; };
    leadership: { rating: number; comments: string; };
    productivity: { rating: number; comments: string; };
    teamwork: { rating: number; comments: string; };
  };
  achievements: string[];
  goalsForNextQuarter?: string[];
  goalsForNextYear?: string[];
}

export interface QuarterData {
  reviewPeriod: string;
  reviews: QuarterlyReview[];
}

export const loadQuarterlyReviews = (quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4'): QuarterData => {
  return quarterlyReviews[quarter];
};

export const getAllQuarters = () => {
  return Object.keys(quarterlyReviews) as ('Q1' | 'Q2' | 'Q3' | 'Q4')[];
}; 