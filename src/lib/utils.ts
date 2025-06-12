import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// In-memory storage for development
let dataStore: any = null;

export async function readJsonFile<T>(filePath: string): Promise<T> {
  try {
    if (process.env.NODE_ENV === 'development') {
      if (!dataStore) {
        // In development, we'll use a default empty structure
        dataStore = {
          employees: [],
          users: []
        };
      }
      return dataStore as T;
    }
    
    // In production, you would typically use a database
    // For now, we'll return the same development structure
    return {
      employees: [],
      users: []
    } as T;
  } catch (error) {
    console.error('Error reading data:', error);
    throw error;
  }
}

export async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  try {
    if (process.env.NODE_ENV === 'development') {
      dataStore = data;
      return;
    }
    
    // In production, you would typically save to a database
    console.log('Data would be saved in production:', data);
  } catch (error) {
    console.error('Error writing data:', error);
    throw error;
  }
}
