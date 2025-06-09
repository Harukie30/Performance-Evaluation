import { NextResponse } from "next/server";
import { Employee } from "@/types/employee";

// This would typically come from your database
let employees: Employee[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@smct.com",
    phone: "+1 234-567-8901",
    department: "Engineering",
    location: "New York",
    status: "Active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // ... other initial employees
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const employee = employees.find((emp) => emp.id === parseInt(params.id));
  if (!employee) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }
  return NextResponse.json(employee);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const index = employees.findIndex((emp) => emp.id === parseInt(params.id));

  if (index === -1) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  const updatedEmployee: Employee = {
    ...employees[index],
    ...body,
    updatedAt: new Date().toISOString(),
  };

  employees[index] = updatedEmployee;
  return NextResponse.json(updatedEmployee);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const index = employees.findIndex((emp) => emp.id === parseInt(params.id));

  if (index === -1) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  employees = employees.filter((emp) => emp.id !== parseInt(params.id));
  return NextResponse.json({ message: "Employee deleted successfully" });
}
