import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { loadQuarterlyReviews, type QuarterData } from '@/services/quarterlyService';

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {quarter} Review - {quarterData.reviewPeriod}
          </DialogTitle>
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