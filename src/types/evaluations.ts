export type ApiEvaluation = {
  id: number;
  employeeName: string;
  department: string;
  dueDate: string;
  status: "Pending" | "In Progress" | "Completed";
  lastUpdated: string;
  rating?: number;
}; 