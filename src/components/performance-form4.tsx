import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PerformanceFormValues,
  formSchema,
} from "../lib/validation-schema/form-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { Card, CardContent } from "./ui/card";
import RatingScale from "@/app/constants/rating-scale";

interface PerformanceForm4Props {
  setActivePart: React.Dispatch<React.SetStateAction<number>>;
  onComplete: (data: PerformanceFormValues) => void;
  formData: PerformanceFormValues;
}

export default function PerformanceForm4({
  setActivePart,
  onComplete,
  formData,
}: PerformanceForm4Props): React.JSX.Element {
  const form = useForm<PerformanceFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      ...formData,
      // Teamwork fields
      activeParticipationScore: formData.activeParticipationScore || 1,
      activeParticipationRating: formData.activeParticipationRating || "N/A",
      activeParticipationExample: formData.activeParticipationExample || "",
      activeParticipationExplanation:
        formData.activeParticipationExplanation || "",
      positiveTeamCultureScore: formData.positiveTeamCultureScore || 1,
      positiveTeamCultureRating: formData.positiveTeamCultureRating || "N/A",
      positiveTeamCultureExample: formData.positiveTeamCultureExample || "",
      positiveTeamCultureExplanation:
        formData.positiveTeamCultureExplanation || "",
      effectiveCommunicationScore: formData.effectiveCommunicationScore || 1,
      effectiveCommunicationRating:
        formData.effectiveCommunicationRating || "N/A",
      effectiveCommunicationExample:
        formData.effectiveCommunicationExample || "",
      effectiveCommunicationExplanation:
        formData.effectiveCommunicationExplanation || "",
    },
  });

  const handleSubmit = form.handleSubmit((values: PerformanceFormValues) => {
    console.log("Form 4 final values before submission:", values);

    // Calculate overall Teamwork score
    const teamworkScores = [
      Number(values.activeParticipationScore),
      Number(values.positiveTeamCultureScore),
      Number(values.effectiveCommunicationScore),
    ].filter((score) => score !== undefined);

    const overallTeamworkScore =
      teamworkScores.length > 0
        ? teamworkScores.reduce((sum, score) => sum + score, 0) /
          teamworkScores.length
        : 0;

    // Ensure all form fields are included in the data
    const updatedValues = {
      ...values, // Include all existing form values
      // Part IV - Teamwork
      activeParticipationScore: Number(values.activeParticipationScore),
      activeParticipationRating: values.activeParticipationRating,
      activeParticipationExample: values.activeParticipationExample,
      activeParticipationExplanation: values.activeParticipationExplanation,
      positiveTeamCultureScore: Number(values.positiveTeamCultureScore),
      positiveTeamCultureRating: values.positiveTeamCultureRating,
      positiveTeamCultureExample: values.positiveTeamCultureExample,
      positiveTeamCultureExplanation: values.positiveTeamCultureExplanation,
      effectiveCommunicationScore: Number(values.effectiveCommunicationScore),
      effectiveCommunicationRating: values.effectiveCommunicationRating,
      effectiveCommunicationExample: values.effectiveCommunicationExample,
      effectiveCommunicationExplanation:
        values.effectiveCommunicationExplanation,

      // Calculated scores
      overallTeamworkScore,
    };

    console.log("Form 4 data being passed to parent:", updatedValues);
    onComplete(updatedValues);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-8">

{/* Rating Scale Section */}
<div className="border p-4 rounded-md">
          <h3 className="text-lg font-bold mb-2">RATING SCALE</h3>
          <p className="text-sm mb-4">
            Ratings will be made on a scale of 1-5. Choose your rating from the
            drop down option. Make use of the guide below when rating each
            employee.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 bg-white">
              <thead>
                <tr>
                  <th className="p-2 border text-center">1</th>
                  <th className="p-2 border text-center">2</th>
                  <th className="p-2 border text-center">3</th>
                  <th className="p-2 border text-center">4</th>
                  <th className="p-2 border text-center">5</th>
                </tr>
                <tr>
                  <th className="p-2 border text-center">Unsatisfactory</th>
                  <th className="p-2 border text-center">Needs Improvement</th>
                  <th className="p-2 border text-center">Meets Expectations</th>
                  <th className="p-2 border text-center">
                    Exceeds Expectations
                  </th>
                  <th className="p-2 border text-center">Outstanding</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border text-sm">
                    Performance falls below expectations: Fails to meet the
                    minimum standards
                  </td>
                  <td className="p-2 border text-sm">
                    Basic competence present: Meets some expectations but fails
                    in many areas
                  </td>
                  <td className="p-2 border text-sm">
                    Basic competence achieved: Performance meets the
                    expectations for the role
                  </td>
                  <td className="p-2 border text-sm">
                    Consistently strong performance: Goes beyond the standard
                    expectations
                  </td>
                  <td className="p-2 border text-sm">
                    Exceptional performance: Consistently exceeds expectations
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border text-sm">
                    Immediate improvement needed, Requires urgent attention
                  </td>
                  <td className="p-2 border text-sm">
                    Performance is below the desired level in certain aspects
                  </td>
                  <td className="p-2 border text-sm">
                    Adequate: Achieves the required standards and competencies
                  </td>
                  <td className="p-2 border text-sm">
                    Highly competent: Demonstrates proficiency in role
                    requirements
                  </td>
                  <td className="p-2 border text-sm">
                    Excellent: Demonstrates outstanding skills and leadership
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border text-sm">
                    Basic aspects of the role are not met
                  </td>
                  <td className="p-2 border text-sm">
                    Does not yet consistently meet performance standards
                  </td>
                  <td className="p-2 border text-sm">
                    Consistently performs at an acceptable level
                  </td>
                  <td className="p-2 border text-sm">
                    Makes positive contributions that exceed typical
                    expectations
                  </td>
                  <td className="p-2 border text-sm">
                    Significant positive impact and a positive influence on the
                    organization
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-semibold">PART IV. TEAMWORK</h3>
          <p className="text-md text-muted-foreground">
            Ability to work well with others. Contribution to team goals and
            projects. Supportiveness of team members.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border left-0"></th>
                  <th className="p-2 border text-left">
                    Behavioral Indicators
                  </th>
                  <th className="p-2 border text-left">Example</th>
                  <th className="p-2 border text-center">Score</th>
                  <th className="p-2 border text-center">Rating</th>
                  <th className="p-2 border text-center">Explanation</th>
                </tr>
              </thead>
              <tbody>
                {/* Active Participation */}
                <tr>
                  <td className="p-2 border align-center font-bold">
                    Active Participation in Team Activities
                  </td>

                  <td className="p-2 border align-top">
                    Actively participates in team meetings, projects, and
                    collaborative activities
                  </td>
                  <td className="p-2 border align-top">
                    <p className="text-md">
                      Welcomes changes in work processes, procedures, or tools
                      without resistance. Maintains a cooperative attitude when
                      asked to adjust to new ways of working.
                    </p>
                  </td>
                  <td className="p-2 border align-top text-center">
                    <FormField
                      control={form.control}
                      name="activeParticipationScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              min={1.0}
                              max={5.0}
                              step={0.1}
                              value={field.value as number}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const value = parseFloat(e.target.value);
                                field.onChange(Math.min(Math.max(value, 1.0), 5.0));
                              }}
                              className="w-20 h-10 border-black"
                              placeholder="1.0 - 5.0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="p-2 border align-top text-center font-bold text-blue-600">
                    {RatingScale(form.watch("activeParticipationScore"))}
                  </td>
                  <td className="p-2 border align-top">
                    <FormField
                      control={form.control}
                      name="activeParticipationExplanation"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Add explanation..."
                              className="min-h-[120px] md:min-h-[160px] w-[350px] md:w-[500px] text-base p-3"
                              value={String(field.value || "")}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                </tr>

                {/* Positive Team Culture */}
                <tr>
                  <td className="p-2 border align-center font-bold">
                    Promotion of a Positive Team Culture
                  </td>

                  <td className="p-2 border align-top">
                    Interacts with coworkers in a positive and constructive
                    manner. Contributes to fostering a positive and inclusive
                    team culture
                  </td>
                  <td className="p-2 border align-top">
                    <p className="text-md ">
                      Quickly adjusts to changes in job assignments, schedules,
                      or unexpected demands. Helps cover additional
                      responsibilities during staffing shortages or high
                      workloads.
                    </p>
                  </td>
                  <td className="p-2 border align-top text-center">
                    <FormField
                      control={form.control}
                      name="positiveTeamCultureScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              min={1.0}
                              max={5.0}
                              step={0.1}
                              value={field.value as number}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const value = parseFloat(e.target.value);
                                field.onChange(Math.min(Math.max(value, 1.0), 5.0));
                              }}
                              className="w-20 h-10 border-black"
                              placeholder="1.0 - 5.0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="p-2 border align-top text-center font-bold text-blue-600">
                    {RatingScale(form.watch("positiveTeamCultureScore"))}
                  </td>
                  <td className="p-2 border align-top">
                    <FormField
                      control={form.control}
                      name="positiveTeamCultureExplanation"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Add explanation..."
                              className="min-h-[120px] md:min-h-[160px] w-[350px] md:w-[500px] text-base p-3"
                              value={String(field.value || "")}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                </tr>

                {/* Effective Communication */}
                <tr>
                  <td className="p-2 border align-center font-bold">
                    Effective Communication
                  </td>

                  <td className="p-2 border align-top">
                    Communicates openly and clearly with team members
                  </td>
                  <td className="p-2 border align-top">
                    <p className="text-md">
                      Remains focused and effective during periods of high
                      stress or uncertainty. Completes tasks or meets deadlines
                      when faced with unforeseen obstacles.
                    </p>
                  </td>
                  <td className="p-2 border align-top text-center">
                    <FormField
                      control={form.control}
                      name="effectiveCommunicationScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              min={1.0}
                              max={5.0}
                              step={0.1}
                              value={field.value as number}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const value = parseFloat(e.target.value);
                                field.onChange(Math.min(Math.max(value, 1.0), 5.0));
                              }}
                              className="w-20 h-10 border-black"
                              placeholder="1.0 - 5.0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="p-2 border align-top text-center font-bold text-blue-600">
                    {RatingScale(form.watch("effectiveCommunicationScore"))}
                  </td>
                  <td className="p-2 border align-top">
                    <FormField
                      control={form.control}
                      name="effectiveCommunicationExplanation"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Add explanation..."
                              className="min-h-[120px] md:min-h-[160px] w-[350px] md:w-[500px] text-base p-3"
                              value={String(field.value || "")}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Overall Teamwork Score */}
          <div className="mt-6">
            <Card className="bg-muted/100 border border-primary/50">
              <CardContent className="pt-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Overall Teamwork Score :
                  </h3>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">
                      {Math.min(
                        ((Number(form.watch("activeParticipationScore")) || 0) +
                          (Number(form.watch("positiveTeamCultureScore")) ||
                            0) +
                          (Number(form.watch("effectiveCommunicationScore")) ||
                            0)) /
                          3,
                        5
                      ).toFixed(2)}
                    </div>
                    <div className="text-2xl font-bold text-black ">
                      Total Rating:{" "}
                      {RatingScale(
                        Math.min(
                          ((Number(form.watch("activeParticipationScore")) ||
                            0) +
                            (Number(form.watch("positiveTeamCultureScore")) ||
                              0) +
                            (Number(
                              form.watch("effectiveCommunicationScore")
                            ) || 0)) /
                            3,
                          5
                        )
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button
            className="bg-blue-400 text-white hover:text-black hover:bg-yellow-400"
            type="button"
            variant="outline"
            onClick={() => setActivePart(3)}
          >
            Back: to Part III
          </Button>

          <Button
            className="bg-blue-500 text-white hover:text-black hover:bg-yellow-400"
            type="button"
            onClick={async () => {
              // Only trigger validation for Teamwork fields
              const isValid = await form.trigger([
                "activeParticipationScore",
                "activeParticipationRating",
                "positiveTeamCultureScore",
                "positiveTeamCultureRating",
                "effectiveCommunicationScore",
                "effectiveCommunicationRating",
              ]);

              if (!isValid) {
                alert("Please fill in all required ratings before proceeding");
                return;
              }

              // If validation passes, submit the form
              const formState = form.getValues();
              const updatedValues = {
                ...formData,
                ...formState,
                activeParticipationScore:
                  formState.activeParticipationScore || 0,
                activeParticipationRating: formState.activeParticipationRating,
                activeParticipationExample:
                  formState.activeParticipationExample || "",
                activeParticipationExplanation:
                  formState.activeParticipationExplanation || "",
                positiveTeamCultureScore:
                  formState.positiveTeamCultureScore || 0,
                positiveTeamCultureRating: formState.positiveTeamCultureRating,
                positiveTeamCultureExample:
                  formState.positiveTeamCultureExample || "",
                positiveTeamCultureExplanation:
                  formState.positiveTeamCultureExplanation || "",
                effectiveCommunicationScore:
                  formState.effectiveCommunicationScore || 0,
                effectiveCommunicationRating:
                  formState.effectiveCommunicationRating,
                effectiveCommunicationExample:
                  formState.effectiveCommunicationExample || "",
                effectiveCommunicationExplanation:
                  formState.effectiveCommunicationExplanation || "",
              };

              onComplete(updatedValues);
              setActivePart(5);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Next: to Part V
          </Button>
        </div>
      </form>
    </Form>
  );
}
