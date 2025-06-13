import React from "react";
import { Card, CardContent } from "./ui/card";
import { Form } from "@/components/ui/form";
import RatingScale from "@/app/constants/rating-scale";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formSchema,
  PerformanceFormValues,
} from "../lib/validation-schema/form-schema";
import { Input } from "@/components/ui/input";

interface PerformanceForm5Props {
  activePart: number;
  setActivePart: React.Dispatch<React.SetStateAction<number>>;
  onComplete: (data: PerformanceFormValues) => void;
  formData: PerformanceFormValues;
}

export default function PerformanceForm5({
  setActivePart,
  onComplete,
  formData,
}: PerformanceForm5Props): React.JSX.Element {
  const form = useForm<PerformanceFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      ...formData,
      // Reliability fields (Part V)
      consistentAttendanceScore: formData.consistentAttendanceScore || 1,
      consistentAttendanceExplanation:
        formData.consistentAttendanceExplanation || "",
      punctualityScore: formData.punctualityScore || 1,
      punctualityExplanation: formData.punctualityExplanation || "",
      followsThroughScore: formData.followsThroughScore || 1,
      followsThroughExplanation: formData.followsThroughExplanation || "",
      reliableHandlingScore: formData.reliableHandlingScore || 1,
      reliableHandlingExplanation: formData.reliableHandlingExplanation || "",
    },
  });

  const handleSubmit = form.handleSubmit((values: PerformanceFormValues) => {
    const updatedValues = {
      ...formData, // Keep existing form data
      ...values, // Add new values
      // Ensure numeric values are preserved
      consistentAttendanceScore: values.consistentAttendanceScore || 1,
      consistentAttendanceExplanation:
        values.consistentAttendanceExplanation || "",
      punctualityScore: values.punctualityScore || 1,
      punctualityExplanation: values.punctualityExplanation || "",
      followsThroughScore: values.followsThroughScore || 1,
      followsThroughExplanation: values.followsThroughExplanation || "",
      reliableHandlingScore: values.reliableHandlingScore || 1,
      reliableHandlingExplanation: values.reliableHandlingExplanation || "",
    };

    // Calculate overall Reliability score
    const reliabilityScores = [
      updatedValues.consistentAttendanceScore,
      updatedValues.punctualityScore,
      updatedValues.followsThroughScore,
      updatedValues.reliableHandlingScore,
    ].filter((score) => score !== undefined);
    const overallReliabilityScore =
      reliabilityScores.length > 0
        ? reliabilityScores.reduce((sum, score) => sum + score, 0) /
          reliabilityScores.length
        : 0;

    onComplete({ ...updatedValues, overallReliabilityScore });
    setActivePart(6); // Navigate to Part VI (Overall Assessment)
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
          <h3 className="text-lg font-semibold">PART V. RELIABILITY</h3>
          <p className="text-md text-muted-foreground">
            Consistency in attendance and punctuality. Meeting commitments and
            fulfilling responsibilities.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 bg-white">
              <thead className="bg-gray-100">
                <tr>
                  {/* Header for the Main Category column */}
                  <th className="p-2 border text-left"></th>
                  <th className="p-2 border text-left">
                    Behavioral Indicators
                  </th>
                  <th className="p-2 border text-left">Example</th>
                  <th className="p-2 border text-center">Score</th>
                  <th className="p-2 border text-center">Rating</th>
                  <th className="p-2 border text-center">Explanation</th>
                </tr>
              </thead>
              <tbody className="text-md text-black">
                {/* Consistent Attendance */}
                <tr>
                  <td className="p-2 border align-center font-bold">
                    Consistent Attendance
                  </td>
                  <td className="p-2 border align-top">
                    <div className="text-md text-black">
                      Demonstrates regular attendance by being present at work
                      as scheduled
                    </div>
                  </td>
                  <td className="p-2 border align-top">
                    <div className="text-md text-black">
                      Has not taken any unplanned absences and follows the
                      company`s attendance policy.
                      <br />
                      Grading Guide:
                      <br />
                      (1) 5+ absences in a month
                      <br />
                      (2) 3-4 absences in a month
                      <br />
                      (3) 1-2 absences in a month
                      <br />
                      (4) 2 absences in a quarter
                      <br />
                      (5) 1 absence or no absence in a quarter
                    </div>
                  </td>
                  <td className="p-2 border align-top text-center">
                    <FormField
                      control={form.control}
                      name="consistentAttendanceScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              min={1.0}
                              max={5.0}
                              step={0.1}
                              value={field.value as number}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                field.onChange(
                                  Math.min(Math.max(value, 1.0), 5.0)
                                );
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
                    {RatingScale(
                      form.watch("consistentAttendanceScore") as number
                    )}
                  </td>
                  <td className="p-2 border align-top">
                    <FormField
                      control={form.control}
                      name="consistentAttendanceExplanation"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Add explanation..."
                              className="min-h-[120px] w-[350px] md:w-[500px] text-base p-3"
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

                {/* Punctuality */}
                <tr>
                  <td className="p-2 border align-center font-bold">
                    Punctuality
                  </td>
                  <td className="p-2 border align-top">
                    <div className="text-md text-black">
                      Arrives at work and meetings on time or before the
                      scheduled time
                    </div>
                  </td>
                  <td className="p-2 border align-top">
                    <div className="text-md text-black">
                      Consistently arrives at work on time, ready to begin work
                      promptly.
                      <br />
                      Guide Guide:
                      <br />
                      (1) 10+ lates in a month
                      <br />
                      (2) 7-9 lates in a month
                      <br />
                      (3) 4-6 lates in a month
                      <br />
                      (4) 2-3 lates in a month
                      <br />
                      (5) 1 late or never late in a month
                    </div>
                  </td>
                  <td className="p-2 border align-top text-center">
                    <FormField
                      control={form.control}
                      name="punctualityScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              min={1.0}
                              max={5.0}
                              step={0.1}
                              value={field.value as number}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                field.onChange(
                                  Math.min(Math.max(value, 1.0), 5.0)
                                );
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
                    {RatingScale(form.watch("punctualityScore") as number)}
                  </td>
                  <td className="p-2 border align-top">
                    <FormField
                      control={form.control}
                      name="punctualityExplanation"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Add explanation..."
                              className="min-h-[120px] w-[350px] md:w-[500px] text-base p-3"
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

                {/* Follows Through on Commitments */}
                <tr>
                  <td className="p-2 border align-center font-bold">
                    Follows Through on Commitments
                  </td>
                  <td className="p-2 border align-top">
                    <div className="text-md text-black">
                      Follows through on assignments from and commitments made
                      to coworkers or superiors
                    </div>
                  </td>
                  <td className="p-2 border align-top">
                    <div className="text-md text-black">
                      Delivers on commitments, ensuring that expectations are
                      met or exceeded.
                    </div>
                  </td>
                  <td className="p-2 border align-top text-center">
                    <FormField
                      control={form.control}
                      name="followsThroughScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              min={1.0}
                              max={5.0}
                              step={0.1}
                              value={field.value as number}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                field.onChange(
                                  Math.min(Math.max(value, 1.0), 5.0)
                                );
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
                    {RatingScale(form.watch("followsThroughScore") as number)}
                  </td>
                  <td className="p-2 border align-top">
                    <FormField
                      control={form.control}
                      name="followsThroughExplanation"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Add explanation..."
                              className="min-h-[120px] w-[350px] md:w-[500px] text-base p-3"
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

                {/* Reliable Handling of Routine Tasks */}
                <tr>
                  <td className="p-2 border align-center font-bold">
                    Reliable Handling of Routine Tasks
                  </td>
                  <td className="p-2 border align-top">
                    <div className="text-md text-black">
                      Demonstrates reliability in completing routine tasks
                    </div>
                  </td>
                  <td className="p-2 border align-top">
                    <div className="text-md text-black">
                      Handles regular responsibilities consistently and without supervision
                    </div>
                  </td>
                  <td className="p-2 border align-top text-center">
                    <FormField
                      control={form.control}
                      name="reliableHandlingScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              min={1.0}
                              max={5.0}
                              step={0.1}
                              value={field.value as number}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                field.onChange(
                                  Math.min(Math.max(value, 1.0), 5.0)
                                );
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
                    {RatingScale(form.watch("reliableHandlingScore") as number)}
                  </td>
                  <td className="p-2 border align-top">
                    <FormField
                      control={form.control}
                      name="reliableHandlingExplanation"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Add explanation..."
                              className="min-h-[120px] w-[350px] md:w-[500px] text-base p-3"
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
        </div>

        {/* Overall Reliability Score Display */}
        <div className="mt-6">
          <Card className="bg-muted/100 border border-primary/50">
            <CardContent className="pt-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Overall Reliability Score :
                </h3>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    {Math.min(
                      ((Number(form.watch("consistentAttendanceScore")) || 0) +
                        (Number(form.watch("punctualityScore")) || 0) +
                        (Number(form.watch("followsThroughScore")) || 0) +
                        (Number(form.watch("reliableHandlingScore")) || 0)) /
                        4,
                      5
                    ).toFixed(2)}
                  </div>
                  <div className="text-2xl font-bold text-black ">
                    Total Rating:{" "}
                    {RatingScale(
                      Math.min(
                        ((Number(form.watch("consistentAttendanceScore")) ||
                          0) +
                          (Number(form.watch("punctualityScore")) || 0) +
                          (Number(form.watch("followsThroughScore")) || 0) +
                          (Number(form.watch("reliableHandlingScore")) || 0)) /
                          4,
                        5
                      )
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between mt-6">
          <Button
            className="bg-blue-400 text-white hover:text-black hover:bg-yellow-400"
            type="button"
            variant="outline"
            onClick={() => setActivePart(4)}
          >
            Back: to Part IV
          </Button>

          <Button
            className="bg-blue-500 text-white hover:text-black hover:bg-yellow-400"
            type="button"
            onClick={async () => {
              // Only trigger validation for Reliability fields
              const isValid = await form.trigger([
                "consistentAttendanceScore",
                "punctualityScore",
                "followsThroughScore",
                "reliableHandlingScore",
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
                consistentAttendanceScore:
                  formState.consistentAttendanceScore || 0,
                consistentAttendanceExplanation:
                  formState.consistentAttendanceExplanation || "",
                punctualityScore: formState.punctualityScore || 0,
                punctualityExplanation: formState.punctualityExplanation || "",
                followsThroughScore: formState.followsThroughScore || 0,
                followsThroughExplanation:
                  formState.followsThroughExplanation || "",
                reliableHandlingScore: formState.reliableHandlingScore || 0,
                reliableHandlingExplanation:
                  formState.reliableHandlingExplanation || "",
              };

              onComplete(updatedValues);
              setActivePart(6);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Next: to Part VI
          </Button>
        </div>
      </form>
    </Form>
  );
}
