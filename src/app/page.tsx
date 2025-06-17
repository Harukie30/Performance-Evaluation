// app/page.tsx
"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";
import {
  BookOpenIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import {
  QuestionMarkCircleIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";

import { HelpCircleIcon, MailIcon } from "lucide-react";

const faqs = [
  {
    question: "How long does a review take?",
    answer: "Typically 15-20 minutes per employee",
  },
  {
    question: "Can I save my progress?",
    answer: "Yes, reviews can be saved and completed later",
  },
  {
    question: "Is the data confidential?",
    answer: "All reviews are encrypted and access-controlled",
  },
  {
    question: "Is the data collected?",
    answer: "All reviews are encrypted and access-controlled",
  },
];

export default function Home() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically loop through FAQ items
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % faqs.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-yellow-400 dark:from-slate-900 dark:to-slate-800 font-quicksand">
      {/* Fixed Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-md dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4 flex justify-center items-center space-x-8">
          <Link
            href="#performance-excellence"
            className="text-gray-800 hover:text-blue-700 dark:text-gray-200 dark:hover:text-blue-500 transition-colors text-base font-medium"
          >
            Performance Excellence
          </Link>
          <Link
            href="#how-it-works"
            className="text-gray-800 hover:text-blue-700 dark:text-gray-200 dark:hover:text-blue-500 transition-colors text-base font-medium"
          >
            How It Works
          </Link>
          <Link
            href="#faq"
            className="text-gray-800 hover:text-blue-700 dark:text-gray-200 dark:hover:text-blue-500 transition-colors text-base font-medium"
          >
            FAQ
          </Link>
        </div>
      </nav>

      {/* Hero Section */}

      <header className="container mx-auto px-4 py-16 md:py-24 text-center pt-24">
        <div className="max-w-3xl mx-auto">
          <Badge
            variant="outline"
            className="mb-5 px-4 py-1.5 rounded-full border border-blue-100 bg-blue-300 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold uppercase tracking-wide"
          >
            Performance Management System
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
            Employee Performance Review
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Performance tools for honest feedback, measurable impact, and
            professional growth.
          </p>

          {/* Enhanced SMCT Logo Presentation */}
          <div className="mt-16 flex flex-col items-center">
            <div className="text-sm uppercase tracking-wider text-gray-600 dark:text-gray-400 font-medium mb-6">
              Powered by
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center"
            >
              {/* Logo Container with Background */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl mt-20shadow-lg border border-gray-100 dark:border-gray-800 inline-block">
                <Image
                  src="/images/smct.png"
                  alt="SMCT Logo"
                  width={180}
                  height={140}
                  className="h-45 md:h-35 w-auto object-contain"
                />
              </div>

              {/* Accent Elements */}
              <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-blue-500 dark:bg-blue-400"></div>
              <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-amber-400"></div>
            </motion.div>

            {/* Tagline with Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6"
            ></motion.div>
          </div>
        </div>
      </header>
      {/* End of Section */}

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <section
          id="performance-excellence"
          className="container mx-auto px-4 py-20 mt-20 max-w-6xl"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 mb-4">
              Performance Excellence
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Advanced tools for comprehensive employee development and growth
              tracking
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                title: "360° Feedback",
                description:
                  "Collect comprehensive feedback from multiple sources",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-indigo-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                ),
                color: "bg-indigo-50 dark:bg-indigo-900/30",
              },
              {
                title: "Real-time Analytics",
                description:
                  "Track performance metrics with interactive dashboards",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-sky-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                ),
                color: "bg-sky-50 dark:bg-sky-900/30",
              },
              {
                title: "Secure Storage",
                description:
                  "Enterprise-grade security for sensitive employee data",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-emerald-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ),
                color: "bg-emerald-50 dark:bg-emerald-900/30",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="group cursor-pointer"
              >
                <Card className="h-full border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:border-blue-500 dark:group-hover:border-blue-400">
                  <CardContent
                    className={`p-8 ${feature.color} flex flex-col items-center`}
                  >
                    <div className="mb-6 p-3 rounded-full bg-white dark:bg-gray-800 shadow-sm transition-colors group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {feature.title}
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
                      {feature.description}
                    </p>
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 w-full text-center">
                      <Link
                        href="/feedback"
                        className="text-blue-600 dark:text-blue-400 font-medium text-sm hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                      >
                        Learn more →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </motion.div>
      {/* End of Section */}

      {/* How It Works */}
      <motion.section
        id="how-it-works"
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 0.77, 0.47, 0.97] }}
        className="bg-slate-100 dark:bg-slate-800 py-20 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-700 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider mb-3 block">
              Streamlined Process
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How Our Evaluation Works
            </h2>
            <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              A simple, transparent process designed for accurate and fair
              performance assessments
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Employee Information",
                description: "Select employee and review personal details",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                ),
              },
              {
                title: "Performance Evaluation",
                description: "Complete detailed performance assessment",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                ),
              },
              {
                title: "Review & Submit",
                description: "Verify all information and submit evaluation",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                ),
              },
              {
                title: "Performance Insights",
                description: "Receive comprehensive performance analysis",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                ),
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                className="group"
              >
                <div className="h-full bg-white dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600 p-6 shadow-sm hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                  <div className="flex items-start">
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg p-3 flex-shrink-0 mr-4 transition-colors group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40">
                      {step.icon}
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <span className="text-xs font-semibold text-blue-700 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 rounded-full px-2 py-0.5 mr-2">
                          Step {index + 1}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {step.title}
                      </h3>
                      <p className="text-gray-700 dark:text-slate-300 text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      {/* End of Section */}

      {/* FAQ Section */}
      <section id="faq" className="relative overflow-hidden py-19 mt-0">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-blue-50 dark:from-gray-900/90 dark:to-gray-900"></div>
          <Image
            src="/images/bgg.png"
            alt="Abstract grid background"
            fill
            className="object-cover opacity-[0.13]"
            priority
          />
        </div>

        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="text-center mt-35 mb-12">
            <motion.h2
              className="text-3xl md:text-4xl font-bold dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p
              className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              Everything you need to know about our performance review system
            </motion.p>
          </div>

          <div className="relative min-h-[320px] bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {/* Question with decorative elements */}
                <div className="flex items-start mb-6 relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-amber-400 rounded-full"></div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg mr-4 flex-shrink-0">
                    <QuestionMarkCircleIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold dark:text-white pt-1 pr-8">
                    {faqs[currentIndex].question}
                  </h3>
                </div>

                {/* Answer with visual connection */}
                <div className="flex">
                  <div className="ml-14 pl-4 border-l-2 border-blue-300 dark:border-gray-600 relative">
                    <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="flex items-start">
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg mr-3 flex-shrink-0">
                        <LightBulbIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 pt-1 text-base leading-relaxed">
                        {faqs[currentIndex].answer}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Enhanced Controls */}
          <div className="mt-16 flex flex-col items-center">
            <div className="flex items-center space-x-8">
              {/* Previous Button */}
              <button
                onClick={() =>
                  setCurrentIndex(
                    (prev) => (prev - 1 + faqs.length) % faqs.length
                  )
                }
                className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
                aria-label="Previous question"
              >
                <ChevronLeftIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>

              {/* Navigation Dots */}
              <div className="flex space-x-3">
                {faqs.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-3 w-3 rounded-full transition-all ${
                      currentIndex === index
                        ? "bg-blue-600 dark:bg-blue-400 scale-125"
                        : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                    }`}
                    aria-label={`Go to question ${index + 1}`}
                  />
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() =>
                  setCurrentIndex((prev) => (prev + 1) % faqs.length)
                }
                className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
                aria-label="Next question"
              >
                <ChevronRightIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            {/* Enhanced Auto-rotation indicator */}
            <div className="mt-12 flex flex-col items-center">
              <div className="relative h-2 w-64 bg-gray-200/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-full overflow-hidden mb-2">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-amber-400"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 6,
                    ease: "linear",
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                  key={currentIndex}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="bg-slate-900 text-white">
        {/* Main CTA Section */}
        <div className="container mx-auto py-16 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Performance Reviews?
            </h2>
            <p className="mb-8 text-slate-300 text-lg">
              Discover how SMCT is modernizing employee evaluations with
              fairness, clarity, and growth in mind.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="h-14 px-10 text-lg font-medium bg-white hover:bg-amber-300 text-slate-900 transition-colors shadow-lg hover:shadow-xl">
                <a href="/login">Begin Employee Review</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Help & Contact Section */}
        <div className="border-t border-slate-800 relative overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/cons.png"
              alt="Abstract background"
              fill
              className="object-cover opacity-10"
              priority
            />
            {/* Optional: Dark overlay for text readability */}
            <div className="absolute inset-0 bg-slate-300/6"></div>
          </div>

          <div className="container mx-auto py-12 px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
              {/* Help Center */}
              <div className="text-center">
                <div className="bg-blue-900/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <HelpCircleIcon className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Need Help?</h3>
                <p className="text-slate-400 mb-4">
                  Explore our knowledge base or get support
                </p>
                <Button
                  variant="link"
                  className="text-amber-300 hover:text-amber-200 text-lg"
                >
                  <Link href="/help">Visit Help Center</Link>
                </Button>
              </div>

              {/* Contact */}
              <div className="text-center">
                <div className="bg-emerald-900/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MailIcon className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
                <p className="text-slate-400 mb-4">
                  Our team is ready to answer your questions
                </p>
                <Button
                  variant="link"
                  className="text-amber-300 hover:text-amber-200 text-lg"
                >
                  <Link href="/contact">Get in Touch</Link>
                </Button>
              </div>

              {/* Resources */}
              <div className="text-center">
                <div className="bg-purple-900/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <BookOpenIcon className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Resources</h3>
                <p className="text-slate-400 mb-4">
                  Step-by-step manuals, ready-to-use assets, and effective
                  methodologies
                </p>
                <Button
                  variant="link"
                  className="text-amber-300 hover:text-amber-200 text-lg"
                >
                  <Link href="/resources">Explore Resources</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-slate-800 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-slate-200 text-sm">
                  &copy; {new Date().getFullYear()} SMCT Performance Review Pro.
                  All rights reserved.
                </p>
              </div>
              <div className="flex space-x-6">
                <Link
                  href="/privacy"
                  className="text-slate-200 hover:text-slate-300 text-sm"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-slate-200 hover:text-slate-300 text-sm"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/security"
                  className="text-slate-200 hover:text-slate-300 text-sm"
                >
                  Security
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
