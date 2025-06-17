"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Printer, Download, Star, Award, Calendar, User, Building } from "lucide-react";
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
}

export default function PerformanceReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadEvaluation = async () => {
      try {
        const response = await fetch(`/api/performance-review/${id}`);
        if (!response.ok) throw new Error('Failed to fetch evaluation');
        const data = await response.json();
        setEvaluation(data);
      } catch (error) {
        console.error('Error loading evaluation:', error);
        toast.error('Failed to load evaluation details');
      } finally {
        setIsLoading(false);
      }
    };

    loadEvaluation();
  }, [id]);

  const handlePrint = () => {
    if (!evaluation) return;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Performance Review Summary</title>
            <style>
              @page {
                size: A4;
                margin: 1.2cm;
              }
              body {
                font-family: 'Segoe UI', Arial, sans-serif;
                font-size: 10pt;
                line-height: 1.4;
                margin: 0;
                padding: 0;
                color: #2d3748;
                background-color: #ffffff;
                max-width: 100%;
              }
              .header {
                text-align: center;
                margin-bottom: 25px;
                padding-bottom: 15px;
                border-bottom: 2px solid #e2e8f0;
              }
              h1 {
                font-size: 20pt;
                font-weight: 600;
                color: #1a365d;
                margin: 0 0 8px 0;
                letter-spacing: -0.5px;
              }
              .subtitle {
                font-size: 11pt;
                color: #4a5568;
                margin: 0;
              }
              h2 {
                font-size: 13pt;
                font-weight: 600;
                color: #2c5282;
                margin: 20px 0 12px 0;
                padding-bottom: 6px;
                border-bottom: 2px solid #e2e8f0;
              }
              .section {
                margin-bottom: 20px;
                page-break-inside: avoid;
                background-color: #ffffff;
                border-radius: 6px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                padding: 15px;
              }
              .employee-info {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                margin-bottom: 15px;
              }
              .info-item {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px;
                background-color: #f7fafc;
                border-radius: 4px;
              }
              .info-label {
                font-weight: 600;
                color: #4a5568;
                min-width: 110px;
                font-size: 9.5pt;
              }
              .info-value {
                color: #2d3748;
                font-size: 9.5pt;
              }
              .score-section {
                margin: 15px 0;
                page-break-inside: avoid;
                background-color: #f7fafc;
                border-radius: 6px;
                padding: 12px;
              }
              .score-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                padding-bottom: 6px;
                border-bottom: 1px solid #e2e8f0;
              }
              .score-category {
                font-weight: 600;
                color: #2c5282;
                font-size: 10pt;
              }
              .score-value {
                font-weight: 600;
                color: #2d3748;
                background-color: #ebf8ff;
                padding: 3px 10px;
                border-radius: 4px;
                font-size: 9.5pt;
              }
              .comments {
                margin-top: 12px;
                padding: 12px;
                background-color: #ffffff;
                border-radius: 4px;
                border: 1px solid #e2e8f0;
                font-size: 9.5pt;
              }
              .comments-label {
                font-weight: 600;
                color: #4a5568;
                margin-bottom: 6px;
                font-size: 9.5pt;
              }
              .total-score {
                text-align: center;
                font-size: 14pt;
                font-weight: 600;
                margin: 25px 0;
                padding: 15px;
                background: linear-gradient(135deg, #2b6cb0 0%, #2c5282 100%);
                color: white;
                border-radius: 6px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .rating-scale {
                display: flex;
                justify-content: space-between;
                margin: 15px 0;
                padding: 12px;
                background-color: #f7fafc;
                border-radius: 6px;
              }
              .rating-item {
                text-align: center;
                padding: 8px;
                flex: 1;
              }
              .rating-value {
                font-weight: 600;
                color: #2c5282;
                margin-bottom: 4px;
                font-size: 9.5pt;
              }
              .rating-label {
                font-size: 8.5pt;
                color: #4a5568;
              }
              .page-break {
                page-break-before: always;
              }
              .two-column {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
              }
              .full-width {
                grid-column: 1 / -1;
              }
              @media print {
                .no-print {
                  display: none;
                }
                body {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                .section {
                  box-shadow: none;
                  border: 1px solid #e2e8f0;
                }
                .page-break {
                  margin-top: 20px;
                }
              }
              .employee-section {
                background: linear-gradient(to right, #f8fafc, #ffffff);
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 25px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
              }
              .employee-header {
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 2px solid #e2e8f0;
              }
              .employee-title {
                font-size: 16pt;
                font-weight: 600;
                color: #1a365d;
                margin: 0;
              }
              .employee-subtitle {
                font-size: 11pt;
                color: #4a5568;
                margin: 5px 0 0 0;
              }
              .employee-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
              }
              .info-group {
                background-color: #ffffff;
                border-radius: 6px;
                padding: 12px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.05);
              }
              .info-group-title {
                font-size: 10pt;
                font-weight: 600;
                color: #2c5282;
                margin-bottom: 10px;
                padding-bottom: 5px;
                border-bottom: 1px solid #e2e8f0;
              }
              .info-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px;
                background-color: #f8fafc;
                border-radius: 4px;
                margin-bottom: 8px;
              }
              .info-item:last-child {
                margin-bottom: 0;
              }
              .info-label {
                font-weight: 600;
                color: #4a5568;
                min-width: 120px;
                font-size: 9.5pt;
              }
              .info-value {
                color: #2d3748;
                font-size: 9.5pt;
                flex: 1;
              }
              .status-badge {
                display: inline-block;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 9pt;
                font-weight: 500;
                background-color: #e6fffa;
                color: #2c7a7b;
              }
              .status-badge.completed {
                background-color: #c6f6d5;
                color: #2f855a;
              }
              .status-badge.pending {
                background-color: #fefcbf;
                color: #975a16;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Performance Review Summary</h1>
              <p class="subtitle">${evaluation.ForRegular}</p>
            </div>
            
            <div class="employee-section">
              <div class="employee-header">
                <div>
                  <h2 class="employee-title">${evaluation.employeeName}</h2>
                  <p class="employee-subtitle">${evaluation.department}</p>
                </div>
              </div>
              
              <div class="employee-grid">
                <div class="info-group">
                  <div class="info-group-title">Personal Information</div>
                  <div class="info-item">
                    <span class="info-label">Employee ID:</span>
                    <span class="info-value">${evaluation.employeeId || 'N/A'}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Department:</span>
                    <span class="info-value">${evaluation.department}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Review Period:</span>
                    <span class="info-value">${evaluation.ForRegular}</span>
                  </div>
                </div>

                <div class="info-group">
                  <div class="info-group-title">Review Details</div>
                  <div class="info-item">
                    <span class="info-label">Status:</span>
                    <span class="info-value">
                      <span class="status-badge ${evaluation.status.toLowerCase()}">${evaluation.status}</span>
                    </span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Last Modified:</span>
                    <span class="info-value">${evaluation.lastModified}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="section">
              <h2>Performance Scores</h2>
              <div class="two-column">
                ${evaluation.scores.map(score => `
                  <div class="score-section">
                    <div class="score-header">
                      <span class="score-category">${score.category}</span>
                      <span class="score-value">Score: ${score.score}/5 (Weight: ${score.weight}%)</span>
                    </div>
                    <div class="comments">
                      <div class="comments-label">Comments:</div>
                      ${score.comments}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="rating-scale">
              <div class="rating-item">
                <div class="rating-value">1-1.5</div>
                <div class="rating-label">Basic (BS)</div>
              </div>
              <div class="rating-item">
                <div class="rating-value">1.6-2.5</div>
                <div class="rating-label">Intermediate (ID)</div>
              </div>
              <div class="rating-item">
                <div class="rating-value">2.6-3.5</div>
                <div class="rating-label">Upper Intermediate (UI)</div>
              </div>
              <div class="rating-item">
                <div class="rating-value">3.6-4.5</div>
                <div class="rating-label">Advanced (AD)</div>
              </div>
              <div class="rating-item">
                <div class="rating-value">4.6-5.0</div>
                <div class="rating-label">Expert (EX)</div>
              </div>
            </div>

            <div class="total-score">
              Total Score: ${evaluation.totalScore.toFixed(2)}/5.00
            </div>

            <div class="section">
              <h2>Additional Comments</h2>
              <div class="comments">
                ${evaluation.comments}
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
    }
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
${evaluation.scores.map(score => `
${score.category}
Score: ${score.score}/5
Weight: ${score.weight}%
Weighted Score: ${(score.score * score.weight / 100).toFixed(2)}
Comments: ${score.comments}
`).join('\n')}

Total Score: ${evaluation.totalScore.toFixed(2)}

Additional Comments
------------------
${evaluation.comments}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
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
        <h1 className="text-2xl font-bold text-red-600 mb-4">Evaluation Not Found</h1>
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
            <h1 className="text-3xl font-bold text-gray-800">Performance Review Summary</h1>
            <div className="flex items-center gap-2">
              <Award className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-semibold text-gray-600">Official Document</span>
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
                  <span className="text-gray-800">{evaluation.employeeName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-600">Department:</span>
                  <span className="text-gray-800">{evaluation.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-600">For Regular:</span>
                  <span className="text-gray-800">{evaluation.ForRegular}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Status:</span>
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    {evaluation.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Last Modified:</span>
                  <span className="text-gray-800">{evaluation.lastModified}</span>
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
                    <span className="font-medium text-gray-600">Total Score</span>
                    <span className={`font-bold ${getScoreColor(evaluation.totalScore)}`}>
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
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Performance Scores</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {evaluation.scores.map((score, index) => (
                  <Card key={index} className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-800">{score.category}</h3>
                      <span className={`font-bold ${getScoreColor(score.score)}`}>
                        {score.score}/5
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mb-3">
                      <span>Weight: {score.weight}%</span>
                      <span>Weighted: {(score.score * score.weight / 100).toFixed(2)}</span>
                    </div>
                    <Progress 
                      value={(score.score / 5) * 100} 
                      className={`h-2 mb-3 ${getProgressColor(score.score)}`}
                    />
                    {score.comments && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Comments:</span> {score.comments}
                        </p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Additional Comments</h2>
              <Card className="p-6 bg-white shadow-sm">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {evaluation.comments}
                </p>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 