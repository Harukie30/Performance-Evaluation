"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Stepper } from "@/components/ui/stepper";
import PerformanceForm from "@/components/performance-form";
import PerformanceForm2 from "@/components/performance-form2";
import PerformanceForm3 from "@/components/performance-form3";
import PerformanceForm4 from "@/components/performance-form4";
import PerformanceForm5 from "@/components/performance-form5";
import PerformanceForm6 from "@/components/performance-form6";
import PerformanceForm7 from "@/components/performance-form7";
import FinalResult from "@/components/FinalResult";
import { PerformanceFormValues } from "@/lib/validation-schema/form-schema";
import { useSearchParams } from "next/navigation";

export default function PerformanceReviewPage() {
  const [activePart, setActivePart] = useState(1);
  const totalSteps = 8;
  const [formData, setFormData] = useState<PerformanceFormValues>({
    employeeId: "",
    employeeName: 0,
    position: "",
    department: "",
    immediateSupervisorInput: "",
    performanceCoverage: "",
    reviewDate: new Date(),
    datehired: new Date(),
    reviewType: "quarterly",

    attendance: 0,
    punctuality: 0,
    correctiveActionWarningReprimandsOralOrWritten: 0,
    honesty: 0,
    loyalty: 0,
    courteous: 0,
    communication: 0,
    initiative: 0,
    jobKnowledge: 0,
    promptnessOfWork: 0,
    qualityOfWork: 0,
    jobKnowledgeComments: "",
    qualityofworkComments: "",
    promptnessofworkComments: "",
    punctualityComments: "",
    attendanceComments: "",
    correctiveactionComments: "",
    honestyComments: "",
    loyaltyComments: "",
    courteousComments: "",
    communicationComments: "",
    initiativeComments: "",
    qualityMeetsStandards: 0,
    qualityMeetsStandardsComments: "",
    qualityTimeliness: 0,
    qualityTimelinessComments: "",
    qualityWorkOutputVolume: 0,
    qualityWorkOutputVolumeComments: "",
    qualityConsistency: 0,
    qualityConsistencyComments: "",
    qualityJobTargets: 0,
    qualityJobTargetsComments: "",
    adaptabilityOpenness: 0,
    adaptabilityOpennessComments: "",
    adaptabilityFlexibility: 0,
    adaptabilityFlexibilityComments: "",
    adaptabilityResilience: 0,
    adaptabilityResilienceComments: "",
    activeParticipationScore: 0,
    activeParticipationRating: "N/A",
    activeParticipationExample: "",
    activeParticipationExplanation: "",
    positiveTeamCultureScore: 0,
    positiveTeamCultureRating: "N/A",
    positiveTeamCultureExample: "",
    positiveTeamCultureExplanation: "",
    effectiveCommunicationScore: 0,
    effectiveCommunicationRating: "N/A",
    effectiveCommunicationExample: "",
    effectiveCommunicationExplanation: "",
    consistentAttendanceScore: 0,
    consistentAttendanceExplanation: "",
    punctualityScore: 0,
    punctualityExplanation: "",
    followsThroughScore: 0,
    followsThroughExplanation: "",
    reliableHandlingScore: 0,
    reliableHandlingExplanation: "",
    ethicalFollowsPoliciesScore: 0,
    ethicalFollowsPoliciesExplanation: "",
    ethicalProfessionalismScore: 0,
    ethicalProfessionalismExplanation: "",
    ethicalAccountabilityScore: 0,
    ethicalAccountabilityExplanation: "",
    ethicalRespectScore: 0,
    ethicalRespectExplanation: "",
    customerListeningScore: 0,
    customerListeningExplanation: "",
    customerProblemSolvingScore: 0,
    customerProblemSolvingExplanation: "",
    customerProductKnowledgeScore: 0,
    customerProductKnowledgeExplanation: "",
    customerProfessionalAttitudeScore: 0,
    customerProfessionalAttitudeExplanation: "",
    customerTimelyResolutionScore: 0,
    customerTimelyResolutionExplanation: "",
    overallTeamworkScore: 0,
    overallReliabilityScore: 0,
    overallCustomerServiceScore: 0,
    overallPerformanceScore: 0,
    overallPerformanceRating: "N/A",
    overallPerformanceExplanation: "",
    keyStrengths: "",
    areasForImprovement: "",
    developmentGoals: "",
    additionalComments: "",
    comments: "",
    strengths: "",
    improvements: "",
    goals: "",
  });
  const searchParams = useSearchParams();

  // Get employee data from URL parameters
  const employeeId = searchParams.get("employeeId");
  const employeeName = searchParams.get("employeeName");
  const department = searchParams.get("department");
  const position = searchParams.get("position");

  // Pre-fill form data if URL parameters exist
  useEffect(() => {
    if (employeeId && employeeName && department && position) {
      setFormData((prevData) => ({
        ...prevData,
        employeeId: decodeURIComponent(employeeId),
        employeeName: parseInt(decodeURIComponent(employeeName)),
        department: decodeURIComponent(department),
        position: decodeURIComponent(position),
      }));
    }
  }, [employeeId, employeeName, department, position]);

  const handleFormComplete = (data: Partial<PerformanceFormValues>) => {
    setFormData((prevData) => {
      const mergedData = {
        ...prevData,
        ...data,
        // Part I - Job Knowledge & Quality of Work
        jobKnowledge: Number(data.jobKnowledge) || prevData.jobKnowledge,
        qualityOfWork: Number(data.qualityOfWork) || prevData.qualityOfWork,
        promptnessOfWork:
          Number(data.promptnessOfWork) || prevData.promptnessOfWork,
        jobKnowledgeComments:
          data.jobKnowledgeComments || prevData.jobKnowledgeComments,
        qualityofworkComments:
          data.qualityofworkComments || prevData.qualityofworkComments,
        promptnessofworkComments:
          data.promptnessofworkComments || prevData.promptnessofworkComments,

        // Part II - Quality of Work
        qualityMeetsStandards:
          Number(data.qualityMeetsStandards) || prevData.qualityMeetsStandards,
        qualityMeetsStandardsComments:
          data.qualityMeetsStandardsComments ||
          prevData.qualityMeetsStandardsComments,
        qualityTimeliness:
          Number(data.qualityTimeliness) || prevData.qualityTimeliness,
        qualityTimelinessComments:
          data.qualityTimelinessComments || prevData.qualityTimelinessComments,
        qualityWorkOutputVolume:
          Number(data.qualityWorkOutputVolume) ||
          prevData.qualityWorkOutputVolume,
        qualityWorkOutputVolumeComments:
          data.qualityWorkOutputVolumeComments ||
          prevData.qualityWorkOutputVolumeComments,
        qualityConsistency:
          Number(data.qualityConsistency) || prevData.qualityConsistency,
        qualityConsistencyComments:
          data.qualityConsistencyComments ||
          prevData.qualityConsistencyComments,
        qualityJobTargets:
          Number(data.qualityJobTargets) || prevData.qualityJobTargets,
        qualityJobTargetsComments:
          data.qualityJobTargetsComments || prevData.qualityJobTargetsComments,

        // Part III - Adaptability
        adaptabilityOpenness:
          Number(data.adaptabilityOpenness) || prevData.adaptabilityOpenness,
        adaptabilityOpennessComments:
          data.adaptabilityOpennessComments ||
          prevData.adaptabilityOpennessComments,
        adaptabilityFlexibility:
          Number(data.adaptabilityFlexibility) ||
          prevData.adaptabilityFlexibility,
        adaptabilityFlexibilityComments:
          data.adaptabilityFlexibilityComments ||
          prevData.adaptabilityFlexibilityComments,
        adaptabilityResilience:
          Number(data.adaptabilityResilience) ||
          prevData.adaptabilityResilience,
        adaptabilityResilienceComments:
          data.adaptabilityResilienceComments ||
          prevData.adaptabilityResilienceComments,

        // Part IV - Teamwork
        activeParticipationScore:
          Number(data.activeParticipationScore) ||
          prevData.activeParticipationScore,
        activeParticipationRating:
          data.activeParticipationRating || prevData.activeParticipationRating,
        activeParticipationExample:
          data.activeParticipationExample ||
          prevData.activeParticipationExample,
        activeParticipationExplanation:
          data.activeParticipationExplanation ||
          prevData.activeParticipationExplanation,
        positiveTeamCultureScore:
          Number(data.positiveTeamCultureScore) ||
          prevData.positiveTeamCultureScore,
        positiveTeamCultureRating:
          data.positiveTeamCultureRating || prevData.positiveTeamCultureRating,
        positiveTeamCultureExample:
          data.positiveTeamCultureExample ||
          prevData.positiveTeamCultureExample,
        positiveTeamCultureExplanation:
          data.positiveTeamCultureExplanation ||
          prevData.positiveTeamCultureExplanation,
        effectiveCommunicationScore:
          Number(data.effectiveCommunicationScore) ||
          prevData.effectiveCommunicationScore,
        effectiveCommunicationRating:
          data.effectiveCommunicationRating ||
          prevData.effectiveCommunicationRating,
        effectiveCommunicationExample:
          data.effectiveCommunicationExample ||
          prevData.effectiveCommunicationExample,
        effectiveCommunicationExplanation:
          data.effectiveCommunicationExplanation ||
          prevData.effectiveCommunicationExplanation,

        // Part V - Reliability
        consistentAttendanceScore:
          Number(data.consistentAttendanceScore) ||
          prevData.consistentAttendanceScore,
        consistentAttendanceExplanation:
          data.consistentAttendanceExplanation ||
          prevData.consistentAttendanceExplanation,
        punctualityScore:
          Number(data.punctualityScore) || prevData.punctualityScore,
        punctualityExplanation:
          data.punctualityExplanation || prevData.punctualityExplanation,
        followsThroughScore:
          Number(data.followsThroughScore) || prevData.followsThroughScore,
        followsThroughExplanation:
          data.followsThroughExplanation || prevData.followsThroughExplanation,
        reliableHandlingScore:
          Number(data.reliableHandlingScore) || prevData.reliableHandlingScore,
        reliableHandlingExplanation:
          data.reliableHandlingExplanation ||
          prevData.reliableHandlingExplanation,

        // Part VI - Ethical & Professional
        ethicalFollowsPoliciesScore:
          Number(data.ethicalFollowsPoliciesScore) ||
          prevData.ethicalFollowsPoliciesScore,
        ethicalFollowsPoliciesExplanation:
          data.ethicalFollowsPoliciesExplanation ||
          prevData.ethicalFollowsPoliciesExplanation,
        ethicalProfessionalismScore:
          Number(data.ethicalProfessionalismScore) ||
          prevData.ethicalProfessionalismScore,
        ethicalProfessionalismExplanation:
          data.ethicalProfessionalismExplanation ||
          prevData.ethicalProfessionalismExplanation,
        ethicalAccountabilityScore:
          Number(data.ethicalAccountabilityScore) ||
          prevData.ethicalAccountabilityScore,
        ethicalAccountabilityExplanation:
          data.ethicalAccountabilityExplanation ||
          prevData.ethicalAccountabilityExplanation,
        ethicalRespectScore:
          Number(data.ethicalRespectScore) || prevData.ethicalRespectScore,
        ethicalRespectExplanation:
          data.ethicalRespectExplanation || prevData.ethicalRespectExplanation,

        // Part VII - Customer Service
        customerListeningScore:
          Number(data.customerListeningScore) ||
          prevData.customerListeningScore,
        customerListeningExplanation:
          data.customerListeningExplanation ||
          prevData.customerListeningExplanation,
        customerProblemSolvingScore:
          Number(data.customerProblemSolvingScore) ||
          prevData.customerProblemSolvingScore,
        customerProblemSolvingExplanation:
          data.customerProblemSolvingExplanation ||
          prevData.customerProblemSolvingExplanation,
        customerProductKnowledgeScore:
          Number(data.customerProductKnowledgeScore) ||
          prevData.customerProductKnowledgeScore,
        customerProductKnowledgeExplanation:
          data.customerProductKnowledgeExplanation ||
          prevData.customerProductKnowledgeExplanation,
        customerProfessionalAttitudeScore:
          Number(data.customerProfessionalAttitudeScore) ||
          prevData.customerProfessionalAttitudeScore,
        customerProfessionalAttitudeExplanation:
          data.customerProfessionalAttitudeExplanation ||
          prevData.customerProfessionalAttitudeExplanation,
        customerTimelyResolutionScore:
          Number(data.customerTimelyResolutionScore) ||
          prevData.customerTimelyResolutionScore,
        customerTimelyResolutionExplanation:
          data.customerTimelyResolutionExplanation ||
          prevData.customerTimelyResolutionExplanation,

        // Calculated scores
        overallTeamworkScore:
          Number(data.overallTeamworkScore) || prevData.overallTeamworkScore,
        overallReliabilityScore:
          Number(data.overallReliabilityScore) ||
          prevData.overallReliabilityScore,
        overallCustomerServiceScore:
          Number(data.overallCustomerServiceScore) ||
          prevData.overallCustomerServiceScore,
      };

      console.log("Merged form data in parent:", mergedData); // Debug log
      return mergedData;
    });

    if (activePart < totalSteps) {
      setActivePart((prev) => prev + 1);
    }
  };

  const renderFormPart = () => {
    switch (activePart) {
      case 1:
        return (
          <PerformanceForm
            activePart={activePart}
            setActivePart={setActivePart}
            onComplete={handleFormComplete}
            formData={formData}
          />
        );
      case 2:
        return (
          <PerformanceForm2
            activePart={activePart}
            setActivePart={setActivePart}
            onComplete={handleFormComplete}
            formData={formData}
          />
        );
      case 3:
        return (
          <PerformanceForm3
            activePart={activePart}
            setActivePart={setActivePart}
            onComplete={handleFormComplete}
            formData={formData}
          />
        );
      case 4:
        return (
          <PerformanceForm4
            setActivePart={setActivePart}
            onComplete={handleFormComplete}
            formData={formData}
          />
        );
      case 5:
        return (
          <PerformanceForm5
            activePart={activePart}
            setActivePart={setActivePart}
            onComplete={handleFormComplete}
            formData={formData}
          />
        );
      case 6:
        return (
          <PerformanceForm6
            activePart={activePart}
            setActivePart={setActivePart}
            onComplete={handleFormComplete}
            formData={formData}
          />
        );
      case 7:
        return (
          <PerformanceForm7
            activePart={activePart}
            setActivePart={setActivePart}
            onComplete={handleFormComplete}
            formData={formData}
          />
        );
      case 8:
        return (
          <FinalResult onEdit={(part) => setActivePart(part)} form={formData} />
        );
      default:
        return null;
    }
  };

  return (
    <main className="w-full min-h-screen bg-blue-500 py-4 px-4">
      <div className="max-w-9xl mx-auto">
        <Card className="p-10 bg-white">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/smct.png"
              alt="Company Logo"
              width={250}
              height={150}
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-center mb-8">
            Employee Performance Review form
          </h1>

          <Stepper
            currentStep={activePart}
            totalSteps={totalSteps}
            className="mb-8"
          />

          {renderFormPart()}
        </Card>
      </div>
    </main>
  );
}
