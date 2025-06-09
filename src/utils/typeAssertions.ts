import { Employee } from "@/types/employee";
import { Review } from "@/types/review";

type RawEmployee = Omit<Employee, 'status'> & {
  status: string;
};

type RawReview = Omit<Review, 'status'> & {
  status: string;
};

export function assertEmployee(data: RawEmployee): Employee {
  return {
    ...data,
    status: data.status as "Active" | "On Leave" | "Terminated"
  };
}

export function assertReview(data: RawReview): Review {
  return {
    ...data,
    status: data.status as "Completed" | "In Progress" | "Pending"
  };
}

export function assertEmployees(data: RawEmployee[]): Employee[] {
  return data.map(assertEmployee);
}

export function assertReviews(data: RawReview[]): Review[] {
  return data.map(assertReview);
} 