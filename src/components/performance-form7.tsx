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
} from "@/lib/validation-schema/form-schema";
import { Input } from "@/components/ui/input";

interface PerformanceForm7Props {
  activePart: number;
  setActivePart: React.Dispatch<React.SetStateAction<number>>;
  onComplete: (data: PerformanceFormValues) => void;
  formData: PerformanceFormValues;
}

export default function PerformanceForm7({
  setActivePart,
  onComplete,
  formData,
}: PerformanceForm7Props): React.JSX.Element {
  const form = useForm<PerformanceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...formData,
      // Customer Service fields (Part VII)
      customerListeningScore: formData.customerListeningScore || 1,
      customerListeningExplanation: formData.customerListeningExplanation || "",
      customerProblemSolvingScore: formData.customerProblemSolvingScore || 1,
      customerProblemSolvingExplanation:
        formData.customerProblemSolvingExplanation || "",
      customerProductKnowledgeScore:
        formData.customerProductKnowledgeScore || 1,
      customerProductKnowledgeExplanation:
        formData.customerProductKnowledgeExplanation || "",
      customerProfessionalAttitudeScore:
        formData.customerProfessionalAttitudeScore || 1,
      customerProfessionalAttitudeExplanation:
        formData.customerProfessionalAttitudeExplanation || "",
      customerTimelyResolutionScore:
        formData.customerTimelyResolutionScore || 1,
      customerTimelyResolutionExplanation:
        formData.customerTimelyResolutionExplanation || "",
    },
  });

  const handleSubmit = form.handleSubmit((values: PerformanceFormValues) => {
    const updatedValues = {
      ...formData, // Keep existing form data
      ...values,
      // Ensure numeric values are preserved
      customerListeningScore: values.customerListeningScore || 1,
      customerListeningExplanation: values.customerListeningExplanation || "",
      customerProblemSolvingScore: values.customerProblemSolvingScore || 1,
      customerProblemSolvingExplanation:
        values.customerProblemSolvingExplanation || "",
      customerProductKnowledgeScore: values.customerProductKnowledgeScore || 1,
      customerProductKnowledgeExplanation:
        values.customerProductKnowledgeExplanation || "",
      customerProfessionalAttitudeScore:
        values.customerProfessionalAttitudeScore || 1,
      customerProfessionalAttitudeExplanation:
        values.customerProfessionalAttitudeExplanation || "",
      customerTimelyResolutionScore: values.customerTimelyResolutionScore || 1,
      customerTimelyResolutionExplanation:
        values.customerTimelyResolutionExplanation || "",

      // Calculate overall Customer Service score
      overallCustomerServiceScore: Math.min(
        ((Number(values.customerListeningScore) || 0) +
          (Number(values.customerProblemSolvingScore) || 0) +
          (Number(values.customerProductKnowledgeScore) || 0) +
          (Number(values.customerProfessionalAttitudeScore) || 0) +
          (Number(values.customerTimelyResolutionScore) || 0)) /
          5,
        5
      ),
    };

    onComplete(updatedValues);
    setActivePart(8); // Navigate to Part VIII (Overall Assessment) or Final Results
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
          <h3 className="text-lg font-semibold">PART VII. CUSTOMER SERVICE</h3>
          <p className="text-md text-muted-foreground">
            Customer satisfaction. Responsiveness to customer needs.
            Professional and positive interactions with customers.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 bg-white">
              <thead className="bg-gray-100">
                <tr>
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
              <tbody>
                <tr>
                  <td className="p-2 border align-top font-semibold">
                    Listening & Understanding
                  </td>
                  <td className="p-2 border align-top">
                    <p className="text-md text-black">
                      Listens to customers and displays understanding of
                      customer needs and concerns
                    </p>
                  </td>
                  <td className="p-2 border align-top">
                    <p className="text-md text-black">
                      Repeats or summarizes customer concerns to ensure complete
                      understanding before responding. Expresses genuine concern
                      and seeks to understand the customer`s perspective.
                    </p>
                  </td>
                  <td className="p-2 border align-top text-center">
                    <FormField
                      control={form.control}
                      name="customerListeningScore"
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
                      form.watch("customerListeningScore") as number
                    )}
                  </td>
                  <td className="p-2 border align-top">
                    <FormField
                      control={form.control}
                      name="customerListeningExplanation"
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

                <tr>
                  <td className="p-2 border align-top font-semibold">
                    Problem-Solving for Customer Satisfaction
                  </td>
                  <td className="p-2 border align-top">
                    <p className="text-md text-black">
                      Proactively identifies and solves customer problems to
                      ensure satisfaction
                    </p>
                  </td>
                  <td className="p-2 border align-top">
                    <p className="text-md text-black">
                      Takes initiative to resolve issues and prevent future
                      challenges for the customer. Offers alternative solutions
                      when standard resolutions are not enough.
                    </p>
                  </td>
                  <td className="p-2 border align-top text-center">
                    <FormField
                      control={form.control}
                      name="customerProblemSolvingScore"
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
                      form.watch("customerProblemSolvingScore") as number
                    )}
                  </td>
                  <td className="p-2 border align-top">
                    <FormField
                      control={form.control}
                      name="customerProblemSolvingExplanation"
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

                <tr>
                  <td className="p-2 border align-top font-semibold">
                    Product Knowledge for Customer Support (L.E.A.D.E.R)
                  </td>
                  <td className="p-2 border align-top">
                    <p className="text-md text-black">
                      Possesses comprehensive product knowledge to assist
                      customers effectively
                    </p>
                  </td>
                  <td className="p-2 border align-top">
                    <p className="text-md text-black">
                      Demonstrates a deep understanding of products and/or
                      services, enabling accurate and helpful guidance. Suggests
                      the most suitable product or service based on customer
                      requirements.
                    </p>
                  </td>
                  <td className="p-2 border align-top text-center">
                    <FormField
                      control={form.control}
                      name="customerProductKnowledgeScore"
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
                      form.watch("customerProductKnowledgeScore") as number
                    )}
                  </td>
                  <td className="p-2 border align-top">
                    <FormField
                      control={form.control}
                      name="customerProductKnowledgeExplanation"
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

                <tr>
                  <td className="p-2 border align-top font-semibold">
                    Positive and Professional Attitude (L.E.A.D.E.R)
                  </td>
                  <td className="p-2 border align-top">
                    <p className="text-md text-black">
                      Maintains a positive and professional demeanor,
                      particularly during customer interactions
                    </p>
                  </td>
                  <td className="p-2 border align-top">
                    <p className="text-md text-black">
                      Represents the organization positively. Remains courteous
                      and patient, even with challenging customers or in
                      stressful situations.
                    </p>
                  </td>
                  <td className="p-2 border align-top text-center">
                    <FormField
                      control={form.control}
                      name="customerProfessionalAttitudeScore"
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
                      form.watch("customerProfessionalAttitudeScore") as number
                    )}
                  </td>
                  <td className="p-2 border align-top">
                    <FormField
                      control={form.control}
                      name="customerProfessionalAttitudeExplanation"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Add explanation..."
                              className="min-h-[120px]  md:w-[500px] text-base p-3"
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

                <tr>
                  <td className="p-2 border align-top font-semibold">
                    Timely Resolution of Customer Issues (L.E.A.D.E.R)
                  </td>
                  <td className="p-2 border align-top">
                    <p className="text-md text-black">
                      Resolves customer issues promptly and efficiently
                    </p>
                  </td>
                  <td className="p-2 border align-top">
                    <p className="text-md text-black">
                      Addresses and resolves customer complaints or concerns
                      within established timeframes. Ensures follow-ups are
                      conducted for unresolved issues until completion.
                    </p>
                  </td>
                  <td className="p-2 border align-top text-center">
                    <FormField
                      control={form.control}
                      name="customerTimelyResolutionScore"
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
                      form.watch("customerTimelyResolutionScore") as number
                    )}
                  </td>
                  <td className="p-2 border align-top">
                    <FormField
                      control={form.control}
                      name="customerTimelyResolutionExplanation"
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

          {/* Overall Customer Service Score Display */}
          <div className="mt-6">
            <Card className="bg-muted/100 border border-primary/50">
              <CardContent className="pt-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Overall Customer Service Score :
                  </h3>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">
                      {Math.min(
                        ((Number(form.watch("customerListeningScore")) || 0) +
                          (Number(form.watch("customerProblemSolvingScore")) ||
                            0) +
                          (Number(
                            form.watch("customerProductKnowledgeScore")
                          ) || 0) +
                          (Number(
                            form.watch("customerProfessionalAttitudeScore")
                          ) || 0) +
                          (Number(
                            form.watch("customerTimelyResolutionScore")
                          ) || 0)) /
                          5,
                        5
                      ).toFixed(2)}
                    </div>
                    <div className="text-2xl font-bold text-black ">
                      Total Rating:{" "}
                      {RatingScale(
                        Math.min(
                          ((Number(form.watch("customerListeningScore")) || 0) +
                            (Number(
                              form.watch("customerProblemSolvingScore")
                            ) || 0) +
                            (Number(
                              form.watch("customerProductKnowledgeScore")
                            ) || 0) +
                            (Number(
                              form.watch("customerProfessionalAttitudeScore")
                            ) || 0) +
                            (Number(
                              form.watch("customerTimelyResolutionScore")
                            ) || 0)) /
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

        <div className="flex justify-between mt-6">
          <Button
            className="bg-blue-400 text-white hover:text-black hover:bg-yellow-400"
            type="button"
            variant="outline"
            onClick={() => setActivePart(6)}
          >
            Back: to Part VI
          </Button>

          <Button
            className="bg-blue-500 text-white hover:text-black hover:bg-yellow-400"
            type="button"
            onClick={async () => {
              // Only trigger validation for Customer Service fields
              const isValid = await form.trigger([
                "customerListeningScore",
                "customerProblemSolvingScore",
                "customerProductKnowledgeScore",
                "customerProfessionalAttitudeScore",
                "customerTimelyResolutionScore",
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
                customerListeningScore: formState.customerListeningScore || 0,
                customerListeningExplanation:
                  formState.customerListeningExplanation || "",
                customerProblemSolvingScore:
                  formState.customerProblemSolvingScore || 0,
                customerProblemSolvingExplanation:
                  formState.customerProblemSolvingExplanation || "",
                customerProductKnowledgeScore:
                  formState.customerProductKnowledgeScore || 0,
                customerProductKnowledgeExplanation:
                  formState.customerProductKnowledgeExplanation || "",
                customerProfessionalAttitudeScore:
                  formState.customerProfessionalAttitudeScore || 0,
                customerProfessionalAttitudeExplanation:
                  formState.customerProfessionalAttitudeExplanation || "",
                customerTimelyResolutionScore:
                  formState.customerTimelyResolutionScore || 0,
                customerTimelyResolutionExplanation:
                  formState.customerTimelyResolutionExplanation || "",
              };

              onComplete(updatedValues);
              setActivePart(8);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Next: to Final Results
          </Button>
        </div>
      </form>
    </Form>
  );
}
