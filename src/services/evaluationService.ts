import { performanceReviews } from '../data/quarter.json';

export interface Employee {
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  status: string;
}

export interface Evaluation {
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  reviewYear: number;
  overallRating: number;
  reviewer: string;
  reviewDate: string;
  status: string;
  categories: {
    technicalSkills?: { rating: number; comments: string; };
    communication?: { rating: number; comments: string; };
    leadership?: { rating: number; comments: string; };
    productivity?: { rating: number; comments: string; };
    strategicPlanning?: { rating: number; comments: string; };
    teamManagement?: { rating: number; comments: string; };
    innovation?: { rating: number; comments: string; };
    salesPerformance?: { rating: number; comments: string; };
    customerRelations?: { rating: number; comments: string; };
    productKnowledge?: { rating: number; comments: string; };
    teamwork?: { rating: number; comments: string; };
  };
  achievements: string[];
  areasForImprovement: string[];
  goalsForNextYear: string[];
}

export const loadEvaluations = (): Evaluation[] => {
  return performanceReviews;
};

export const loadEmployees = (): Employee[] => {
  return performanceReviews
    .filter(review => review.status === "completed")
    .map(review => ({
      employeeId: review.employeeId,
      employeeName: review.employeeName,
      department: review.department,
      position: review.position,
      status: review.status
    }));
}; 