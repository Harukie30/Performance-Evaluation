import React from 'react';
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "./ui/card";
import RatingScale from "@/app/constants/rating-scale";
import {
  formSchema,
  PerformanceFormValues,
} from "../lib/validation-schema/form-schema";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface PerformanceForm2Props {
  activePart: number;
  setActivePart: React.Dispatch<React.SetStateAction<number>>;
  onComplete: (data: PerformanceFormValues) => void;
  formData: PerformanceFormValues;
}

export default function PerformanceForm2({
  setActivePart,
  onComplete,
  formData,
}: PerformanceForm2Props): React.JSX.Element {
  const form = useForm<PerformanceFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      ...formData,
      qualityMeetsStandards: formData.qualityMeetsStandards || 1,
      qualityTimeliness: formData.qualityTimeliness || 1,
      qualityWorkOutputVolume: formData.qualityWorkOutputVolume || 1,
      qualityConsistency: formData.qualityConsistency || 1,
      qualityJobTargets: formData.qualityJobTargets || 1,
      qualityMeetsStandardsComments: formData.qualityMeetsStandardsComments || "",
      qualityTimelinessComments: formData.qualityTimelinessComments || "",
      qualityWorkOutputVolumeComments: formData.qualityWorkOutputVolumeComments || "",
      qualityConsistencyComments: formData.qualityConsistencyComments || "",
      qualityJobTargetsComments: formData.qualityJobTargetsComments || "",
    },
  });

  const handleBack = () => setActivePart(1);

  const handleSubmit = form.handleSubmit((values: PerformanceFormValues) => {
    onComplete(values);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
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
        
        <div>
          {/* Part II: Quality of Work */}
          <div className="space-y-10 mt-12">
            <h3 className="text-lg font-semibold">PART II. QUALITY OF WORK</h3>
            <div className="text-md text-black">
              Accuracy and precision in completing tasks. Attention to detail.
              Consistency in delivering high-quality results. Timely completion
              of tasks and projects. Effective use of resources. Ability to meet
              deadlines.
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 broder left-0"></th>
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
                  {/* Meets Standards and Requirements */}
                  <tr>
                    <td className="p-2 border align-center font-bold">
                      Meets Standards and Requirements
                    </td>
                    <td className="p-2 border align-top">
                      Ensures work is accurate and meets or exceeds established
                      standards
                    </td>
                    <td className="p-2 border align-top">
                      Complies with industry regulations and project
                      specifications; delivers reliable, high-quality work, and
                      accurate work.
                    </td>
                    <td className="p-2 border align-top text-center">
                      <FormField
                        control={form.control}
                        name="qualityMeetsStandards"
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
                      {RatingScale(form.watch("qualityMeetsStandards"))}
                    </td>
                    <td className="p-2 border align-top">
                      <FormField
                        control={form.control}
                        name="qualityMeetsStandardsComments"
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
                  {/* Timeliness (L.E.A.D.E.R.) */}
                  <tr>
                    <td className="p-2 border align-center font-bold">
                      &ldquo;Timeliness (L.E.A.D.E.R.)&rdquo;
                    </td>

                    <td className="p-2 border align-top">
                      Completes tasks and projects within specified deadlines
                    </td>
                    <td className="p-2 border align-top">
                      Submits work on time without compromising quality.
                    </td>
                    <td className="p-2 border align-top text-center">
                      <FormField
                        control={form.control}
                        name="qualityTimeliness"
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
                      {RatingScale(form.watch("qualityTimeliness"))}
                    </td>
                    <td className="p-2 border align-top">
                      <FormField
                        control={form.control}
                        name="qualityTimelinessComments"
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
                  {/* Work Output Volume (L.E.A.D.E.R.) */}
                  <tr>
                    <td className="p-2 border align-center font-bold ">
                      &ldquo;Work Output Volume (L.E.A.D.E.R.)&rdquo;
                    </td>

                    <td className="p-2 border align-top">
                      Produces a high volume of quality work within a given time
                      frame
                    </td>
                    <td className="p-2 border align-top">
                      Handles a substantial workload without sacrificing
                      quality.
                    </td>
                    <td className="p-2 border align-top text-center">
                      <FormField
                        control={form.control}
                        name="qualityWorkOutputVolume"
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
                      {RatingScale(form.watch("qualityWorkOutputVolume"))}
                    </td>
                    <td className="p-2 border align-top">
                      <FormField
                        control={form.control}
                        name="qualityWorkOutputVolumeComments"
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
                  {/* Consistency in Performance (L.E.A.D.E.R.) */}
                  <tr>
                    <td className="p-2 border align-center font-bold">
                      &ldquo;Consistency in Performance (L.E.A.D.E.R.)&rdquo;
                    </td>

                    <td className="p-2 border align-top">
                      Maintains a consistent level of productivity over time
                    </td>
                    <td className="p-2 border align-top">
                      Meets productivity expectations reliably, without
                      significant fluctuations.
                    </td>
                    <td className="p-2 border align-top text-center">
                      <FormField
                        control={form.control}
                        name="qualityConsistency"
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
                      {RatingScale(form.watch("qualityConsistency"))}
                    </td>
                    <td className="p-2 border align-top">
                      <FormField
                        control={form.control}
                        name="qualityConsistencyComments"
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
                  {/* Job Targets */}
                  <tr>
                    <td className="p-2 border align-center font-bold">
                      Job Targets
                    </td>

                    <td className="p-2 border align-top">
                      Achieves targets set for their respective position (Sales
                      / CCR / Mechanic / etc.)
                    </td>
                    <td className="p-2 border align-top">
                      Consistently hits monthly targets assigned to their role.
                    </td>
                    <td className="p-2 border align-top text-center">
                      <FormField
                        control={form.control}
                        name="qualityJobTargets"
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
                      {RatingScale(form.watch("qualityJobTargets"))}
                    </td>
                    <td className="p-2 border align-top">
                      <FormField
                        control={form.control}
                        name="qualityJobTargetsComments"
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
            {/* Overall Quality of Work Score */}
            <div className="mt-6">
              <Card className="bg-muted/100 border border-primary/50">
                <CardContent className="pt-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Overall Quality of Work Score :
                    </h3>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">
                        {Math.min(
                          ((Number(form.watch("qualityMeetsStandards")) || 0) +
                            (Number(form.watch("qualityTimeliness")) || 0) +
                            (Number(form.watch("qualityWorkOutputVolume")) ||
                              0) +
                            (Number(form.watch("qualityConsistency")) || 0) +
                            (Number(form.watch("qualityJobTargets")) || 0)) /
                            5,
                          5
                        ).toFixed(2)}
                      </div>
                      <div className="text-2xl font-bold text-black ">
                        Total Rating:{" "}
                        {RatingScale(
                          Math.min(
                            ((Number(form.watch("qualityMeetsStandards")) ||
                              0) +
                              (Number(form.watch("qualityTimeliness")) || 0) +
                              (Number(form.watch("qualityWorkOutputVolume")) ||
                                0) +
                              (Number(form.watch("qualityConsistency")) || 0) +
                              (Number(form.watch("qualityJobTargets")) || 0)) /
                              5,
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

          <div className="flex justify-end gap-274 mt-6">
            <Button
              type="button"
              onClick={handleBack}
              variant="outline"
              className="bg-blue-500 text-white hover:text-black hover:bg-yellow-400"
            >
              Back: to Part I
            </Button>

            <Button
              className="bg-blue-500 text-white hover:text-black hover:bg-yellow-400"
              type="button"
              onClick={async () => {
                // Only trigger validation for Quality of Work fields
                const isValid = await form.trigger([
                  "qualityMeetsStandards",
                  "qualityTimeliness",
                  "qualityWorkOutputVolume",
                  "qualityConsistency",
                  "qualityJobTargets",
                ]);

                if (!isValid) {
                  alert(
                    "Please fill in all required ratings before proceeding"
                  );
                  return;
                }

                // If validation passes, submit the form
                const formState = form.getValues();
                const updatedValues = {
                  ...formData,
                  ...formState,
                  qualityMeetsStandards: formState.qualityMeetsStandards || 0,
                  qualityTimeliness: formState.qualityTimeliness || 0,
                  qualityWorkOutputVolume:
                    formState.qualityWorkOutputVolume || 0,
                  qualityConsistency: formState.qualityConsistency || 0,
                  qualityJobTargets: formState.qualityJobTargets || 0,
                  qualityMeetsStandardsComments:
                    formState.qualityMeetsStandardsComments || "",
                  qualityTimelinessComments:
                    formState.qualityTimelinessComments || "",
                  qualityWorkOutputVolumeComments:
                    formState.qualityWorkOutputVolumeComments || "",
                  qualityConsistencyComments:
                    formState.qualityConsistencyComments || "",
                  qualityJobTargetsComments:
                    formState.qualityJobTargetsComments || "",
                };

                onComplete(updatedValues);
                setActivePart(3);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Next: Part III - Personal Competencies
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
