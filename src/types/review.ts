export interface Review {
  id: string;
  employee: {
    id: string;
    name: string;
    profileImage?: string;
  };
  department: string;
  position: string;
  status: "Completed" | "In Progress" | "Pending" | "Pending HR Review" | "Rejected";
  finalScore?: number | null;
  finalRating?: string | null;
  createdAt: string;
  updatedAt?: string;
  comments?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  hrComments?: string;
} 