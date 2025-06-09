"use client";
import { cn } from "@/lib/utils";

export const Stepper = ({
  currentStep,
  totalSteps,
  className,
}: {
  currentStep: number;
  totalSteps: number;
  className?: string;
}) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="flex items-center">
        {[...Array(totalSteps)].map((_, index) => (
          <div key={index} className="flex items-center">
            {/* Step Circle */}
            <div
              className={cn(
                "w-15 h-15 rounded-full flex items-center justify-center text-2xl font-bold transition-colors",
                currentStep > index + 1
                  ? "bg-yellow-400 text-black "
                  : currentStep === index + 1
                  ? "bg-blue-700 ring-8 text-white ring-blue-400"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {index + 1}
            </div>

            {/* Connector Line (except for last step) */}
            {index < totalSteps - 1 && (
              <div
                className={cn(
                  "w-16 h-2.5",
                  currentStep > index + 1 ? "bg-yellow-400" : "bg-muted/50"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
