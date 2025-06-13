import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize reviews file if it doesn't exist
if (!fs.existsSync(REVIEWS_FILE)) {
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify([]));
}

export interface Review {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  reviewPeriod: string;
  status: 'draft' | 'submitted' | 'completed';
  lastModified: string;
  finalResult?: {
    score: number;
    comments: string;
    submittedBy: string;
    submittedAt: string;
  };
}

export function readReviewsData(): Review[] {
  try {
    const data = fs.readFileSync(REVIEWS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading reviews data:', error);
    return [];
  }
}

export function writeReviewsData(reviews: Review[]): void {
  try {
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
  } catch (error) {
    console.error('Error writing reviews data:', error);
    throw new Error('Failed to write reviews data');
  }
} 