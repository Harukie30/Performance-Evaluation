"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Printer,
  Download,
  Star,
  Award,
  Calendar,
  User,
  Building,
} from "lucide-react";
import { toast } from "sonner";
import { use } from "react";

interface EvaluationResult {
  employeeId: string;
  employeeName: string;
  department: string;
  ForRegular: string;
  status: string;
  lastModified: string;
  scores: {
    category: string;
    score: number;
    weight: number;
    comments: string;
  }[];
  totalScore: number;
  comments: string;
  keyAchievements?: string[];
  areasForImprovement?: string[];
  additionalComments?: string;
}

export default function PerformanceReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadEvaluation = async () => {
      try {
        const response = await fetch(`/api/performance-review/${id}`);
        if (!response.ok) throw new Error("Failed to fetch evaluation");
        const data = await response.json();
        setEvaluation(data);
      } catch (error) {
        console.error("Error loading evaluation:", error);
        toast.error("Failed to load evaluation details");
      } finally {
        setIsLoading(false);
      }
    };

    loadEvaluation();
  }, [id]);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Performance Review - ${
            evaluation?.employeeName || "Employee"
          }</title>
          <style>
            @media print {
              @page {
                size: A4;
                margin: 1.5cm;
              }
              
              body {
                font-family: 'Geist', sans-serif;
                font-size: 11pt;
                line-height: 1.4;
                color: #000;
                background: #fff;
              }

              .print-header {
                text-align: center;
                margin-bottom: 2rem;
                padding-bottom: 1rem;
                border-bottom: 2px solid #000;
              }

              .employee-section {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
                margin-bottom: 2rem;
                padding: 1rem;
                border: 1px solid #ddd;
                border-radius: 4px;
              }

              .section-title {
                font-size: 14pt;
                font-weight: bold;
                margin: 1.5rem 0 1rem;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid #000;
              }

              .rating-scale {
                margin: 1rem 0;
                padding: 1rem;
                background: #f8f9fa;
                border: 1px solid #ddd;
              }

              .performance-category {
                margin-bottom: 1.5rem;
                page-break-inside: avoid;
              }

              .performance-category h3 {
                font-size: 12pt;
                margin-bottom: 0.5rem;
                color: #1a1a1a;
              }

              table {
                width: 100%;
                border-collapse: collapse;
                margin: 1rem 0;
              }

              th, td {
                border: 1px solid #ddd;
                padding: 0.5rem;
                text-align: left;
              }

              th {
                background: #f8f9fa;
                font-weight: bold;
              }

              .no-print {
                display: none;
              }

              .page-break {
                page-break-before: always;
              }

              .signature-section {
                margin-top: 3rem;
                page-break-inside: avoid;
              }

              .signature-line {
                border-top: 1px solid #000;
                margin-top: 3rem;
                padding-top: 0.5rem;
              }
            </style>
          </head>
          <body>
            <div class="print-header">
              <h1>Performance Review</h1>
              <p>${evaluation?.employeeName || "Employee"} - ${
      evaluation?.department || "Department"
    }</p>
            </div>

            <div class="employee-section">
              <div>
                <h3>Personal Information</h3>
                <p><strong>Employee ID:</strong> ${
                  evaluation?.employeeId || "N/A"
                }</p>
                <p><strong>Department:</strong> ${
                  evaluation?.department || "N/A"
                }</p>
              </div>
              <div>
                <h3>Review Details</h3>
                <p><strong>Review Period:</strong> ${
                  evaluation?.ForRegular || "N/A"
                }</p>
                <p><strong>Status:</strong> ${evaluation?.status || "N/A"}</p>
                <p><strong>Last Modified:</strong> ${
                  evaluation?.lastModified
                    ? new Date(evaluation.lastModified).toLocaleString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                          timeZone: "Asia/Manila",
                        }
                      )
                    : "N/A"
                }</p>
              </div>
            </div>

            <div class="section-title">Overall Rating</div>
            <div class="rating-scale">
              <p><strong>Overall Score:</strong> ${
                evaluation?.totalScore.toFixed(2) || "N/A"
              }</p>
              <p><strong>Rating Scale:</strong> 1-5 (1: Needs Improvement, 5: Outstanding)</p>
            </div>

            <div class="section-title">Performance Metrics</div>
            ${
              evaluation?.scores
                .map(
                  (score) => `
              <div class="performance-category">
                <h3>${score.category || "N/A"}</h3>
                <p><strong>Score:</strong> ${score.score || "N/A"}</p>
                <p><strong>Comments:</strong> ${score.comments || "N/A"}</p>
              </div>
            `
                )
                .join("") || "No performance metrics available"
            }

            <div class="section-title">Key Achievements</div>
            <ul>
              ${
                evaluation?.keyAchievements?.length
                  ? evaluation.keyAchievements
                      .map(
                        (achievement) => `
                <li>${achievement || "N/A"}</li>
              `
                      )
                      .join("")
                  : "No key achievements recorded"
              }
            </ul>

            <div class="section-title">Areas for Improvement</div>
            <ul>
              ${
                evaluation?.areasForImprovement?.length
                  ? evaluation.areasForImprovement
                      .map(
                        (area) => `
                <li>${area || "N/A"}</li>
              `
                      )
                      .join("")
                  : "No areas for improvement recorded"
              }
            </ul>

            <div class="section-title">Evaluator Comments</div>
            <p>${evaluation?.comments || "No evaluator comments available"}</p>

            <div class="signature-section">
              <div class="signature-line">
                <p><strong>Evaluator Signature</strong></p>
                <p>Date: _________________</p>
              </div>
              <div class="signature-line">
                <p><strong>Employee Signature</strong></p>
                <p>Date: _________________</p>
              </div>
            </div>
          </body>
        </html>
      `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleDownload = () => {
    if (!evaluation) return;

    const content = `
Performance Review Summary
=========================

Employee Information
-------------------
Name: ${evaluation.employeeName}
Department: ${evaluation.department}
Review Period: ${evaluation.ForRegular}
Status: ${evaluation.status}
Last Modified: ${evaluation.lastModified}

Performance Scores
-----------------
${evaluation.scores
  .map(
    (score) => `
${score.category}
Score: ${score.score}/5
Weight: ${score.weight}%
Weighted Score: ${((score.score * score.weight) / 100).toFixed(2)}
Comments: ${score.comments}
`
  )
  .join("\n")}

Total Score: ${evaluation.totalScore.toFixed(2)}

Additional Comments
------------------
${evaluation.comments}
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `performance-review-${evaluation.employeeName}-${evaluation.ForRegular}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Evaluation Not Found
        </h1>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "text-emerald-600";
    if (score >= 4) return "text-green-600";
    if (score >= 3.5) return "text-blue-600";
    if (score >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 4.5) return "bg-emerald-500";
    if (score >= 4) return "bg-green-500";
    if (score >= 3.5) return "bg-blue-500";
    if (score >= 3) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 hover:bg-yellow-400 hover:-text-black bg-blue-500 text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex gap-4">
            <Button
              onClick={handlePrint}
              className="flex items-center gap-2 hover:bg-yellow-400 hover:text-black bg-blue-500 text-white"
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button
              onClick={handleDownload}
              className="flex items-center gap-2 hover:bg-yellow-400 hover:text-black bg-blue-500 text-white"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        <Card className="p-8 mb-8 shadow-lg border-0 bg-blue-200">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Performance Review Summary
            </h1>
            <div className="flex items-center gap-2">
              <Award className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-semibold text-gray-600">
                Official Document
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card className="p-6 bg-white shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                Employee Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Name:</span>
                  <span className="text-gray-800">
                    {evaluation.employeeName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-600">Department:</span>
                  <span className="text-gray-800">{evaluation.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-600">
                    For Regular:
                  </span>
                  <span className="text-gray-800">{evaluation.ForRegular}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Status:</span>
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    {evaluation.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">
                    Last Modified:
                  </span>
                  <span className="text-gray-800">
                    {evaluation.lastModified ? (
                      <div className="flex flex-col">
                        <span>
                          {new Date(evaluation.lastModified).toLocaleString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                              timeZone: "Asia/Manila",
                            }
                          )}{" "}
                          (Philippine Time)
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(evaluation.lastModified).toLocaleString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                              timeZone: "UTC",
                            }
                          )}{" "}
                          (UTC)
                        </span>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Overall Performance
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-600">
                      Total Score
                    </span>
                    <span
                      className={`font-bold ${getScoreColor(
                        evaluation.totalScore
                      )}`}
                    >
                      {evaluation.totalScore.toFixed(2)}/5.00
                    </span>
                  </div>
                  <Progress
                    value={(evaluation.totalScore / 5) * 100}
                    className={`h-2 ${getProgressColor(evaluation.totalScore)}`}
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Performance Scores
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {evaluation.scores.map((score, index) => (
                  <Card
                    key={index}
                    className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-800">
                        {score.category}
                      </h3>
                      <span
                        className={`font-bold ${getScoreColor(score.score)}`}
                      >
                        {score.score}/5
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mb-3">
                      <span>Weight: {score.weight}%</span>
                      <span>
                        Weighted:{" "}
                        {((score.score * score.weight) / 100).toFixed(2)}
                      </span>
                    </div>
                    <Progress
                      value={(score.score / 5) * 100}
                      className={`h-2 mb-3 ${getProgressColor(score.score)}`}
                    />
                    {score.comments && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Comments:</span>{" "}
                          {score.comments}
                        </p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Additional Comments
              </h2>
              <Card className="p-6 bg-white shadow-sm">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {evaluation.comments}
                </p>
              </Card>
            </div>

            {/* Priority Areas For Improvement */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Priority Areas For Improvement
              </h2>
              <Card className="p-6 bg-white shadow-sm">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {evaluation.areasForImprovement ||
                    "No priority areas for improvement specified."}
                </p>
              </Card>
            </div>

            {/* Remarks */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Remarks
              </h2>
              <Card className="p-6 bg-white shadow-sm">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {evaluation.additionalComments ||
                    "No additional remarks provided."}
                </p>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
