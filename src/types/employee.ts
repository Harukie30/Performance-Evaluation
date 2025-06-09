export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  location: string;
  status: "Active" | "On Leave" | "Terminated";
  created_at?: string;
  updated_at?: string;
} 