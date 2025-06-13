import fs from 'fs';
import path from 'path';

// Define the data structure
interface Database {
  users: User[];
  employees: Employee[];
  performanceReviews: PerformanceReview[];
}

interface User {
  id: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  location?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  reviews: PerformanceReview[];
}

interface PerformanceReview {
  id: string;
  employeeId: string;
  status: string;
  position?: string;
  department?: string;
  reviewType?: string;
  dateHired?: string;
  immediateSupervisor?: string;
  performanceCoverage?: string;
  // ... other fields from your schema
  createdAt: string;
  updatedAt: string;
}

// Path to JSON data file
const DATA_FILE_PATH = path.join(process.cwd(), 'src/data/db.json');

// Initialize database if it doesn't exist
function initializeDatabase() {
  if (!fs.existsSync(DATA_FILE_PATH)) {
    const initialData: Database = {
      users: [],
      employees: [],
      performanceReviews: []
    };
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(initialData, null, 2));
  }
}

// Read database
function readDatabase(): Database {
  try {
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { users: [], employees: [], performanceReviews: [] };
  }
}

// Write to database
function writeDatabase(data: Database) {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing to database:', error);
  }
}

// Initialize database on module load
initializeDatabase();

// Export database operations
export const db = {
  users: {
    findUnique: async (where: { id?: string; email?: string }) => {
      const data = readDatabase();
      return data.users.find(user => 
        (where.id && user.id === where.id) || 
        (where.email && user.email === where.email)
      );
    },
    create: async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
      const db = readDatabase();
      const newUser: User = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.users.push(newUser);
      writeDatabase(db);
      return newUser;
    }
  },
  employees: {
    findMany: async () => {
      const data = readDatabase();
      return data.employees;
    },
    findUnique: async (where: { id: string }) => {
      const data = readDatabase();
      return data.employees.find(emp => emp.id === where.id);
    },
    create: async (data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt' | 'reviews'>) => {
      const db = readDatabase();
      const newEmployee: Employee = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reviews: []
      };
      db.employees.push(newEmployee);
      writeDatabase(db);
      return newEmployee;
    }
  },
  performanceReviews: {
    findMany: async (where?: { employeeId?: string; status?: string }) => {
      const data = readDatabase();
      return data.performanceReviews.filter(review => 
        (!where?.employeeId || review.employeeId === where.employeeId) &&
        (!where?.status || review.status === where.status)
      );
    },
    create: async (data: Omit<PerformanceReview, 'id' | 'createdAt' | 'updatedAt'>) => {
      const db = readDatabase();
      const newReview: PerformanceReview = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.performanceReviews.push(newReview);
      writeDatabase(db);
      return newReview;
    },
    update: async (id: string, data: Partial<PerformanceReview>) => {
      const db = readDatabase();
      const index = db.performanceReviews.findIndex(review => review.id === id);
      if (index === -1) {
        throw new Error('Review not found');
      }
      const updatedReview = {
        ...db.performanceReviews[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      db.performanceReviews[index] = updatedReview;
      writeDatabase(db);
      return updatedReview;
    },
    delete: async (id: string) => {
      const db = readDatabase();
      const index = db.performanceReviews.findIndex(review => review.id === id);
      if (index === -1) {
        throw new Error('Review not found');
      }
      db.performanceReviews.splice(index, 1);
      writeDatabase(db);
      return true;
    }
  }
}; 