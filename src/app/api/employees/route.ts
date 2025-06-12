import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import fs from 'fs';
import path from 'path';

// Define the Employee interface
interface Employee {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  position: {
    title: string;
  };
  department: {
    department_name: string;
  };
  location: string;
  status: string;
  datehired: {
    date: string;
  };
}

const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  position: z.string().min(1, "Position is required"),
  department: z.string().min(1, "Department is required"),
  location: z.string().min(1, "Location is required"),
});

const dataFilePath = path.join(process.cwd(), 'src/data/users.json');

// Helper function to read employees data
const readEmployeesData = (): Employee[] => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading employees data:', error);
    return [];
  }
};

// Helper function to write employees data
const writeEmployeesData = (data: Employee[]) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing employees data:', error);
    throw error;
  }
};

// GET /api/employees
export async function GET() {
  try {
    const employees = readEmployeesData();
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
  }
}

// GET /api/employees/[id]
export async function GET_BY_ID(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const employeeId = url.pathname.split('/').pop();

    if (!employeeId) {
      return NextResponse.json(
        { error: "Employee ID is required" },
        { status: 400 }
      );
    }

    const employees = readEmployeesData();
    const employee = employees.find(emp => emp.employeeId === employeeId);

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(employee);
  } catch (error) {
    console.error("Failed to fetch employee:", error);
    return NextResponse.json(
      { error: "Failed to fetch employee" },
      { status: 500 }
    );
  }
}

// POST /api/employees
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = employeeSchema.parse(body);
    const employees = readEmployeesData();
    
    // Generate a new employee ID
    const newEmployeeId = `EMP${String(employees.length + 1).padStart(3, '0')}`;
    
    // Create new employee object
    const newEmployee: Employee = {
      id: employees.length + 1,
      employeeId: newEmployeeId,
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      position: {
        title: validatedData.position
      },
      department: {
        department_name: validatedData.department
      },
      location: validatedData.location,
      status: "Active",
      datehired: {
        date: new Date().toISOString().split('T')[0]
      }
    };

    // Add new employee to the array
    employees.push(newEmployee);
    
    // Save updated data
    writeEmployeesData(employees);

    return NextResponse.json(newEmployee);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to add employee" }, { status: 500 });
  }
}

// PUT /api/employees/[employeeId]
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const employeeId = url.pathname.split('/').pop();

    if (!employeeId) {
      return NextResponse.json(
        { error: "Employee ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = employeeSchema.parse(body);
    const employees = readEmployeesData();
    
    const employeeIndex = employees.findIndex(emp => emp.employeeId === employeeId);
    
    if (employeeIndex === -1) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    const updatedEmployee: Employee = {
      ...employees[employeeIndex],
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      position: {
        title: validatedData.position
      },
      department: {
        department_name: validatedData.department
      },
      location: validatedData.location,
    };

    employees[employeeIndex] = updatedEmployee;
    writeEmployeesData(employees);

    return NextResponse.json(updatedEmployee);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 }
    );
  }
}

// DELETE /api/employees/[employeeId]
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const employeeId = url.pathname.split('/').pop();
    
    const employees = readEmployeesData();
    const updatedEmployees = employees.filter((emp: Employee) => emp.employeeId !== employeeId);
    
    if (updatedEmployees.length === employees.length) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }
    
    writeEmployeesData(updatedEmployees);
    
    return NextResponse.json({ message: "Employee deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 });
  }
}
