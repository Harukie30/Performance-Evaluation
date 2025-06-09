// src/components/performance-form.tsx

import React from "react";
import employeeNames from "../data/users.json";
import { Card, CardContent } from "@/components/ui/card";
import RatingScale from "@/app/constants/rating-scale";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import {
  formSchema,
  PerformanceFormValues,
} from "../lib/validation-schema/form-schema";

import { useState } from "react";
import { Resolver } from "react-hook-form";

interface Employee {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  position: {
    title: string;
  };
  department: {
    department_name: string;
  };
  datehired: {
    date: string;
  };
}

// const employeeNames: {
//   value: PerformanceFormValues["employeeName"];
//   label: string;
// }[] = [
//   { value: "zart", label: "zart" },
//   { value: "allan", label: "allan" },
//   { value: "jenecil", label: "jenecil" },
//   { value: "mark", label: "mark" },
//   { value: "irvin", label: "irvin" },
//   { value: "noreen", label: "noreen" },
// ];

interface PerformanceFormType {
  activePart: number;
  setActivePart: React.Dispatch<React.SetStateAction<number>>;
  onComplete: (data: PerformanceFormValues) => void;
  formData: PerformanceFormValues;
  onEdit?: (part: number) => void;
}

export default function PerformanceForm({
  setActivePart,
  onComplete,
  formData,
}: PerformanceFormType): React.JSX.Element {
  const [employeeId, setEmployeeId] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<PerformanceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
  });

  const onSubmit = form.handleSubmit(async (values: PerformanceFormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Validate employee selection
      if (!employeeId) {
        setError("Please select an employee");
        return;
      }

      // Validate required fields
      const requiredFields = [
        "employeeId",
        "employeeName",
        "position",
        "department",
        "reviewDate",
        "jobKnowledge",
        "qualityOfWork",
        "promptnessOfWork",
      ];

      const missingFields = requiredFields.filter(
        (field) => !values[field as keyof PerformanceFormValues]
      );

      if (missingFields.length > 0) {
        setError(
          `Please fill in all required fields: ${missingFields.join(", ")}`
        );
        return;
      }

      // Ensure all values are properly set before submitting
      const updatedValues = {
        ...formData,
        ...values,
        // Ensure numeric values are properly set
        jobKnowledge: values.jobKnowledge || 0,
        qualityOfWork: values.qualityOfWork || 0,
        promptnessOfWork: values.promptnessOfWork || 0,
      };

      await onComplete(updatedValues);
      setActivePart(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  });

  const employeeSelected = employeeNames.find((name) => name.id === employeeId);

  // Add error display component
  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative mb-4">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{message}</span>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-16">
        {error && <ErrorMessage message={error} />}

        {/* Purpose Section */}
        <div className="border p-4 rounded-md">
          <h3 className="text-lg font-bold mb-2">PURPOSE</h3>
          <p className="text-sm">
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
        <div className="font-semibold text-2xl">
          <p> Employee Information Section :</p>
        </div>

        {/* Employee Selection Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee ID</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    readOnly
                    placeholder="Enter Employee ID"
                    {...field}
                    value={employeeSelected?.employeeId || ""}
                    className={!employeeSelected ? "border-red-500" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="employeeName"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-col">
                  <FormLabel>Employee Name</FormLabel>
                  <Select
                    value={field.value.toString()}
                    onValueChange={(selectedId: string) => {
                      const name = employeeNames.find(
                        (name) => name.id === Number(selectedId)
                      );
                      form.setValue("employeeName", Number(name?.id));
                      form.setValue("employeeId", name?.employeeId as string);
                      form.setValue("position", name?.position?.title || "");
                      form.setValue(
                        "department",
                        name?.department?.department_name || ""
                      );
                      if (name?.datehired?.date) {
                        form.setValue(
                          "datehired",
                          new Date(name?.datehired.date)
                        );
                      }
                      setEmployeeId(Number(name?.id));
                      setError(null); // ✅ Close popover
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a employee">
                        {employeeNames.find((emp) => emp.id === field.value)
                          ?.name || undefined}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>All Employees</SelectLabel>

                        {employeeNames.map((item: Employee, index: number) => (
                          <SelectItem
                            key={index.toString()}
                            value={item.id.toString()}
                          >
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Position {employeeSelected?.position?.title}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    {...field}
                    value={employeeSelected?.position?.title || ""}
                    readOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Engineering"
                    {...field}
                    value={employeeSelected?.department?.department_name || ""}
                    readOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reviewDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Review Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-0 p-0 z-100" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="datehired"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date Hired</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : employeeSelected?.datehired?.date ? (
                          format(
                            new Date(employeeSelected.datehired.date),
                            "PPP"
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        field.value ||
                        (employeeSelected?.datehired?.date
                          ? new Date(employeeSelected.datehired.date)
                          : undefined)
                      }
                      onSelect={(date) => {
                        if (date) {
                          field.onChange(date);
                        }
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Review Types Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* For Probationary */}
          <div className="flex items-center space-x-4">
            <div className="text-xl font-bold">For Probationary:</div>
            <FormField
              control={form.control}
              name="ForProbationary"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="3 months" />
                        </FormControl>
                        <FormLabel className="font-normal">3 months</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="5 months" />
                        </FormControl>
                        <FormLabel className="font-normal">5 months</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* For Regular */}
          <div className="flex items-center space-x-4">
            <div className="text-xl font-bold">For Regular:</div>
            <FormField
              control={form.control}
              name="ForRegular"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Q1 2023" />
                        </FormControl>
                        <FormLabel className="font-normal">Q1 review</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Q2 2023" />
                        </FormControl>
                        <FormLabel className="font-normal">Q2 review</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Q3 2023" />
                        </FormControl>
                        <FormLabel className="font-normal">Q3 review</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Q4 2023" />
                        </FormControl>
                        <FormLabel className="font-normal">Q4 review</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Others */}
          <div className="flex items-center space-x-4 col-span-2">
            <div className="text-xl font-bold">Others:</div>
            <div className="flex items-center space-x-4">
              <FormField
                control={form.control}
                name="otherReviewType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value: string) => {
                          field.onChange(value);
                          if (value !== "Performance Improvement") {
                            form.setValue("otherReviewDetails", ""); // Clear details if not Performance Improvement
                          }
                        }}
                        value={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Performance Improvement" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Performance Improvement
                          </FormLabel>
                        </FormItem>
                        {/* Add other potential 'Others' options here if needed */}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="otherReviewDetails"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormLabel className="text-md font-bold">Others:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter details..."
                        className="w-full max-w-xs"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Immediate Supervisor and Performance Coverage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="immediateSupervisorInput"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Immediate Supervisor</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter supervisor's name"
                    className="w-60"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="performanceCoverage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Performance Coverage</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter performance coverage details"
                    className="w-90 min-h-[110px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Performance Ratings Section 1 */}
        <div className="space-y-10">
          <h3 className="text-lg font-semibold">
            PART I. JOB KNOWLEDGE (60%) (1-3)
          </h3>
          <div className="space-y-5">
            <p className=" text-md text-black   ">
              To assess how well the employee is performing the routine and
              other related assigned tasks. Please indicate your appropriate
              rating and score.
            </p>
          </div>

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
              <tbody>
                {/* Job Knowledge Row */}
                <tr>
                  <td className="p-2 border align-center font-bold">
                    Mastery in Core Competencies and Job Understanding
                  </td>
                  <td className="p-2 border align-top">
                    <p className="text-md text-black">
                      Exhibits mastery in essential skills and competencies
                      required for the role. Displays a deep understanding of
                      job responsibilities and requirements.
                    </p>
                  </td>
                  <td className="p-2 border align-top">
                    <p className="text-md text-black">
                      Consistently performs tasks accurately and with precision,
                      showing a deep understanding of core job functions.
                    </p>
                  </td>
                  <td className="p-2 border align-top text-center">
                    <FormField
                      control={form.control}
                      name="jobKnowledge"
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
                    {RatingScale(form.watch("jobKnowledge"))}
                  </td>
                  <td className="p-2 border align-top">
                    <FormField
                      control={form.control}
                      name="jobKnowledgeComments"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Add explanation..."
                              className="min-h-[100px]"
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
                {/* Promptness of Work Row */}
                <tr>
                  <td className="p-2 border align-center font-bold">
                    Keeps Documentation Updated
                  </td>
                  <td className="p-2 border align-top">
                    <p className="text-md text-black">
                      Completes assigned tasks and responsibilities within the
                      required timeframe. Demonstrates reliability in meeting
                      deadlines.
                    </p>
                  </td>
                  <td className="p-2 border align-top">
                    <p className="text-md text-black">
                      Consistently submits work on or before deadlines, showing
                      effective time management and prioritization.
                    </p>
                  </td>
                  <td className="p-2 border align-top text-center">
                    <FormField
                      control={form.control}
                      name="promptnessOfWork"
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
                    {RatingScale(form.watch("promptnessOfWork"))}
                  </td>
                  <td className="p-2 border align-top">
                    <FormField
                      control={form.control}
                      name="promptnessofworkComments"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Add explanation..."
                              className="min-h-[120px] w-100"
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
                {/* Quality of Work Row */}
                <tr>
                  <td className="p-2 border align-center font-bold">
                    Problem Solving
                  </td>
                  <td className="p-2 border align-top">
                    <p className="text-md text-black">
                      Produces work that meets or exceeds quality standards.
                      Pays attention to detail and strives for excellence in all
                      tasks.
                    </p>
                  </td>
                  <td className="p-2 border align-top">
                    <p className="text-md text-black">
                      Delivers outputs with minimal errors, consistently meeting
                      or surpassing expectations for quality.
                    </p>
                  </td>
                  <td className="p-2 border align-top text-center">
                    <FormField
                      control={form.control}
                      name="qualityOfWork"
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
                    {RatingScale(form.watch("qualityOfWork"))}
                  </td>
                  <td className="p-2 border align-top">
                    <FormField
                      control={form.control}
                      name="qualityofworkComments"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Add explanation..."
                              className="min-h-[100px]"
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

        <div className="mt-6">
          <Card className="bg-muted/100 border border-primary/50">
            <CardContent className="pt-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Overall Work Output Score :
                </h3>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    {Math.min(
                      ((Number(form.watch("jobKnowledge")) || 0) +
                        (Number(form.watch("promptnessOfWork")) || 0) +
                        (Number(form.watch("qualityOfWork")) || 0)) /
                        3,
                      5
                    ).toFixed(2)}
                  </div>
                  <div className="text-2xl font-bold text-black ">
                    Total Rating:{" "}
                    {RatingScale(
                      Math.min(
                        ((Number(form.watch("jobKnowledge")) || 0) +
                          (Number(form.watch("promptnessOfWork")) || 0) +
                          (Number(form.watch("qualityOfWork")) || 0)) /
                          3,
                        6
                      )
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-6">
          <Button
            type="button"
            className="bg-blue-500 text-white hover:text-black hover:bg-yellow-400"
            onClick={async () => {
              // Only trigger validation for required fields
              const isValid = await form.trigger([
                "employeeId",
                "employeeName",
                "position",
                "department",
                "reviewDate",
                "jobKnowledge",
                "qualityOfWork",
                "promptnessOfWork",
              ]);

              if (!isValid) {
                alert("Please fill in all required fields before proceeding");
                return;
              }

              // If validation passes, submit the form
              const formState = form.getValues();
              const updatedValues = {
                ...formData,
                ...formState,
                // Ensure numeric values are properly set
                jobKnowledge: formState.jobKnowledge || 0,
                qualityOfWork: formState.qualityOfWork || 0,
                promptnessOfWork: formState.promptnessOfWork || 0,
              };

              onComplete(updatedValues);
              setActivePart(2);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Processing...
              </>
            ) : (
              <>
                Next: Part II - Work Attitude
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
