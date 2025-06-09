import { Employee } from "@/types/employee";

// This can be changed by your backend team
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost/api";

export const employeeService = {
  // Get all employees
  async getAllEmployees(): Promise<Employee[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`);
      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  },

  // Get employee by ID
  async getEmployeeById(id: number): Promise<Employee> {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch employee");
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching employee ${id}:`, error);
      throw error;
    }
  },

  // Create new employee
  async createEmployee(employee: Omit<Employee, "id">): Promise<Employee> {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employee),
      });
      if (!response.ok) {
        throw new Error("Failed to create employee");
      }
      return response.json();
    } catch (error) {
      console.error("Error creating employee:", error);
      throw error;
    }
  },

  // Update employee
  async updateEmployee(id: number, employee: Partial<Employee>): Promise<Employee> {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employee),
      });
      if (!response.ok) {
        throw new Error("Failed to update employee");
      }
      return response.json();
    } catch (error) {
      console.error(`Error updating employee ${id}:`, error);
      throw error;
    }
  },

  // Delete employee
  async deleteEmployee(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }
    } catch (error) {
      console.error(`Error deleting employee ${id}:`, error);
      throw error;
    }
  },
}; 