"use client";
import { CheckCircle2, AlertCircle, TrendingUp, Info, Printer, User2, Briefcase, Building2, CalendarDays, BadgeCheck } from "lucide-react";
import { useRef } from "react";
import RatingScale from "@/app/constants/rating-scale";

// Utility for consistent date formatting
function formatDate(dateStr?: string) {
  if (!dateStr) return '--';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '--';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function PerformanceSummaryClient({ evaluation }: { evaluation: any }) {
  const summaryRef = useRef<HTMLDivElement>(null);
  const handlePrint = () => {
    window.print();
  };

  // Compute finalRating if not present
  const finalRating = evaluation.finalRating ?? (typeof evaluation.totalScore === 'number' ? RatingScale(evaluation.totalScore) : '--');

  return (
    <div className="max-w-2xl mx-auto">
      {/* Print Button */}
      <div className="flex justify-end mb-4 print:hidden">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
        >
          <Printer className="h-5 w-5" /> Print Summary
        </button>
      </div>
      {/* Summary Card Section (printable) */}
      <div ref={summaryRef} id="print-summary">
        {/* Employee Info Section */}
        <div className="mb-8 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Employee Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">Basic Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-gray-600 font-medium w-32">Employee Name:</span>
                    <span className="text-gray-800">{evaluation.employeeName || '--'}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-600 font-medium w-32">Employee ID:</span>
                    <span className="text-gray-800">{evaluation.employeeId || '--'}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-600 font-medium w-32">Position:</span>
                    <span className="text-gray-800">{evaluation.position || '--'}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-600 font-medium w-32">Department:</span>
                    <span className="text-gray-800">{evaluation.department || '--'}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-600 font-medium w-32">Email:</span>
                    <span className="text-gray-800">{evaluation.email || '--'}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">Additional Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-gray-600 font-medium w-32">Date Hired:</span>
                    <span className="text-gray-800">{formatDate(evaluation.datehired)}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-600 font-medium w-32">Review Date:</span>
                    <span className="text-gray-800">{formatDate(evaluation.reviewDate)}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-600 font-medium w-32">Supervisor:</span>
                    <span className="text-gray-800">{evaluation.immediateSupervisorInput || '--'}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-600 font-medium w-32">Coverage:</span>
                    <span className="text-gray-800">{evaluation.performanceCoverage || '--'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-8 mb-10 transition-shadow hover:shadow-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-1">
                Final Score
                <Info className="h-4 w-4 text-gray-400" aria-label="The overall score out of 5.0" />
              </div>
              <div className="text-4xl font-extrabold text-blue-700 drop-shadow-sm">{evaluation.totalScore?.toFixed(2) ?? '--'}</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-1">
                Final Rating
                <Info className="h-4 w-4 text-gray-400" aria-label="Performance level based on the score" />
              </div>
              <div className="text-lg font-extrabold text-black drop-shadow-sm">{finalRating}</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-1">
                Final Percentage
                <Info className="h-4 w-4 text-gray-400" aria-label="Score as a percentage of 5.0" />
              </div>
              <div className="text-3xl font-extrabold text-purple-600 drop-shadow-sm">{evaluation.finalPercentage ? `${evaluation.finalPercentage}%` : evaluation.totalScore ? `${((evaluation.totalScore / 5) * 100).toFixed(2)}%` : '--'}</div>
            </div>
          </div>

          <hr className="my-6 border-blue-100" />

          {evaluation.scores && evaluation.scores.length > 0 && (
            <div className="mb-8">
              <div className="font-semibold text-gray-700 mb-2 flex items-center gap-1">
                Category Scores
                <Info className="h-4 w-4 text-gray-400" aria-label="Breakdown of scores by category" />
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border rounded-lg shadow-sm">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Category</th>
                      <th className="px-4 py-2 text-center">Score</th>
                      <th className="px-4 py-2 text-center">Weight</th>
                      <th className="px-4 py-2 text-center">Weighted Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluation.scores.map((score: any, idx: number) => (
                      <tr key={idx} className="border-b last:border-b-0 hover:bg-blue-50/60 transition-colors">
                        <td className="px-4 py-2">{score.category}</td>
                        <td className="px-4 py-2 text-center font-semibold text-blue-700">{score.score}</td>
                        <td className="px-4 py-2 text-center">{score.weight}%</td>
                        <td className="px-4 py-2 text-center font-semibold text-purple-700">{((score.score * score.weight) / 100).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="font-bold bg-blue-100">
                      <td colSpan={3} className="px-4 py-2 text-right">Total Score</td>
                      <td className="px-4 py-2 text-center text-blue-900">{evaluation.totalScore?.toFixed(2) ?? '--'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <hr className="my-6 border-blue-100" />

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="font-semibold text-gray-700 mb-1">Priority Areas for Improvement</div>
              <div className="min-h-[60px] bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-gray-800 shadow-inner">
                {evaluation.areasForImprovement || 'No priority areas for improvement specified.'}
              </div>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-1">Remarks</div>
              <div className="min-h-[60px] bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-800 shadow-inner">
                {evaluation.additionalComments || evaluation.comments || 'No additional remarks provided.'}
              </div>
            </div>
          </div>

          {/* Rating Scale Legend */}
          <hr className="my-8 border-blue-100" />
          <div className="mt-6">
            <div className="font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-400" aria-label="Rating Scale" /> Rating Scale
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div><span className="font-bold text-blue-900">5</span> - Outstanding: Exceptional performance; consistently exceeds expectations</div>
              <div><span className="font-bold text-blue-900">4</span> - Exceeds Expectations: Highly competent; demonstrates proficiency in role requirements</div>
              <div><span className="font-bold text-blue-900">3</span> - Meets Expectations: Basic competence achieved; performance meets the expectations for the role</div>
              <div><span className="font-bold text-blue-900">2</span> - Needs Improvement: Performance is below the desired level in certain aspects</div>
              <div><span className="font-bold text-blue-900">1</span> - Unsatisfactory: Performance falls below expectations; fails to meet the minimum standards</div>
            </div>
          </div>
        </div>
      </div>
      {/* Print styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #print-summary, #print-summary * {
            visibility: visible !important;
          }
          #print-summary {
            position: absolute !important;
            left: 0; top: 0; width: 100vw; min-height: 100vh;
            background: white !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
} 