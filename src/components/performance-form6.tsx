import React from 'react';
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
} from "@/lib/validation-schema/form-schema";
import { Input } from "@/components/ui/input";

interface PerformanceForm6Props {
  activePart: number;
  setActivePart: React.Dispatch<React.SetStateAction<number>>;
  onComplete: (data: PerformanceFormValues) => void;
  formData: PerformanceFormValues;
}

export default function PerformanceForm6({
  setActivePart,
  onComplete,
  formData,
}: PerformanceForm6Props): React.JSX.Element {
  const form = useForm<PerformanceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...formData,
      // Ethical & Professional Behavior fields
      ethicalFollowsPoliciesScore: formData.ethicalFollowsPoliciesScore || 1,
      ethicalFollowsPoliciesExplanation:
        formData.ethicalFollowsPoliciesExplanation || "",
      ethicalProfessionalismScore: formData.ethicalProfessionalismScore || 1,
      ethicalProfessionalismExplanation:
        formData.ethicalProfessionalismExplanation || "",
      ethicalAccountabilityScore: formData.ethicalAccountabilityScore || 1,
      ethicalAccountabilityExplanation:
        formData.ethicalAccountabilityExplanation || "",
      ethicalRespectScore: formData.ethicalRespectScore || 1,
      ethicalRespectExplanation: formData.ethicalRespectExplanation || "",
      // Overall Assessment fields (moved to Part VII)
      overallPerformanceScore: formData.overallPerformanceScore || 1,
      overallPerformanceRating: formData.overallPerformanceRating || "N/A", // This rating will be based on the score
      overallPerformanceExplanation:
        formData.overallPerformanceExplanation || "",
      keyStrengths: formData.keyStrengths || "",
      areasForImprovement: formData.areasForImprovement || "",
      developmentGoals: formData.developmentGoals || "",
      additionalComments: formData.additionalComments || "",
    },
  });

  const handleSubmit = form.handleSubmit((values: PerformanceFormValues) => {
    const updatedValues = {
      ...formData, // Keep existing form data
      ...values, // Add new values
      // Ethical & Professional Behavior fields
      ethicalFollowsPoliciesScore: values.ethicalFollowsPoliciesScore || 1,
      ethicalFollowsPoliciesExplanation:
        values.ethicalFollowsPoliciesExplanation || "",
      ethicalProfessionalismScore: values.ethicalProfessionalismScore || 1,
      ethicalProfessionalismExplanation:
        values.ethicalProfessionalismExplanation || "",
      ethicalAccountabilityScore: values.ethicalAccountabilityScore || 1,
      ethicalAccountabilityExplanation:
        values.ethicalAccountabilityExplanation || "",
      ethicalRespectScore: values.ethicalRespectScore || 1,
      ethicalRespectExplanation: values.ethicalRespectExplanation || "",
      // Overall Assessment fields (moved to Part VII)
      overallPerformanceScore: values.overallPerformanceScore || 1,
      overallPerformanceRating: values.overallPerformanceRating || "N/A", // This rating will be based on the score
      overallPerformanceExplanation: values.overallPerformanceExplanation || "",
      keyStrengths: values.keyStrengths || "",
      areasForImprovement: values.areasForImprovement || "",
      developmentGoals: values.developmentGoals || "",
      additionalComments: values.additionalComments || "",
    };

    onComplete(updatedValues);
    setActivePart(7); // Navigate to Part VII (Overall Assessment)
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
          <h3 className="text-lg font-semibold">
            PART VI. ETHICAL & PROFESSIONAL BEHAVIOR
          </h3>
          <p className="text-md text-muted-foreground">
            Complies with company policies and ethical standards. Accountability
            for one&apos;s actions. Professionalism in interactions with
            coworkers and clients.
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
                {/* Follows Company Policies */}
                <tr>
                  <td className="p-2 border align-center font-bold ">
                    Follows Company Policies
                  </td>

                  <td className="p-2 border align-top">
                    Follows Company Policies
                  </td>
                  <td className="p-2 border align-top text-md">
                    Complies with company rules, regulations, and memorandums
                  </td>
                  <td className="p-2 border align-top text-center">
                    <FormField
                      control={form.control}
                      name="ethicalFollowsPoliciesScore"
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
                    {RatingScale(form.watch("ethicalFollowsPoliciesScore"))}
                  </td>
                  <td className="p-2 border align-top">
                    <FormField
                      control={form.control}
                      name="ethicalFollowsPoliciesExplanation"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Add explanation..."
                              className="min-h-[120px] w-[400px] text-base p-3"
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

                {/* Professionalism (L.E.A.D.E.R.) */}
                <tr>
                  <td className="p-2 border align-center font-bold">
                    &ldquo;Professionalism (L.E.A.D.E.R.)&rdquo;
                  </td>
                  <td className="p-2 border align-top">
                    Professionalism (L.E.A.D.E.R.)
                  </td>
                  <td className="p-2 border align-top text-md">
                    Maintains a high level of professionalism in all work
                    interactions
                  </td>
                  <td className="p-2 border align-top text-center">
                    <FormField
                      control={form.control}
                      name="ethicalProfessionalismScore"
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
                    {RatingScale(form.watch("ethicalProfessionalismScore"))}
                  </td>
                  <td className="p-2 border align-top">
                    <FormField
                      control={form.control}
                      name="ethicalProfessionalismExplanation"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Add explanation..."
                              className="min-h-[120px] w-[400px] text-base p-3"
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

                {/* Accountability for Mistakes (L.E.A.D.E.R.) */}
                <tr>
                  <td className="p-2 border align-center font-bold">
                    &ldquo;Accountability for Mistakes (L.E.A.D.E.R.)&rdquo;
                  </td>
                  <td className="p-2 border align-top">
                    Takes responsibility for errors and actively works to
                    correct mistakes
                  </td>
                  <td className="p-2 border align-top text-md">
                    Acknowledges errors promptly, communicates about corrective
                    actions, and learns from the experience. Takes ownership of
                    mistakes and actively seeks ways to prevent future
                    occurences.
                  </td>
                  <td className="p-2 border align-top text-center">
                    <FormField
                      control={form.control}
                      name="ethicalAccountabilityScore"
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
                    {RatingScale(form.watch("ethicalAccountabilityScore"))}
                  </td>
                  <td className="p-2 border align-top">
                    <FormField
                      control={form.control}
                      name="ethicalAccountabilityExplanation"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Add explanation..."
                              className="min-h-[120px] w-[400px] text-base p-3"
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

                {/* Respect for Others (L.E.A.D.E.R.) */}
                <tr>
                  <td className="p-2 border align-center font-bold">
                    &ldquo;Respect for Others (L.E.A.D.E.R.)&rdquo;
                  </td>
                  <td className="p-2 border align-top">
                    Treats all individuals fairly and with respect, regardless
                    of background or position
                  </td>
                  <td className="p-2 border align-top text-md">
                    Demonstrates unbiased decision-making and avoids favoritism
                    in interactions with team members. Treats all coworkers and
                    suppliers respectfully, with dignity and fairness.
                  </td>
                  <td className="p-2 border align-top text-center">
                    <FormField
                      control={form.control}
                      name="ethicalRespectScore"
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
                    {RatingScale(form.watch("ethicalRespectScore"))}
                  </td>
                  <td className="p-2 border align-top">
                    <FormField
                      control={form.control}
                      name="ethicalRespectExplanation"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Add explanation..."
                              className="min-h-[120px] w-[400px] text-base p-3"
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

          {/* Overall Ethical & Professional Behavior Score */}
          <div className="mt-6">
            <Card className="bg-muted/100 border border-primary/50">
              <CardContent className="pt-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Overall Ethical & Professional Behavior Score :
                  </h3>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">
                      {Math.min(
                        ((Number(form.watch("ethicalFollowsPoliciesScore")) ||
                          0) +
                          (Number(form.watch("ethicalProfessionalismScore")) ||
                            0) +
                          (Number(form.watch("ethicalAccountabilityScore")) ||
                            0) +
                          (Number(form.watch("ethicalRespectScore")) || 0)) /
                          4,
                        5
                      ).toFixed(2)}
                    </div>
                    <div className="text-2xl font-bold text-black ">
                      Total Rating:{" "}
                      {RatingScale(
                        Math.min(
                          ((Number(form.watch("ethicalFollowsPoliciesScore")) ||
                            0) +
                            (Number(
                              form.watch("ethicalProfessionalismScore")
                            ) || 0) +
                            (Number(form.watch("ethicalAccountabilityScore")) ||
                              0) +
                            (Number(form.watch("ethicalRespectScore")) || 0)) /
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
        </div>

        <div className="flex justify-between mt-6">
          <Button
            className="bg-blue-400 text-white hover:text-black hover:bg-yellow-400"
            type="button"
            variant="outline"
            onClick={() => setActivePart(5)}
          >
            Back: to Part V
          </Button>

          <Button
            className="bg-blue-500 text-white hover:text-black hover:bg-yellow-400"
            type="button"
            onClick={async () => {
              // Only trigger validation for Ethical & Professional Behavior fields
              const isValid = await form.trigger([
                "ethicalFollowsPoliciesScore",
                "ethicalProfessionalismScore",
                "ethicalAccountabilityScore",
                "ethicalRespectScore",
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
                ethicalFollowsPoliciesScore:
                  formState.ethicalFollowsPoliciesScore || 0,
                ethicalFollowsPoliciesExplanation:
                  formState.ethicalFollowsPoliciesExplanation || "",
                ethicalProfessionalismScore:
                  formState.ethicalProfessionalismScore || 0,
                ethicalProfessionalismExplanation:
                  formState.ethicalProfessionalismExplanation || "",
                ethicalAccountabilityScore:
                  formState.ethicalAccountabilityScore || 0,
                ethicalAccountabilityExplanation:
                  formState.ethicalAccountabilityExplanation || "",
                ethicalRespectScore: formState.ethicalRespectScore || 0,
                ethicalRespectExplanation:
                  formState.ethicalRespectExplanation || "",
              };

              onComplete(updatedValues);
              setActivePart(7);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Next: to Part VII
          </Button>
        </div>
      </form>
    </Form>
  );
}
