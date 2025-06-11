import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import fs from 'fs/promises';
import path from 'path';
import usersData from "@/data/users.json";

const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  department: z.string().min(1, "Department is required"),
  location: z.string().optional(),
  status: z.string().default("Active"),
});

// GET /api/employees
export async function GET() {
  try {
    return NextResponse.json(usersData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
  }
}

// GET /api/employees/[id]
export async function GET_BY_ID(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Employee ID is required" },
        { status: 400 }
      );
    }

    const employee = await prisma.employee.findUnique({
      where: { id },
    });

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
    
    // Generate a new employee ID
    const newEmployeeId = `EMP${Math.floor(Math.random() * 10000)}`;
    
    // Create new employee object
    const newEmployee = {
      id: usersData.length + 1,
      employeeId: newEmployeeId,
      name: body.name,
      email: body.email,
      phone: body.phone,
      position: {
        title: body.position
      },
      department: {
        department_name: body.department
      },
      location: body.location,
      status: "Active",
      datehired: {
        date: new Date().toISOString().split('T')[0]
      }
    };

    // In a real application, you would save this to a database
    // For now, we'll just return the new employee
    return NextResponse.json(newEmployee);
  } catch (error) {
    return NextResponse.json({ error: "Failed to add employee" }, { status: 500 });
  }
}

// PUT /api/employees
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Employee ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = employeeSchema.parse(body);

    const employee = await prisma.employee.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(employee);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Failed to update employee:", error);
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 }
    );
  }
}

// DELETE /api/employees
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Employee ID is required" },
        { status: 400 }
      );
    }

    await prisma.employee.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Failed to delete employee:", error);
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}
