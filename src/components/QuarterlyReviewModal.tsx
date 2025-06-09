import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { loadQuarterlyReviews, type QuarterData } from '@/services/quarterlyService';
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface QuarterlyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
}

export const QuarterlyReviewModal: React.FC<QuarterlyReviewModalProps> = ({
  isOpen,
  onClose,
  quarter
}) => {
  const quarterData: QuarterData = loadQuarterlyReviews(quarter);

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>${quarter} Review - ${quarterData.reviewPeriod}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .review-container { max-width: 800px; margin: 0 auto; padding: 20px; }
            .review-header { text-align: center; margin-bottom: 30px; }
            .review-section { margin-bottom: 30px; }
            .review-card { border: 1px solid #ddd; padding: 20px; margin-bottom: 20px; border-radius: 8px; }
            .review-header-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .category-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
            .category-card { border: 1px solid #eee; padding: 15px; border-radius: 6px; }
            .goals-section { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
            .list-item { margin-bottom: 8px; }
            @media print {
              body { padding: 20px; }
              .review-container { max-width: 100%; }
            }
          </style>
        </head>
        <body>
          <div class="review-container">
            <div class="review-header">
              <h1>${quarter} Review - ${quarterData.reviewPeriod}</h1>
            </div>
            ${quarterData.reviews.map(review => `
              <div class="review-section">
                <div class="review-card">
                  <div class="review-header-info">
                    <div>
                      <h2>${review.employeeName}</h2>
                      <p>${review.position} - ${review.department}</p>
                    </div>
                    <div>
                      <p>Reviewer: ${review.reviewer}</p>
                      <p>Date: ${review.reviewDate}</p>
                    </div>
                  </div>
                  
                  <div class="category-grid">
                    ${Object.entries(review.categories).map(([category, data]) => `
                      <div class="category-card">
                        <h3>${category}</h3>
                        <p>Rating: ${data.rating}/5.0</p>
                        <p>${data.comments}</p>
                      </div>
                    `).join('')}
                  </div>

                  <div class="goals-section">
                    <div>
                      <h3>Achievements</h3>
                      <ul>
                        ${review.achievements.map(achievement => `
                          <li class="list-item">${achievement}</li>
                        `).join('')}
                      </ul>
                    </div>
                    <div>
                      <h3>Goals for Next ${quarter === 'Q4' ? 'Year' : 'Quarter'}</h3>
                      <ul>
                        ${(quarter === 'Q4' ? review.goalsForNextYear : review.goalsForNextQuarter)?.map(goal => `
                          <li class="list-item">${goal}</li>
                        `).join('')}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold">
              {quarter} Review - {quarterData.reviewPeriod}
            </DialogTitle>
            <Button
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print Review
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {quarterData.reviews.map((review) => (
            <div key={review.employeeId} className="border rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{review.employeeName}</h3>
                  <p className="text-gray-600">{review.position} - {review.department}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Reviewer: {review.reviewer}</p>
                  <p className="text-sm text-gray-500">Date: {review.reviewDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <h4 className="font-semibold mb-2">Overall Rating: {review.overallRating}/5.0</h4>
                </div>
                
                {Object.entries(review.categories).map(([category, data]) => (
                  <div key={category} className="border rounded p-3">
                    <h5 className="font-medium capitalize">{category}</h5>
                    <p className="text-sm text-gray-600">Rating: {data.rating}/5.0</p>
                    <p className="text-sm mt-1">{data.comments}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Achievements</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {review.achievements.map((achievement, index) => (
                      <li key={index} className="text-sm">{achievement}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Goals for Next {quarter === 'Q4' ? 'Year' : 'Quarter'}</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {(quarter === 'Q4' ? review.goalsForNextYear : review.goalsForNextQuarter)?.map((goal, index) => (
                      <li key={index} className="text-sm">{goal}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 