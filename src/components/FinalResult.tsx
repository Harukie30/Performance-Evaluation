import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RatingScale from "@/app/constants/rating-scale";
import employeeNames from "../data/users.json";
import { PerformanceFormValues } from "@/lib/validation-schema/form-schema";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm, ControllerRenderProps, Control, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "@/lib/validation-schema/form-schema";
import { toast } from "react-hot-toast";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { reviewService } from "@/services/reviewService";

interface Employee {
  id: number;
  name: string;
  email: string;
  position?: {
    title: string;
  };
}

interface FinalResultsProps {
  onEdit: (part: number) => void;
  form: PerformanceFormValues;
}

export default function FinalResults({
  onEdit,
  form: initialForm,
}: FinalResultsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const router = useRouter();

  const form = useForm<PerformanceFormValues>({
    resolver: zodResolver(formSchema) as unknown as Resolver<PerformanceFormValues>,
    defaultValues: {
      ...initialForm,
      areasForImprovement: initialForm.areasForImprovement || "",
      ForProbationary: initialForm.ForProbationary as "3 months" | "5 months" | undefined,
    },
  });

  // Calculate averages for each part
  const workOutputAvg = (
    (Number(initialForm.jobKnowledge || 0) +
      Number(initialForm.qualityOfWork || 0) +
      Number(initialForm.promptnessOfWork || 0)) /
    3
  ).toFixed(2);

  const qualityOfWorkAvg = (
    (Number(initialForm.qualityMeetsStandards || 0) +
      Number(initialForm.qualityTimeliness || 0) +
      Number(initialForm.qualityWorkOutputVolume || 0) +
      Number(initialForm.qualityConsistency || 0) +
      Number(initialForm.qualityJobTargets || 0)) /
    5
  ).toFixed(2);

  const adaptabilityAvg = (
    (Number(initialForm.adaptabilityOpenness || 0) +
      Number(initialForm.adaptabilityFlexibility || 0) +
      Number(initialForm.adaptabilityResilience || 0)) /
    3
  ).toFixed(2);

  const teamworkAvg = (
    (Number(initialForm.activeParticipationScore || 0) +
      Number(initialForm.positiveTeamCultureScore || 0) +
      Number(initialForm.effectiveCommunicationScore || 0)) /
    3
  ).toFixed(2);

  const reliabilityAvg = (
    (Number(initialForm.consistentAttendanceScore || 0) +
      Number(initialForm.punctualityScore || 0) +
      Number(initialForm.followsThroughScore || 0) +
      Number(initialForm.reliableHandlingScore || 0)) /
    4
  ).toFixed(2);

  const ethicalAvg = (
    (Number(initialForm.ethicalFollowsPoliciesScore || 0) +
      Number(initialForm.ethicalProfessionalismScore || 0) +
      Number(initialForm.ethicalAccountabilityScore || 0) +
      Number(initialForm.ethicalRespectScore || 0)) /
    4
  ).toFixed(2);

  const customerServiceAvg = (
    (Number(initialForm.customerListeningScore || 0) +
      Number(initialForm.customerProblemSolvingScore || 0) +
      Number(initialForm.customerProductKnowledgeScore || 0) +
      Number(initialForm.customerProfessionalAttitudeScore || 0) +
      Number(initialForm.customerTimelyResolutionScore || 0)) /
    5
  ).toFixed(2);

  // Calculate weighted scores
  const weightedScores = {
    work: Number(workOutputAvg) * 0.2,
    quality: Number(qualityOfWorkAvg) * 0.2,
    adaptability: Number(adaptabilityAvg) * 0.1,
    teamwork: Number(teamworkAvg) * 0.1,
    reliability: Number(reliabilityAvg) * 0.05,
    ethical: Number(ethicalAvg) * 0.05,
    customerService: Number(customerServiceAvg) * 0.3,
  };

  // Calculate total score
  const totalScore = (
    weightedScores.work +
    weightedScores.quality +
    weightedScores.adaptability +
    weightedScores.teamwork +
    weightedScores.reliability +
    weightedScores.ethical +
    weightedScores.customerService
  ).toFixed(2);

  // Get the final rating
  const finalRating = RatingScale(Number(totalScore));
  const employeeName = employeeNames.find(
    (employee: Employee) => employee.id === initialForm.employeeName
  );

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Performance Review Results</title>
          <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Quicksand', sans-serif;
              padding: 10px;
              margin: 0 auto;
              font-size: 10pt;
            }
            h1, h2, h3 {
              text-align: center;
              margin-bottom: 10px;
            }
            .section-title {
              font-size: 10pt;
              font-weight: bold;
              margin-top: 20px;
              margin-bottom: 10px;
              border-bottom: 1px solid #000;
              padding-bottom: 5px;
            }
            .employee-info,
            .rating-scale,
            .performance-category {
              margin-bottom: 20px;
              border: 1px solid #ccc;
              padding: 10px;
              page-break-inside: avoid;
            }
            .employee-details-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th,
            td {
              border: 1px solid #ccc;
              padding: 8px;
              text-align: left;
              vertical-align: top;
            }
            th {
              background-color: #f0f0f0;
              font-weight: bold;
              text-align: center;
            }
            .category-header td {
              background-color: #e6e6e6;
              font-weight: bold;
              text-align: left;
            }
            .total-row td {
              background-color: #e6f3ff;
              font-weight: bold;
            }
            .text-center {
              text-align: center;
            }
            .final-score {
              text-align: center;
              margin-top: 30px;
              padding: 15px;
              border: 2px solid #000;
              background-color: #f8f8f8;
              font-size: 14pt;
              font-weight: bold;
              page-break-inside: avoid;
            }
            @media print {
              body {
                padding: 0;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <h1>Performance Review Form (BRANCHES)</h1>
          <h2>Rank and File | I & II</h2>

          <!-- Purpose Section -->
          <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ccc;">
            <div style="font-size: 10pt; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #000; padding-bottom: 5px;">PURPOSE</div>
            <p style="font-size: 10pt;">
              Each employee is subject to a performance review based on actual
              responsibilities and behaviors exhibited. These are essential in the
              achievement of goals and for alignment with company values and
              policies. The results of this review will be the basis for changes
              in employment status, promotions, salary adjustments, and/or
              computations of yearly bonus (among other rewards). NOTE: For
              probationary employees, a minimum score of 55% is required for
              regularization.
            </p>
          </div>

          <!-- Instructions Section -->
          <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ccc; background-color: #fffacd;">
            <div style="font-size: 10pt; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #000; padding-bottom: 5px;">INSTRUCTIONS</div>
            <p style="font-size: 10pt;">Only put answers in the YELLOW HIGHLIGHTED CELLS.</p>
          </div>

          <!-- Rating Scale Text Description -->
          <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ccc;">
            <div style="font-size: 10pt; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #000; padding-bottom: 5px;">RATING SCALE DESCRIPTION</div>
            <p style="font-size: 10pt; margin-bottom: 5px;">
              <strong style="font-weight: bold;">1 to 1.5 Basic (BS).</strong> Performance is poor and very far to achieve goals.
            </p>
            <p style="font-size: 10pt; margin-bottom: 5px;">
              <strong style="font-weight: bold;">1.6-2.5 Intermediate (ID).</strong> Performance needs improvement and almost to achieve goals.
            </p>
            <p style="font-size: 10pt; margin-bottom: 5px;">
              <strong style="font-weight: bold;">2.6-3.5 Upper Intermediate (UI).</strong> Performance is average and break-even to achieve goals.
            </p>
            <p style="font-size: 10pt; margin-bottom: 5px;">
              <strong style="font-weight: bold;">3.6-4.5 Advanced (AD).</strong> Performance exceeds target goals.
            </p>
            <p style="font-size: 10pt;">
              <strong style="font-weight: bold;">4.6-5.0 Expert (EX).</strong> Performance and goals achievement is exceptional.
            </p>
          </div>

          <div class="employee-info" style="margin-bottom: 20px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            <div class="section-title" style="background-color: #f3f4f6; padding: 12px 16px; border-bottom: 1px solid #e5e7eb; font-weight: bold; font-size: 14pt;">
              EMPLOYEE INFORMATION
            </div>
            <div class="employee-details-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding: 16px;">
              <div style="background-color: #f9fafb; padding: 16px; border-radius: 6px;">
                <h3 style="font-size: 11pt; font-weight: 600; color: #4b5563; margin-bottom: 12px;">Basic Information</h3>
                <div style="display: grid; gap: 8px;">
                  <p><strong style="color: #4b5563; width: 120px; display: inline-block;">Employee Name:</strong> ${employeeName?.name || ""}</p>
                  <p><strong style="color: #4b5563; width: 120px; display: inline-block;">Employee ID:</strong> ${initialForm.employeeId || ""}</p>
                  <p><strong style="color: #4b5563; width: 120px; display: inline-block;">Position:</strong> ${employeeName?.position?.title || initialForm.position || ""}</p>
                  <p><strong style="color: #4b5563; width: 120px; display: inline-block;">Department:</strong> ${initialForm.department || ""}</p>
                  <p><strong style="color: #4b5563; width: 120px; display: inline-block;">Email:</strong> ${employeeName?.email || ""}</p>
                </div>
              </div>
              <div style="background-color: #f9fafb; padding: 16px; border-radius: 6px;">
                <h3 style="font-size: 11pt; font-weight: 600; color: #4b5563; margin-bottom: 12px;">Review Details</h3>
                <div style="display: grid; gap: 8px;">
                  <p><strong style="color: #4b5563; width: 120px; display: inline-block;">Review Type:</strong> ${initialForm.reviewType || ""}</p>
                  ${initialForm.reviewType === "quarterly" ? `
                    <p><strong style="color: #4b5563; width: 120px; display: inline-block;">For Regular:</strong> ${initialForm.ForRegular || ""}</p>
                  ` : ''}
                  ${initialForm.reviewType === "probationary" ? `
                    <p><strong style="color: #4b5563; width: 120px; display: inline-block;">For Probationary:</strong> ${initialForm.ForProbationary || ""}</p>
                  ` : ''}
                  ${initialForm.reviewType === "annual" ? `
                    <p><strong style="color: #4b5563; width: 120px; display: inline-block;">Annual Review:</strong> ${getCurrentQuarter()}</p>
                    ${initialForm.otherReviewType ? `
                      <p><strong style="color: #4b5563; width: 120px; display: inline-block;">Review Type:</strong> ${initialForm.otherReviewType}</p>
                    ` : ''}
                    ${initialForm.otherReviewDetails ? `
                      <p><strong style="color: #4b5563; width: 120px; display: inline-block;">Review Details:</strong> ${initialForm.otherReviewDetails}</p>
                    ` : ''}
                  ` : ''}
                </div>
              </div>
              <div style="background-color: #f9fafb; padding: 16px; border-radius: 6px; grid-column: span 2;">
                <h3 style="font-size: 11pt; font-weight: 600; color: #4b5563; margin-bottom: 12px;">Additional Information</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                  <p><strong style="color: #4b5563; width: 120px; display: inline-block;">Date Hired:</strong> ${
                    initialForm.datehired
                      ? new Date(initialForm.datehired).toLocaleDateString()
                      : ""
                  }</p>
                  <p><strong style="color: #4b5563; width: 120px; display: inline-block;">Review Date:</strong> ${
                    initialForm.reviewDate
                      ? new Date(initialForm.reviewDate).toLocaleDateString()
                      : ""
                  }</p>
                  <p><strong style="color: #4b5563; width: 120px; display: inline-block;">Supervisor:</strong> ${initialForm.immediateSupervisorInput || ""}</p>
                  <p><strong style="color: #4b5563; width: 120px; display: inline-block;">Coverage:</strong> ${initialForm.performanceCoverage || ""}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="rating-scale">
            <div class="section-title">RATING SCALE</div>
            <table>
              <thead>
                <tr>
                  <th>1 (Unsatisfactory)</th>
                  <th>2 (Needs Improvement)</th>
                  <th>3 (Meets Expectations)</th>
                  <th>4 (Exceeds Expectations)</th>
                  <th>5 (Outstanding)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Performance falls below expectations; Fails to meet the minimum standards</td>
                  <td>Performance is below the desired level in certain aspects</td>
                  <td>Basic competence achieved; Performance meets the expectations for the role</td>
                  <td>Highly competent; Demonstrates proficiency in role requirements</td>
                  <td>Exceptional performance; Consistently exceeds expectations</td>
                </tr>
              </tbody>
            </table>
            <p>Ratings will be made on a scale of 1-5. Choose your rating from the drop down option. Make use of the guide below when rating each employee.</p>
          </div>

          <div class="performance-category">
            <div class="section-title">I. JOB KNOWLEDGE (60%)</div>
            <p>To assess how well the employee is performing the routine and other related assigned tasks. Please indicate your appropriate rating and score.</p>
            <table>
              <thead>
                <tr>
                  <th style="width: 30%">Behavioral Indicators</th>
                  <th style="width: 30%">Example</th>
                  <th style="width: 10%">Score</th>
                  <th style="width: 10%">Rating</th>
                  <th style="width: 20%">Explanation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mastery in Core Competencies and Job Understanding (L.E.A.D.E.R.)</td>
                  <td>Exhibits mastery in essential skills and competencies required for the role. Displays a deep understanding of job responsibilities and requirements.</td>
                  <td class="text-center">${initialForm.jobKnowledge || 0}</td>
                  <td class="text-center">${RatingScale(
                    Number(initialForm.jobKnowledge || 0)
                  )}</td>
                  <td>${initialForm.jobKnowledgeComments || ""}</td>
                </tr>
                <tr>
                  <td>Keeps Documentation Updated</td>
                  <td>Completes assigned tasks and responsibilities within the required timeframe. Demonstrates reliability in meeting deadlines.</td>
                  <td class="text-center">${
                    initialForm.promptnessOfWork || 0
                  }</td>
                  <td class="text-center">${RatingScale(
                    Number(initialForm.promptnessOfWork || 0)
                  )}</td>
                  <td>${initialForm.promptnessofworkComments || ""}</td>
                </tr>
                <tr>
                  <td>Problem Solving</td>
                  <td>Produces work that meets or exceeds quality standards. Pays attention to detail and strives for excellence in all tasks.</td>
                  <td class="text-center">${initialForm.qualityOfWork || 0}</td>
                  <td class="text-center">${RatingScale(
                    Number(initialForm.qualityOfWork || 0)
                  )}</td>
                  <td>${initialForm.qualityofworkComments || ""}</td>
                </tr>
                <tr class="category-average">
                  <td colspan="2">Work Output Average</td>
                  <td class="text-center">${workOutputAvg}</td>
                  <td class="text-center">${RatingScale(
                    Number(workOutputAvg)
                  )}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

           <div class="performance-category">
            <div class="section-title">II. QUALITY OF WORK (20%)</div>
            <p>Accuracy and precision in completing tasks. Attention to detail. Consistency in delivering high-quality results. Timely completion of tasks and projects. Effective use of resources. Ability to meet deadlines.</p>
            <table>
              <thead>
                <tr>
                  <th style="width: 30%">Behavioral Indicators</th>
                  <th style="width: 30%">Example</th>
                  <th style="width: 10%">Score</th>
                  <th style="width: 10%">Rating</th>
                  <th style="width: 20%">Explanation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Meets Standards and Requirements</td>
                  <td>Ensures work is accurate and meets or exceeds established standards.</td>
                  <td class="text-center">${
                    initialForm.qualityMeetsStandards || 0
                  }</td>
                  <td class="text-center">${RatingScale(
                    Number(initialForm.qualityMeetsStandards || 0)
                  )}</td>
                  <td>${initialForm.qualityMeetsStandardsComments || ""}</td>
                </tr>
                <tr>
                  <td>Timeliness (L.E.A.D.E.R.)</td>
                  <td>Completes tasks and projects within specified deadlines.</td>
                  <td class="text-center">${
                    initialForm.qualityTimeliness || 0
                  }</td>
                  <td class="text-center">${RatingScale(
                    Number(initialForm.qualityTimeliness || 0)
                  )}</td>
                  <td>${initialForm.qualityTimelinessComments || ""}</td>
                </tr>
                 <tr>
                  <td>Work Output Volume (L.E.A.D.E.R.)</td>
                  <td>Produces a high volume of quality work within a given time frame.</td>
                  <td class="text-center">${
                    initialForm.qualityWorkOutputVolume || 0
                  }</td>
                  <td class="text-center">${RatingScale(
                    Number(initialForm.qualityWorkOutputVolume || 0)
                  )}</td>
                  <td>${initialForm.qualityWorkOutputVolumeComments || ""}</td>
                </tr>
                 <tr>
                  <td>Consistency in Performance (L.E.A.D.E.R.)</td>
                  <td>Maintains a consistent level of productivity over time.</td>
                  <td class="text-center">${
                    initialForm.qualityConsistency || 0
                  }</td>
                  <td class="text-center">${RatingScale(
                    Number(initialForm.qualityConsistency || 0)
                  )}</td>
                  <td>${initialForm.qualityConsistencyComments || ""}</td>
                </tr>
                 <tr>
                  <td>Job Targets</td>
                  <td>Achieves targets set for their respective position (Sales / CCR / Mechanic / etc.).</td>
                  <td class="text-center">${
                    initialForm.qualityJobTargets || 0
                  }</td>
                  <td class="text-center">${RatingScale(
                    Number(initialForm.qualityJobTargets || 0)
                  )}</td>
                  <td>${initialForm.qualityJobTargetsComments || ""}</td>
                </tr>
                 <tr class="category-average">
                   <td colspan="2">Quality of Work Average</td>
                   <td class="text-center">${qualityOfWorkAvg}</td>
                   <td class="text-center">${RatingScale(
                     Number(qualityOfWorkAvg)
                   )}</td>
                   <td></td>
                 </tr>
              </tbody>
            </table>
          </div>

          <div class="performance-category">
            <div class="section-title">III. ADAPTABILITY (10%)</div>
            <p>Flexibility in handling change. Ability to work effectively in diverse situations. Resilience in the face of challenges.</p>
            <table>
              <thead>
                <tr>
                  <th style="width: 30%">Behavioral Indicators</th>
                  <th style="width: 30%">Example</th>
                  <th style="width: 10%">Score</th>
                  <th style="width: 10%">Rating</th>
                  <th style="width: 20%">Explanation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Openness to Change (attitude towards change)</td>
                  <td>Welcomes changes in work processes, procedures, or tools without resistance. Maintains a cooperative attitude when asked to adjust to new ways of working.</td>
                  <td class="text-center">${
                    initialForm.adaptabilityOpenness || 0
                  }</td>
                  <td class="text-center">${RatingScale(
                    Number(initialForm.adaptabilityOpenness || 0)
                  )}</td>
                  <td>${initialForm.adaptabilityOpennessComments || ""}</td>
                </tr>
                <tr>
                  <td>Flexibility in Job Role (ability to adapt)</td>
                  <td>Adapts to changes in job assignments, schedules, or unexpected demands. Helps cover additional responsibilities during staffing shortages or high workloads.</td>
                  <td class="text-center">${
                    initialForm.adaptabilityFlexibility || 0
                  }</td>
                  <td class="text-center">${RatingScale(
                    Number(initialForm.adaptabilityFlexibility || 0)
                  )}</td>
                  <td>${initialForm.adaptabilityFlexibilityComments || ""}</td>
                </tr>
                <tr>
                  <td>Resilience in the Face of Challenges</td>
                  <td>Remains focused and effective during periods of high stress or uncertainty. Completes tasks or meets deadlines when faced with unforeseen obstacles.</td>
                  <td class="text-center">${
                    initialForm.adaptabilityResilience || 0
                  }</td>
                  <td class="text-center">${RatingScale(
                    Number(initialForm.adaptabilityResilience || 0)
                  )}</td>
                  <td>${initialForm.adaptabilityResilienceComments || ""}</td>
                </tr>
                 <tr class="category-average">
                   <td colspan="2">Adaptability Average</td>
                   <td class="text-center">${adaptabilityAvg}</td>
                   <td class="text-center">${RatingScale(
                     Number(adaptabilityAvg)
                   )}</td>
                   <td></td>
                 </tr>
              </tbody>
            </table>
          </div>

          <div class="performance-category">
            <div class="section-title">IV. TEAMWORK (10%)</div>
            <p>Ability to work well with others. Contribution to team goals and projects. Supportiveness of team members.</p>
            <table>
              <thead>
                <tr>
                  <th style="width: 30%">Behavioral Indicators</th>
                  <th style="width: 30%">Example</th>
                  <th style="width: 10%">Score</th>
                  <th style="width: 10%">Rating</th>
                  <th style="width: 20%">Explanation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Active Participation in Team Activities</td>
                  <td>Actively participates in team meetings, projects, and collaborative activities.</td>
                  <td class="text-center">${
                    initialForm.activeParticipationScore || 0
                  }</td>
                  <td class="text-center">${RatingScale(
                    Number(initialForm.activeParticipationScore || 0)
                  )}</td>
                  <td>${initialForm.activeParticipationExplanation || ""}</td>
                </tr>
                <tr>
                  <td>Positive Team Culture</td>
                  <td>Regularly contributes ideas, suggestions, and feedback during team discussions. Actively engages in team tasks, helping to achieve group goals.</td>
                  <td class="text-center">${
                    initialForm.positiveTeamCultureScore || 0
                  }</td>
                  <td class="text-center">${RatingScale(
                    Number(initialForm.positiveTeamCultureScore || 0)
                  )}</td>
                  <td>${initialForm.positiveTeamCultureExplanation || ""}</td>
                </tr>
                <tr>
                  <td>Effective Communication</td>
                  <td>Communicates clearly and respectfully with team members. Listens actively and provides constructive feedback.</td>
                  <td class="text-center">${
                    initialForm.effectiveCommunicationScore || 0
                  }</td>
                  <td class="text-center">${RatingScale(
                    Number(initialForm.effectiveCommunicationScore || 0)
                  )}</td>
                  <td>${
                    initialForm.effectiveCommunicationExplanation || ""
                  }</td>
                </tr>
                 <tr class="category-average">
                   <td colspan="2">Teamwork Average</td>
                   <td class="text-center">${teamworkAvg}</td>
                   <td class="text-center">${RatingScale(
                     Number(teamworkAvg)
                   )}</td>
                   <td></td>
                 </tr>
              </tbody>
            </table>
          </div>

          <div class="performance-category">
            <div class="section-title">V. RELIABILITY (5%)</div>
            <p>Consistency in completing tasks and meeting commitments. Dependability in attendance and punctuality.</p>
            <table>
              <thead>
                <tr>
                  <th style="width: 30%">Behavioral Indicators</th>
                  <th style="width: 30%">Example</th>
                  <th style="width: 10%">Score</th>
                  <th style="width: 10%">Rating</th>
                  <th style="width: 20%">Explanation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Consistent Attendance</td>
                  <td>Maintains a consistent and reliable attendance record. Minimizes unscheduled absences.</td>
                  <td class="text-center">${
                    initialForm.consistentAttendanceScore || 0
                  }</td>
                  <td class="text-center">${RatingScale(
                    Number(initialForm.consistentAttendanceScore || 0)
                  )}</td>
                  <td>${initialForm.consistentAttendanceExplanation || ""}</td>
                </tr>
                 <tr>
                  <td>Punctuality</td>
                  <td>Arrives on time for work, meetings, and appointments. Manages time effectively to meet deadlines.</td>
                  <td class="text-center">${
                    initialForm.punctualityScore || 0
                  }</td>
                  <td class="text-center">${RatingScale(
                    Number(initialForm.punctualityScore || 0)
                  )}</td>
                  <td>${initialForm.punctualityExplanation || ""}</td>
                </tr>
                 <tr>
                  <td>Follows Through</td>
                  <td>Completes assigned tasks and projects as committed. Takes responsibility for ensuring work is finished accurately and on time.</td>
                  <td class="text-center">${
                    initialForm.followsThroughScore || 0
                  }</td>
                  <td class="text-center">${RatingScale(
                    Number(initialForm.followsThroughScore || 0)
                  )}</td>
                  <td>${initialForm.followsThroughExplanation || ""}</td>
                </tr>
                 <tr>
                  <td>Reliable Handling</td>
                  <td>Handles confidential information and sensitive situations with discretion and reliability.</td>
                  <td class="text-center">${
                    initialForm.reliableHandlingScore || 0
                  }</td>
                  <td class="text-center">${RatingScale(
                    Number(initialForm.reliableHandlingScore || 0)
                  )}</td>
                  <td>${initialForm.reliableHandlingExplanation || ""}</td>
                </tr>
                 <tr class="category-average">
                   <td colspan="2">Reliability Average</td>
                   <td class="text-center">${reliabilityAvg}</td>
                   <td class="text-center">${RatingScale(
                     Number(reliabilityAvg)
                   )}</td>
                   <td></td>
                 </tr>
              </tbody>
            </table>
          </div>

          <div class="performance-category">
            <div class="section-title">VI. ETHICAL & PROFESSIONAL (5%)</div>
            <p>Adherence to ethical standards and company policies. Professional conduct and integrity.</p>
            <table>
              <thead>
                <tr>
                  <th style="width: 30%">Behavioral Indicators</th>
                  <th style="width: 30%">Example</th>
                  <th style="width: 10%">Score</th>
                  <th style="width: 10%">Rating</th>
                  <th style="width: 20%">Explanation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Follows Policies</td>
                  <td>Adheres to all company policies, procedures, and guidelines. Acts in accordance with legal and ethical standards.</td>
                  <td class="text-center">${
                    initialForm.ethicalFollowsPoliciesScore || 0
                  }</td>
                  <td class="text-center">${RatingScale(
                    Number(initialForm.ethicalFollowsPoliciesScore || 0)
                  )}</td>
                  <td>${
                    initialForm.ethicalFollowsPoliciesExplanation || ""
                  }</td>
                </tr>
                <tr>
                  <td>Professionalism</td>
                  <td>Maintains a professional demeanor in interactions with colleagues, supervisors, and customers. Dresses appropriately and maintains a professional appearance.</td>
                  <td class="text-center">${
                    initialForm.ethicalProfessionalismScore || 0
                  }</td>
                  <td class="text-center">${RatingScale(
                    Number(initialForm.ethicalProfessionalismScore || 0)
                  )}</td>
                  <td>${
                    initialForm.ethicalProfessionalismExplanation || ""
                  }</td>
                </tr>
                <tr>
                  <td>Accountability</td>
                  <td>Takes ownership of tasks and responsibilities. Accepts consequences for mistakes and learns from them.</td>
                  <td class="text-center">${
                    initialForm.ethicalAccountabilityScore || 0
                  }</td>
                  <td class="text-center">${RatingScale(
                    Number(initialForm.ethicalAccountabilityScore || 0)
                  )}</td>
                  <td>${initialForm.ethicalAccountabilityExplanation || ""}</td>
                </tr>
                 <tr>
                  <td>Respect</td>
                  <td>Treats all individuals with respect and courtesy, regardless of their position or background. Fosters an inclusive and positive work environment.</td>
                  <td class="text-center">${
                    initialForm.ethicalRespectScore || 0
                  }</td>
                  <td class="text-center">${RatingScale(
                    Number(initialForm.ethicalRespectScore || 0)
                  )}</td>
                  <td>${initialForm.ethicalRespectExplanation || ""}</td>
                </tr>
                 <tr class="category-average">
                   <td colspan="2">Ethical & Professional Average</td>
                   <td class="text-center">${ethicalAvg}</td>
                   <td class="text-center">${RatingScale(
                     Number(ethicalAvg)
                   )}</td>
                   <td></td>
                 </tr>
              </tbody>
            </table>
          </div>

          <div class="performance-category">
            <div class="section-title">VII. CUSTOMER SERVICE (30%)</div>
            <p>Interaction with customers (internal and external). Responsiveness to customer needs and inquiries. Problem-solving and conflict resolution skills. Maintaining positive customer relationships.</p>
            <table>
              <thead>
                <tr>
                  <th style="width: 30%">Behavioral Indicators</th>
                  <th style="width: 30%">Example</th>
                  <th style="width: 10%">Score</th>
                  <th style="width: 10%">Rating</th>
                  <th style="width: 20%">Explanation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Listening Skills</td>
                  <td>Actively listens to customer concerns and needs. Asks clarifying questions to ensure understanding.</td>
                  <td class="text-center">${
                    initialForm.customerListeningScore || 0
                  }</td>
                  <td class="text-center">${RatingScale(
                    Number(initialForm.customerListeningScore || 0)
                  )}</td>
                  <td>${initialForm.customerListeningExplanation || ""}</td>
                </tr>
                 <tr>
                  <td>Problem Solving</td>
                  <td>Identifies customer issues and works towards effective resolutions. Takes initiative to address problems proactively.</td>
                  <td class="text-center">${
                    initialForm.customerProblemSolvingScore || 0
                  }</td>
                  <td class="text-center">${RatingScale(
                    Number(initialForm.customerProblemSolvingScore || 0)
                  )}</td>
                  <td>${
                    initialForm.customerProblemSolvingExplanation || ""
                  }</td>
                </tr>
                 <tr>
                  <td>Product Knowledge</td>
                  <td>Maintains a thorough understanding of products and services to assist customers effectively. Provides accurate and helpful information.</td>
                  <td class="text-center">${
                    initialForm.customerProductKnowledgeScore || 0
                  }</td>
                  <td class="text-center">${RatingScale(
                    Number(initialForm.customerProductKnowledgeScore || 0)
                  )}</td>
                  <td>${
                    initialForm.customerProductKnowledgeExplanation || ""
                  }</td>
                </tr>
                 <tr>
                  <td>Professional Attitude</td>
                  <td>Maintains a courteous, patient, and professional attitude when interacting with customers, even in challenging situations.</td>
                  <td class="text-center">${
                    initialForm.customerProfessionalAttitudeScore || 0
                  }</td>
                  <td class="text-center">${RatingScale(
                    Number(initialForm.customerProfessionalAttitudeScore || 0)
                  )}</td>
                  <td>${
                    initialForm.customerProfessionalAttitudeExplanation || ""
                  }</td>
                </tr>
                 <tr>
                  <td>Timely Resolution</td>
                  <td>Resolves customer issues and inquiries in a timely manner. Provides updates to customers on the status of their requests.</td>
                  <td class="text-center">${
                    initialForm.customerTimelyResolutionScore || 0
                  }</td>
                  <td class="text-center">${RatingScale(
                    Number(initialForm.customerTimelyResolutionScore || 0)
                  )}</td>
                  <td>${
                    initialForm.customerTimelyResolutionExplanation || ""
                  }</td>
                </tr>
                 <tr class="category-average">
                   <td colspan="2">Customer Service Average</td>
                   <td class="text-center">${customerServiceAvg}</td>
                   <td class="text-center">${RatingScale(
                     Number(customerServiceAvg)
                   )}</td>
                   <td></td>
                 </tr>
              </tbody>
            </table>
          </div>

           <div class="performance-category">
            <div class="section-title">SUMMARY AND FINAL SCORE</div>
             <table>
              <thead>
                <tr>
                  <th style="width: 50%" colspan="2">Category</th>
                  <th style="width: 10%">Score</th>
                   <th style="width: 10%">Rating</th>
                  <th style="width: 10%">Weight</th>
                  <th style="width: 20%">Weighted Score</th>
                </tr>
              </thead>
               <tbody>
                 <tr>
                   <td colspan="2">Work Output Average</td>
                   <td class="text-center">${workOutputAvg}</td>
                    <td class="text-center">${RatingScale(
                      Number(workOutputAvg)
                    )}</td>
                   <td class="text-center">20%</td>
                   <td class="text-center">${weightedScores.work.toFixed(
                     2
                   )}</td>
                 </tr>
                  <tr>
                   <td colspan="2">Quality of Work Average</td>
                   <td class="text-center">${qualityOfWorkAvg}</td>
                    <td class="text-center">${RatingScale(
                      Number(qualityOfWorkAvg)
                    )}</td>
                   <td class="text-center">20%</td>
                   <td class="text-center">${weightedScores.quality.toFixed(
                     2
                   )}</td>
                 </tr>
                  <tr>
                   <td colspan="2">Adaptability Average</td>
                   <td class="text-center">${adaptabilityAvg}</td>
                    <td class="text-center">${RatingScale(
                      Number(adaptabilityAvg)
                    )}</td>
                   <td class="text-center">10%</td>
                   <td class="text-center">${weightedScores.adaptability.toFixed(
                     2
                   )}</td>
                 </tr>
                  <tr>
                   <td colspan="2">Teamwork Average</td>
                   <td class="text-center">${teamworkAvg}</td>
                    <td class="text-center">${RatingScale(
                      Number(teamworkAvg)
                    )}</td>
                   <td class="text-center">10%</td>
                   <td class="text-center">${weightedScores.teamwork.toFixed(
                     2
                   )}</td>
                 </tr>
                  <tr>
                   <td colspan="2">Reliability Average</td>
                   <td class="text-center">${reliabilityAvg}</td>
                    <td class="text-center">${RatingScale(
                      Number(reliabilityAvg)
                    )}</td>
                   <td class="text-center">5%</td>
                   <td class="text-center">${weightedScores.reliability.toFixed(
                     2
                   )}</td>
                 </tr>
                  <tr>
                   <td colspan="2">Ethical & Professional Average</td>
                   <td class="text-center">${ethicalAvg}</td>
                    <td class="text-center">${RatingScale(
                      Number(ethicalAvg)
                    )}</td>
                   <td class="text-center">5%</td>
                   <td class="text-center">${weightedScores.ethical.toFixed(
                     2
                   )}</td>
                 </tr>
                  <tr>
                   <td colspan="2">Customer Service Average</td>
                   <td class="text-center">${customerServiceAvg}</td>
                    <td class="text-center">${RatingScale(
                      Number(customerServiceAvg)
                    )}</td>
                   <td class="text-center">30%</td>
                   <td class="text-center">${weightedScores.customerService.toFixed(
                     2
                   )}</td>
                 </tr>
                  <tr class="total-row">
                   <td colspan="2">TOTAL SCORE</td>
                   <td class="text-center"></td>
                   <td class="text-center">${finalRating}</td>
                   <td class="text-center"></td>
                   <td class="text-center">${totalScore}</td>
                 </tr>
               </tbody>
            </table>
           </div>

          <div class="final-score">
            <div style="text-align: center; margin-bottom: 20px;">
              <h3 style="font-size: 16pt; font-weight: bold; margin-bottom: 10px;">FINAL PERFORMANCE SUMMARY</h3>
              <div style="font-size: 14pt; margin-bottom: 5px;">
                Final Score: ${totalScore} out of 5.0
              </div>
              <div style="font-size: 14pt; margin-bottom: 5px;">
                Final Rating: ${finalRating}
              </div>
              <div style="font-size: 14pt; font-weight: bold; margin-bottom: 20px; border: 2px solid #000; padding: 15px; display: inline-block; min-width: 200px;">
                Final Percentage: ${((Number(totalScore) / 5) * 100).toFixed(
                  2
                )}%
              </div>
            </div>

            <!-- Priority Areas for Improvement Section -->
            <div style="margin-top: 30px; padding: 10px; border-top: 1px solid #ccc;">
              <div style="font-size: 10pt; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #000; padding-bottom: 5px;">PRIORITY AREAS FOR IMPROVEMENT</div>
              <p style="font-size: 10pt; margin-bottom: 10px; text-align: left;">This section identifies key areas the employee can focus on for development in the upcoming quarter. These can be specific skills, behaviors, or work outputs that will contribute to better overall performance and align with branch or company goals. Keep the feedback clear, helpful, and easy to act on.</p>
              <div style="border: 1px solid #000; min-height: 60px; margin-bottom: 10px; background-color: #fffacd; padding: 10px; text-align: left;">
                ${initialForm.areasForImprovement || ""}
              </div>
            </div>

            <!-- Remarks Section -->
            <div style="margin-top: 30px; padding: 10px; border-top: 1px solid #ccc;">
              <div style="font-size: 10pt; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #000; padding-bottom: 5px;">REMARKS</div>
              <div style="border: 1px solid #000; min-height: 60px; background-color: #fffacd; padding: 10px; text-align: left;">
                ${initialForm.additionalComments || ""}
              </div>
            </div>

            <!-- Acknowledgement Section -->
            <div style="margin-top: 30px; padding: 10px; border-top: 1px solid #ccc;">
              <div style="font-size: 10pt; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #000; padding-bottom: 5px;">ACKNOWLEDGEMENT</div>
              <p style="font-size: 10pt; margin-bottom: 20px;">I hereby acknowledge that the Evaluator has explained to me, to the best of their ability, and in a manner I fully understand, my performance and respective rating on this performance evaluation.</p>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 30px;">
                <div style="text-align: center;">
                  <div style="border-bottom: 1px solid #000; height: 30px; margin-bottom: 5px;"></div>
                  <p style="font-size: 10pt;">Employee's Name & Signature</p>
                  <div style="display: flex; justify-content: flex-start; align-items: center; margin-top: 15px;">
                    <span style="font-size: 10pt; margin-right: 5px;">Date:</span>
                    <div style="border: 1px solid #000; height: 20px; flex-grow: 1; background-color: #fffacd;"></div>
                  </div>
                </div>
                <div style="text-align: center;">
                  <div style="border-bottom: 1px solid #000; height: 30px; margin-bottom: 5px;"></div>
                  <p style="font-size: 10pt;">Evaluator's Name & Signature</p>
                  <div style="display: flex; justify-content: flex-start; align-items: center; margin-top: 15px;">
                    <span style="font-size: 10pt; margin-right: 5px;">Date:</span>
                    <div style="border: 1px solid #000; height: 20px; flex-grow: 1; background-color: #fffacd;"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Remove the old sections since they're now merged -->
          <!-- Page Break -->
          <div style="page-break-before: always;"></div>

        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();

    // Wait for content to load before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // Add the getCurrentQuarter function
  function getCurrentQuarter() {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    
    let quarter = 'Q1';
    if (month >= 3 && month <= 5) quarter = 'Q2';
    else if (month >= 6 && month <= 8) quarter = 'Q3';
    else if (month >= 9 && month <= 11) quarter = 'Q4';
    
    return `${quarter} ${year}`;
  }

  const handleSubmitFinalReview = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        employeeId: initialForm.employeeId,
        employeeName: initialForm.employeeName,
        position: initialForm.position,
        department: initialForm.department,
        immediateSupervisor: initialForm.immediateSupervisorInput,
        performanceCoverage: initialForm.performanceCoverage,
        ForRegular: initialForm.ForRegular || getCurrentQuarter(),
        // Scores - Ensure all numeric values are valid numbers
        jobKnowledge: Number(initialForm.jobKnowledge) || 0,
        qualityOfWork: Number(initialForm.qualityOfWork) || 0,
        promptnessOfWork: Number(initialForm.promptnessOfWork) || 0,
        qualityMeetsStandards: Number(initialForm.qualityMeetsStandards) || 0,
        qualityTimeliness: Number(initialForm.qualityTimeliness) || 0,
        qualityWorkOutputVolume: Number(initialForm.qualityWorkOutputVolume) || 0,
        qualityConsistency: Number(initialForm.qualityConsistency) || 0,
        qualityJobTargets: Number(initialForm.qualityJobTargets) || 0,
        adaptabilityOpenness: Number(initialForm.adaptabilityOpenness) || 0,
        adaptabilityFlexibility: Number(initialForm.adaptabilityFlexibility) || 0,
        adaptabilityResilience: Number(initialForm.adaptabilityResilience) || 0,
        activeParticipationScore: Number(initialForm.activeParticipationScore) || 0,
        positiveTeamCultureScore: Number(initialForm.positiveTeamCultureScore) || 0,
        effectiveCommunicationScore: Number(initialForm.effectiveCommunicationScore) || 0,
        consistentAttendanceScore: Number(initialForm.consistentAttendanceScore) || 0,
        punctualityScore: Number(initialForm.punctualityScore) || 0,
        followsThroughScore: Number(initialForm.followsThroughScore) || 0,
        reliableHandlingScore: Number(initialForm.reliableHandlingScore) || 0,
        ethicalFollowsPoliciesScore: Number(initialForm.ethicalFollowsPoliciesScore) || 0,
        ethicalProfessionalismScore: Number(initialForm.ethicalProfessionalismScore) || 0,
        ethicalAccountabilityScore: Number(initialForm.ethicalAccountabilityScore) || 0,
        ethicalRespectScore: Number(initialForm.ethicalRespectScore) || 0,
        customerListeningScore: Number(initialForm.customerListeningScore) || 0,
        customerProblemSolvingScore: Number(initialForm.customerProblemSolvingScore) || 0,
        customerProductKnowledgeScore: Number(initialForm.customerProductKnowledgeScore) || 0,
        customerProfessionalAttitudeScore: Number(initialForm.customerProfessionalAttitudeScore) || 0,
        customerTimelyResolutionScore: Number(initialForm.customerTimelyResolutionScore) || 0,

        // Comments
        jobKnowledgeComments: initialForm.jobKnowledgeComments || "",
        promptnessofworkComments: initialForm.promptnessofworkComments || "",
        qualityofworkComments: initialForm.qualityofworkComments || "",
        qualityMeetsStandardsComments: initialForm.qualityMeetsStandardsComments || "",
        qualityTimelinessComments: initialForm.qualityTimelinessComments || "",
        qualityWorkOutputVolumeComments: initialForm.qualityWorkOutputVolumeComments || "",
        qualityConsistencyComments: initialForm.qualityConsistencyComments || "",
        qualityJobTargetsComments: initialForm.qualityJobTargetsComments || "",
        adaptabilityOpennessComments: initialForm.adaptabilityOpennessComments || "",
        adaptabilityFlexibilityComments: initialForm.adaptabilityFlexibilityComments || "",
        adaptabilityResilienceComments: initialForm.adaptabilityResilienceComments || "",
        activeParticipationExplanation: initialForm.activeParticipationExplanation || "",
        positiveTeamCultureExplanation: initialForm.positiveTeamCultureExplanation || "",
        effectiveCommunicationExplanation: initialForm.effectiveCommunicationExplanation || "",
        consistentAttendanceExplanation: initialForm.consistentAttendanceExplanation || "",
        punctualityExplanation: initialForm.punctualityExplanation || "",
        followsThroughExplanation: initialForm.followsThroughExplanation || "",
        reliableHandlingExplanation: initialForm.reliableHandlingExplanation || "",
        ethicalFollowsPoliciesExplanation: initialForm.ethicalFollowsPoliciesExplanation || "",
        ethicalProfessionalismExplanation: initialForm.ethicalProfessionalismExplanation || "",
        ethicalAccountabilityExplanation: initialForm.ethicalAccountabilityExplanation || "",
        ethicalRespectExplanation: initialForm.ethicalRespectExplanation || "",
        customerListeningExplanation: initialForm.customerListeningExplanation || "",
        customerProblemSolvingExplanation: initialForm.customerProblemSolvingExplanation || "",
        customerProductKnowledgeExplanation: initialForm.customerProductKnowledgeExplanation || "",
        customerProfessionalAttitudeExplanation: initialForm.customerProfessionalAttitudeExplanation || "",
        customerTimelyResolutionExplanation: initialForm.customerTimelyResolutionExplanation || "",

        // Final Results - Ensure numeric values are valid
        finalScore: Number(totalScore) || 0,
        finalRating: finalRating || "",
        finalPercentage: Number(((Number(totalScore) / 5) * 100).toFixed(2)) || 0,
        areasForImprovement: initialForm.areasForImprovement || "",
        additionalComments: initialForm.additionalComments || "",

        status: "completed",
        submittedAt: new Date().toISOString(),
      };

      const response = await fetch("/api/performance-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error details:", errorData);
        throw new Error(errorData.error || "Failed to submit review");
      }

      const result = await response.json();
      console.log("Review submitted successfully:", result);

      // Update the reviewService for real-time HR dashboard update
      if (result.id && employeeName?.name && initialForm.employeeId) {
        reviewService.addNewReview({
          id: result.id,
          employeeName: employeeName.name,
          employeeId: initialForm.employeeId,
          score: Number(totalScore)
        });
      }

      // Create a recent activity
      const activityResponse = await fetch("/api/recent-activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "evaluation",
          description: `Performance review submitted for ${employeeName?.name || 'Employee'}`,
          timestamp: new Date().toISOString(),
          employeeName: employeeName?.name || 'Employee',
          employeeId: initialForm.employeeId,
          reviewId: result.id // Add the review ID to link the activity to the review
        }),
      });

      if (!activityResponse.ok) {
        console.error("Failed to create recent activity");
        const errorData = await activityResponse.json();
        console.error("Activity creation error:", errorData);
      } else {
        console.log("Recent activity created successfully");
      }

      toast.success("Performance review completed successfully!");
      setShowConfirmDialog(false);
      // Redirect to evaluator dashboard after successful submission
      router.push("/evaluator-dashboard");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit performance review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <div className="space-y-8 p-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-blue-600">
          Final Performance Review Summary
        </h2>

        {/* Employee Information */}
        <div className="mb-8 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Employee Information</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3">Basic Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-gray-600 font-medium w-32">Employee Name:</span>
                      <span className="text-gray-800">{employeeName?.name || ""}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-600 font-medium w-32">Employee ID:</span>
                      <span className="text-gray-800">{initialForm.employeeId || ""}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-600 font-medium w-32">Position:</span>
                      <span className="text-gray-800">{employeeName?.position?.title || initialForm.position || ""}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-600 font-medium w-32">Department:</span>
                      <span className="text-gray-800">{initialForm.department || ""}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-600 font-medium w-32">Email:</span>
                      <span className="text-gray-800">{employeeName?.email || ""}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3">Review Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-gray-600 font-medium w-32">Review Type:</span>
                      <span className="text-gray-800">{initialForm.reviewType || ""}</span>
                    </div>
                    {initialForm.reviewType === "quarterly" && (
                      <div className="flex items-start">
                        <span className="text-gray-600 font-medium w-32">For Regular:</span>
                        <span className="text-gray-800">{initialForm.ForRegular || ""}</span>
                      </div>
                    )}
                    {initialForm.reviewType === "probationary" && (
                      <div className="flex items-start">
                        <span className="text-gray-600 font-medium w-32">For Probationary:</span>
                        <span className="text-gray-800">{initialForm.ForProbationary || ""}</span>
                      </div>
                    )}
                    {initialForm.reviewType === "annual" && (
                      <>
                        <div className="flex items-start">
                          <span className="text-gray-600 font-medium w-32">Annual Review:</span>
                          <span className="text-gray-800">{getCurrentQuarter()}</span>
                        </div>
                        {initialForm.otherReviewType && (
                          <div className="flex items-start">
                            <span className="text-gray-600 font-medium w-32">Review Type:</span>
                            <span className="text-gray-800">{initialForm.otherReviewType}</span>
                          </div>
                        )}
                        {initialForm.otherReviewDetails && (
                          <div className="flex items-start">
                            <span className="text-gray-600 font-medium w-32">Review Details:</span>
                            <span className="text-gray-800">{initialForm.otherReviewDetails}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3">Additional Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-gray-600 font-medium w-32">Date Hired:</span>
                      <span className="text-gray-800">
                        {initialForm.datehired
                          ? new Date(initialForm.datehired).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-600 font-medium w-32">Review Date:</span>
                      <span className="text-gray-800">
                        {initialForm.reviewDate
                          ? new Date(initialForm.reviewDate).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-600 font-medium w-32">Supervisor:</span>
                      <span className="text-gray-800">{initialForm.immediateSupervisorInput || ""}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-600 font-medium w-32">Coverage:</span>
                      <span className="text-gray-800">{initialForm.performanceCoverage || ""}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-4">Category</th>
                    <th className="text-center p-4">Rating</th>
                    <th className="text-center p-4">Score</th>
                    <th className="text-center p-4">Weight</th>
                    <th className="text-center p-4">Weighted Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Work Output</td>
                    <td className="text-center p-4 text-blue-600">
                      {RatingScale(Number(workOutputAvg))}
                    </td>
                    <td className="text-center p-4">{workOutputAvg}</td>
                    <td className="text-center p-4">20%</td>
                    <td className="text-center p-4">
                      {weightedScores.work.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Quality of Work</td>
                    <td className="text-center p-4 text-blue-600">
                      {RatingScale(Number(qualityOfWorkAvg))}
                    </td>
                    <td className="text-center p-4">{qualityOfWorkAvg}</td>
                    <td className="text-center p-4">20%</td>
                    <td className="text-center p-4">
                      {weightedScores.quality.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Adaptability</td>
                    <td className="text-center p-4 text-blue-600">
                      {RatingScale(Number(adaptabilityAvg))}
                    </td>
                    <td className="text-center p-4">{adaptabilityAvg}</td>
                    <td className="text-center p-4">10%</td>
                    <td className="text-center p-4">
                      {weightedScores.adaptability.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Teamwork</td>
                    <td className="text-center p-4 text-blue-600">
                      {RatingScale(Number(teamworkAvg))}
                    </td>
                    <td className="text-center p-4">{teamworkAvg}</td>
                    <td className="text-center p-4">10%</td>
                    <td className="text-center p-4">
                      {weightedScores.teamwork.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Reliability</td>
                    <td className="text-center p-4 text-blue-600">
                      {RatingScale(Number(reliabilityAvg))}
                    </td>
                    <td className="text-center p-4">{reliabilityAvg}</td>
                    <td className="text-center p-4">5%</td>
                    <td className="text-center p-4">
                      {weightedScores.reliability.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Ethical & Professional</td>
                    <td className="text-center p-4 text-blue-600">
                      {RatingScale(Number(ethicalAvg))}
                    </td>
                    <td className="text-center p-4">{ethicalAvg}</td>
                    <td className="text-center p-4">5%</td>
                    <td className="text-center p-4">
                      {weightedScores.ethical.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Customer Service</td>
                    <td className="text-center p-4 text-blue-600">
                      {RatingScale(Number(customerServiceAvg))}
                    </td>
                    <td className="text-center p-4">{customerServiceAvg}</td>
                    <td className="text-center p-4">30%</td>
                    <td className="text-center p-4">
                      {weightedScores.customerService.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="bg-blue-200">
                    <td className="p-4 font-bold text-2xl">Total Score</td>
                    <td className="text-center p-4 font-bold text-2xl text-green-600">
                      {finalRating}
                    </td>
                    <td className="text-center p-4 font-bold"></td>
                    <td className="text-center p-4 font-bold"></td>
                    <td className="text-center p-4 font-bold text-3xl">
                      {totalScore}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Final Percentage Score */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                Final Percentage Score
              </h3>
              <div className="text-4xl font-bold text-blue-600">
                {((Number(totalScore) / 5) * 100).toFixed(2)}%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Priority Areas for Improvement Section */}
        <div className="border p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">
            Priority Areas for Improvement
          </h3>
          <p className="text-sm text-gray-700 mb-4">
            This section identifies key areas the employee can focus on for
            development in the upcoming quarter. These can be specific skills,
            behaviors, or work outputs that will contribute to better overall
            performance and align with branch or company goals. Keep the
            feedback clear, helpful, and easy to act on.
          </p>
          <FormField
            control={form.control as unknown as Control<PerformanceFormValues>}
            name="areasForImprovement"
            render={({
              field,
            }: {
              field: ControllerRenderProps<PerformanceFormValues, "areasForImprovement">;
            }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    className="min-h-[150px] bg-yellow-50"
                    placeholder="Enter priority areas for improvement (minimum 10 characters)..."
                    value={field.value || ""}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      const value = e.target.value;
                      field.onChange(value);
                      initialForm.areasForImprovement = value;
                      onEdit(8);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Remarks Section */}
        <div className="border p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">Remarks</h3>
          <FormField
            control={form.control as unknown as Control<PerformanceFormValues>}
            name="additionalComments"
            render={({
              field,
            }: {
              field: ControllerRenderProps<PerformanceFormValues, "additionalComments">;
            }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    className="min-h-[150px] bg-yellow-50"
                    placeholder="Enter additional remarks..."
                    value={field.value || ""}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      const value = e.target.value;
                      field.onChange(value);
                      initialForm.additionalComments = value;
                      onEdit(8);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Final Actions */}
        <div className="flex justify-between">
          <Button
            onClick={() => onEdit(1)}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Edit Review
          </Button>

          <div className="flex gap-4">
            <Button
              onClick={handlePrint}
              className="bg-gray-500 text-white hover:bg-gray-600"
            >
              Print Results
            </Button>

            <Button
              className="bg-green-500 text-white hover:bg-green-600"
              onClick={() => setShowConfirmDialog(true)}
              disabled={isSubmitting}
            >
              Submit Final Review
            </Button>
          </div>
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit to HR for Review</DialogTitle>
              <DialogDescription className="space-y-2">
                <p>
                  Are you sure you want to submit this performance review to HR
                  ? this action cannot be undone.
                </p>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                className="bg-blue-500 text-white hover:bg-yellow-400 hover:text-black"
                onClick={() => setShowConfirmDialog(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                className="bg-green-500 text-white hover:bg-green-600"
                onClick={handleSubmitFinalReview}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit to HR"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Form>
  );
}
