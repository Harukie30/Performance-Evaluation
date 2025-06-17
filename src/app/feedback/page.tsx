"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  StarIcon,
  ChatBubbleLeftIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  ArrowPathIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const FEEDBACK_CATEGORIES = [
  {
    id: "usability",
    name: "Usability",
    description: "How easy is it to use the site?",
    icon: <ArrowPathIcon className="h-6 w-6" />,
    color: "from-blue-500 to-indigo-500",
  },
  {
    id: "design",
    name: "Design",
    description: "Visual appeal and layout",
    icon: <LightBulbIcon className="h-6 w-6" />,
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "content",
    name: "Content",
    description: "Quality and relevance of information",
    icon: <ChatBubbleLeftIcon className="h-6 w-6" />,
    color: "from-emerald-500 to-green-500",
  },
  {
    id: "performance",
    name: "Performance",
    description: "Speed and responsiveness",
    icon: <StarIcon className="h-6 w-6" />,
    color: "from-purple-500 to-fuchsia-500",
  },
  {
    id: "issues",
    name: "Issues",
    description: "Bugs or technical problems",
    icon: <ExclamationTriangleIcon className="h-6 w-6" />,
    color: "from-rose-500 to-red-500",
  },
];

const SATISFACTION_LEVELS = [
  { value: "very-satisfied", label: "Very Satisfied", color: "bg-green-500" },
  { value: "satisfied", label: "Satisfied", color: "bg-emerald-400" },
  { value: "neutral", label: "Neutral", color: "bg-yellow-400" },
  { value: "dissatisfied", label: "Dissatisfied", color: "bg-orange-400" },
  { value: "very-dissatisfied", label: "Very Dissatisfied", color: "bg-red-500" },
];

// Stable background elements with fixed values
const BACKGROUND_ELEMENTS = [
  { id: 1, size: 150, top: 10, left: 20, duration: 25, xOffset: 30, yOffset: -20 },
  { id: 2, size: 200, top: 30, left: 70, duration: 30, xOffset: -40, yOffset: 25 },
  { id: 3, size: 180, top: 50, left: 40, duration: 28, xOffset: 35, yOffset: 15 },
  { id: 4, size: 220, top: 70, left: 80, duration: 32, xOffset: -25, yOffset: -30 },
  { id: 5, size: 160, top: 20, left: 60, duration: 27, xOffset: 20, yOffset: 40 },
  { id: 6, size: 190, top: 40, left: 30, duration: 29, xOffset: -35, yOffset: -15 },
  { id: 7, size: 170, top: 60, left: 50, duration: 26, xOffset: 25, yOffset: 30 },
  { id: 8, size: 210, top: 80, left: 90, duration: 31, xOffset: -30, yOffset: -25 },
];

// New Background Component
const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {BACKGROUND_ELEMENTS.map((element) => (
        <motion.div
          key={element.id}
          className="absolute rounded-full opacity-10 dark:opacity-5"
          style={{
            background: "linear-gradient(45deg, #4f46e5, #14b8a6)",
            width: `${element.size}px`,
            height: `${element.size}px`,
            top: `${element.top}%`,
            left: `${element.left}%`,
          }}
          animate={{
            x: [0, element.xOffset],
            y: [0, element.yOffset],
            rotate: [0, 360],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default function SiteFeedback() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [satisfaction, setSatisfaction] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 via-indigo-50 to-yellow-50 dark:from-slate-900 dark:to-slate-800 font-quicksand">
        <AnimatedBackground />
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ 
                scale: 1,
                rotate: [0, 10, -10, 5, 0]
              }}
              transition={{ duration: 0.8, type: "spring" }}
              className="bg-gradient-to-r from-green-400 to-emerald-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg 
                className="w-10 h-10 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Thank You for Your Feedback!
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-600 dark:text-gray-300 mb-8"
            >
              Your input helps us improve our platform. We appreciate your time and valuable insights.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                onClick={() => {
                  setIsSubmitted(false);
                  setSelectedCategories([]);
                  setSatisfaction("");
                  setFeedback("");
                }}
                className="h-12 px-8 text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
              >
                Submit Another Feedback
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-indigo-50 to-yellow-50 dark:from-slate-900 dark:to-slate-800 font-quicksand overflow-hidden">
      <AnimatedBackground />

      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image
                src="/images/smct.png"
                alt="SMCT Logo"
                width={120}
                height={40}
                className="h-8 w-auto object-contain"
                priority
              />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Feedback Portal
              </span>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-20 relative z-10 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Badge
                variant="outline"
                className="mb-4 px-4 py-1.5 rounded-full border border-blue-100 bg-blue-300/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold uppercase tracking-wide backdrop-blur-sm"
              >
                Site Improvement
              </Badge>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Help Us Improve
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-600 dark:text-gray-300"
            >
              Your feedback is valuable in making our platform better for everyone
            </motion.p>
          </div>

          <form onSubmit={handleSubmit}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-slate-800/90">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">What would you like to share?</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-8">
                  {/* Feedback Categories */}
                  <div className="space-y-4">
                    <Label className="text-lg font-medium">Select Categories</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <AnimatePresence>
                        {FEEDBACK_CATEGORIES.map((category, index) => (
                          <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            whileHover={{ y: -5 }}
                            className="relative"
                          >
                            <label
                              className={`flex items-start p-4 rounded-lg cursor-pointer transition-all border-2 ${
                                selectedCategories.includes(category.id)
                                  ? "border-transparent bg-gradient-to-r " + category.color
                                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                              }`}
                            >
                              <Checkbox
                                checked={selectedCategories.includes(category.id)}
                                onCheckedChange={() => toggleCategory(category.id)}
                                className={`mt-1 mr-3 ${
                                  selectedCategories.includes(category.id) 
                                    ? "text-white border-white" 
                                    : "text-blue-600"
                                }`}
                              />
                              <div className={`${selectedCategories.includes(category.id) ? "text-white" : "text-gray-800 dark:text-gray-200"}`}>
                                <div className="flex items-center mb-1">
                                  <span className="mr-2">
                                    {category.icon}
                                  </span>
                                  <span className="font-medium">{category.name}</span>
                                </div>
                                <p className={`text-sm ${selectedCategories.includes(category.id) ? "text-blue-100" : "text-gray-600 dark:text-gray-300"}`}>
                                  {category.description}
                                </p>
                              </div>
                            </label>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Satisfaction Level */}
                  <div className="space-y-4">
                    <Label className="text-lg font-medium">Overall Satisfaction</Label>
                    <RadioGroup
                      value={satisfaction}
                      onValueChange={setSatisfaction}
                      className="flex flex-wrap gap-3"
                    >
                      {SATISFACTION_LEVELS.map((level) => (
                        <motion.div 
                          key={level.value}
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem 
                            value={level.value} 
                            id={level.value}
                            className={`${level.color} border-transparent text-white focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                          />
                          <Label 
                            htmlFor={level.value}
                            className="font-medium cursor-pointer"
                          >
                            {level.label}
                          </Label>
                        </motion.div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Detailed Feedback */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-lg font-medium">Your Feedback</Label>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {feedback.length}/500
                      </span>
                    </div>
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      className="relative"
                    >
                      <Textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Please share your thoughts, suggestions, or concerns..."
                        className="min-h-[150px] text-base bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                        maxLength={500}
                      />
                      {feedback.length > 0 && (
                        <motion.button
                          type="button"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() => setFeedback("")}
                          className="absolute top-3 right-3 p-1 rounded-full bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </motion.button>
                      )}
                    </motion.div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button
                        type="submit"
                        disabled={isSubmitting || selectedCategories.length === 0}
                        className="h-12 px-8 text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                            Submitting...
                          </div>
                        ) : (
                          "Submit Feedback"
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </form>
          
          {/* Floating callout */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 border border-indigo-100 dark:border-slate-700 flex items-start"
          >
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg mr-4">
              <LightBulbIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Your feedback matters!</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                We review every piece of feedback to continuously improve our platform.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}