import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

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

export function formatTimestamp(timestamp: string, formatType: 'short' | 'long' | 'full' = 'short'): string {
  if (!timestamp) return "N/A";
  
  try {
    const date = parseISO(timestamp);
    
    switch (formatType) {
      case 'short':
        return format(date, "MMM d, yyyy h:mm a");  // Jun 18, 2025 1:05 AM
      case 'long':
        return format(date, "EEEE, MMMM d, yyyy 'at' h:mm a");  // Wednesday, June 18, 2025 at 1:05 AM
      case 'full':
        return format(date, "EEEE, MMMM d, yyyy 'at' h:mm:ss a '(UTC)'");  // Wednesday, June 18, 2025 at 1:05:52 AM (UTC)
      default:
        return format(date, "MMM d, yyyy h:mm a");
    }
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return "Invalid date";
  }
}
