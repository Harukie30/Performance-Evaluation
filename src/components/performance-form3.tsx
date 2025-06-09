import React from 'react';
import { Card, CardContent } from "./ui/card";
import { Form } from "@/components/ui/form";
import RatingScale from "@/app/constants/rating-scale";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formSchema,
  PerformanceFormValues,
} from "../lib/validation-schema/form-schema";
import { Input } from "@/components/ui/input";

interface PerformanceForm3Props {
  activePart: number;
  setActivePart: React.Dispatch<React.SetStateAction<number>>;
  onComplete: (data: PerformanceFormValues) => void;
  formData: PerformanceFormValues;
}

export default function PerformanceForm3({
  setActivePart,
  onComplete,
  formData,
}: PerformanceForm3Props): React.JSX.Element {
  const form = useForm<PerformanceFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      ...formData,
      adaptabilityOpenness: Number(formData.adaptabilityOpenness) || 1,
      adaptabilityOpennessComments: formData.adaptabilityOpennessComments || "",
      adaptabilityFlexibility: Number(formData.adaptabilityFlexibility) || 1,
      adaptabilityFlexibilityComments: formData.adaptabilityFlexibilityComments || "",
      adaptabilityResilience: Number(formData.adaptabilityResilience) || 1,
      adaptabilityResilienceComments: formData.adaptabilityResilienceComments || "",
    },
    mode: "onChange",
  });

  // Add type guard for numeric fields
  const getNumericValue = (value: unknown): number => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  const handleSubmit = form.handleSubmit((data: Partial<PerformanceFormValues>) => {
    const values = {
      ...formData,
      ...data,
      adaptabilityOpenness: getNumericValue(data.adaptabilityOpenness),
      adaptabilityFlexibility: getNumericValue(data.adaptabilityFlexibility),
      adaptabilityResilience: getNumericValue(data.adaptabilityResilience),
    } as PerformanceFormValues;

    console.log("Form 3 values before submission:", values);

    // Calculate overall Adaptability score
    const adaptabilityScores = [
      Number(values.adaptabilityOpenness),
      Number(values.adaptabilityFlexibility),
      Number(values.adaptabilityResilience),
    ].filter((score) => !isNaN(score));

    // Ensure all form fields are included in the data
    const updatedValues: PerformanceFormValues = {
      ...formData,
      ...values,
      // Part III - Adaptability
      adaptabilityOpenness: Number(values.adaptabilityOpenness) || 0,
      adaptabilityOpennessComments: values.adaptabilityOpennessComments || "",
      adaptabilityFlexibility: Number(values.adaptabilityFlexibility) || 0,
      adaptabilityFlexibilityComments: values.adaptabilityFlexibilityComments || "",
      adaptabilityResilience: Number(values.adaptabilityResilience) || 0,
      adaptabilityResilienceComments: values.adaptabilityResilienceComments || "",
      overallTeamworkScore: adaptabilityScores.length > 0
        ? adaptabilityScores.reduce((sum, score) => sum + score, 0) /
          adaptabilityScores.length
        : 0,
    };

    console.log("Form 3 data being passed to parent:", updatedValues);
    onComplete(updatedValues);
    setActivePart(4);
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
          <h3 className="text-lg font-semibold">PART III. ADAPTABILITY</h3>
          <p className="text-md text-muted-foreground">
            Flexibility in handling change. Ability to work effectively in
            diverse situations. Resilience in the face of challenges.
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
                {/* Openness to Change */}
                <tr>
                  <td className="p-2 border align-center font-bold">
                    &ldquo;Openness to Change (attitude towards change)&rdquo;
                  </td>
                  <td className="p-2 border align-top">
                    Demonstrates a positive attitude and openness to new ideas
                    and major changes at work
                  </td>
                  <td className="p-2 border align-top">
                    Welcomes changes in work processes, procedures, or tools
                    without resistance. Maintains a cooperative attitude when
                    asked to adjust to new ways of working.
                  </td>
                  <td className="p-2 border align-top text-center">
                    <FormField
                      control={form.control}
                      name="adaptabilityOpenness"
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
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="p-2 border align-top text-center font-bold text-blue-600">
                    {RatingScale(getNumericValue(form.watch("adaptabilityOpenness")))}
                  </td>
                  <td className="p-2 border align-top">
                    <FormField
                      control={form.control}
                      name="adaptabilityOpennessComments"
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
                        </FormItem>
                      )}
                    />
                  </td>
                </tr>
                {/* Flexibility in Job Role */}
                <tr>
                  <td className="p-2 border align-center font-bold">
                    &ldquo;Flexibility in Job Role (ability to adapt to
                    changes)&rdquo;
                  </td>

                  <td className="p-2 border align-top">
                    Adapts to changes in job responsibilities and willingly
                    takes on new tasks
                  </td>
                  <td className="p-2 border align-top">
                    Quickly adjusts to changes in job assignments, schedules, or
                    unexpected demands. Helps cover additional responsibilities
                    during staffing shortages or high workloads.
                  </td>
                  <td className="p-2 border align-top text-center">
                    <FormField
                      control={form.control}
                      name="adaptabilityFlexibility"
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
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="p-2 border align-top text-center font-bold text-blue-600">
                    {RatingScale(getNumericValue(form.watch("adaptabilityFlexibility")))}
                  </td>
                  <td className="p-2 border align-top">
                    <FormField
                      control={form.control}
                      name="adaptabilityFlexibilityComments"
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
                        </FormItem>
                      )}
                    />
                  </td>
                </tr>
                {/* Resilience in the Face of Challenges */}
                <tr>
                  <td className="p-2 border align-center font-bold">
                    Resilience in the Face of Challenges
                  </td>

                  <td className="p-2 border align-top">
                    Maintains a positive attitude and performance under
                    challenging or difficult conditions
                  </td>
                  <td className="p-2 border align-top">
                    Remains focused and effective during periods of high stress
                    or uncertainty. Completes tasks or meets deadlines when
                    faced with unforeseen obstacles.
                  </td>
                  <td className="p-2 border align-top text-center">
                    <FormField
                      control={form.control}
                      name="adaptabilityResilience"
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
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="p-2 border align-top text-center font-bold text-blue-600">
                    {RatingScale(getNumericValue(form.watch("adaptabilityResilience")))}
                  </td>
                  <td className="p-2 border align-top">
                    <FormField
                      control={form.control}
                      name="adaptabilityResilienceComments"
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
                        </FormItem>
                      )}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Overall Adaptability Score */}
        <div className="mt-6">
          <Card className="bg-muted/100 border border-primary/50">
            <CardContent className="pt-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Overall Adaptability Score :
                </h3>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    {Math.min(
                      ((Number(form.watch("adaptabilityOpenness")) || 0) +
                        (Number(form.watch("adaptabilityFlexibility")) || 0) +
                        (Number(form.watch("adaptabilityResilience")) || 0)) /
                        3,
                      5
                    ).toFixed(2)}
                  </div>
                  <div className="text-2xl font-bold text-black ">
                    Total Rating:{" "}
                    {RatingScale(
                      Math.min(
                        ((Number(form.watch("adaptabilityOpenness")) || 0) +
                          (Number(form.watch("adaptabilityFlexibility")) || 0) +
                          (Number(form.watch("adaptabilityResilience")) || 0)) /
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

        <div className="flex justify-between mt-6">
          <Button
            className="bg-blue-400 text-white hover:text-black hover:bg-yellow-400"
            type="button"
            variant="outline"
            onClick={() => setActivePart(2)}
          >
            Back: to Part II
          </Button>

          <Button
            className="bg-blue-500 text-white hover:text-black hover:bg-yellow-400"
            type="button"
            onClick={async () => {
              // Only trigger validation for Adaptability fields
              const isValid = await form.trigger([
                "adaptabilityOpenness",
                "adaptabilityFlexibility",
                "adaptabilityResilience",
              ]);

              if (!isValid) {
                alert("Please fill in all required ratings before proceeding");
                return;
              }

              // If validation passes, submit the form
              const formState = form.getValues();
              const updatedValues: PerformanceFormValues = {
                ...formData,
                ...formState,
                adaptabilityOpenness: Number(formState.adaptabilityOpenness) || 0,
                adaptabilityFlexibility: Number(formState.adaptabilityFlexibility) || 0,
                adaptabilityResilience: Number(formState.adaptabilityResilience) || 0,
                adaptabilityOpennessComments: formState.adaptabilityOpennessComments || "",
                adaptabilityFlexibilityComments: formState.adaptabilityFlexibilityComments || "",
                adaptabilityResilienceComments: formState.adaptabilityResilienceComments || "",
              };

              onComplete(updatedValues);
              setActivePart(4);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Next: to Part IV
          </Button>
        </div>
      </form>
    </Form>
  );
}
