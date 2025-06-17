// app/feedback/page.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  UserGroupIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  UserCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const PARTICIPANT_TYPES = [
  { id: "peers", name: "Peers", color: "bg-blue-500" },
  { id: "managers", name: "Managers", color: "bg-purple-500" },
  { id: "reports", name: "Direct Reports", color: "bg-green-500" },
  { id: "self", name: "Self", color: "bg-yellow-500" },
];

const FEATURES = [
  {
    title: "Multi-source Feedback",
    description: "Collect feedback from peers, managers, and direct reports",
    icon: <UserGroupIcon className="h-8 w-8 text-blue-600" />,
  },
  {
    title: "Performance Analytics",
    description: "Visualize feedback data with interactive dashboards",
    icon: <ChartBarIcon className="h-8 w-8 text-green-600" />,
  },
  {
    title: "Customizable Templates",
    description: "Create and modify feedback forms to match your needs",
    icon: <DocumentTextIcon className="h-8 w-8 text-purple-600" />,
  },
  {
    title: "Secure & Confidential",
    description: "Enterprise-grade security for sensitive feedback",
    icon: <ShieldCheckIcon className="h-8 w-8 text-amber-600" />,
  },
];

const PROCESS_STEPS = [
  {
    step: "1",
    title: "Select Participants",
    description: "Choose feedback providers from different levels and departments",
  },
  {
    step: "2",
    title: "Gather Feedback",
    description: "Participants provide confidential feedback through secure forms",
  },
  {
    step: "3",
    title: "Review & Analyze",
    description: "Access comprehensive reports and actionable insights",
  },
];

const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "HR Director",
    company: "TechGlobal Inc.",
    content: "The 360° feedback system transformed our performance reviews. We now have actionable insights that actually drive development.",
    avatar: "/avatar1.svg",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Engineering Manager",
    company: "InnoTech Solutions",
    content: "The analytics dashboard helped us identify team strengths we didn't even know existed. Highly recommended for any tech organization.",
    avatar: "/avatar2.svg",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Team Lead",
    company: "Growth Marketing Co.",
    content: "Our employee engagement improved by 35% after implementing this feedback system. The insights were eye-opening.",
    avatar: "/avatar3.svg",
  },
];

export default function Feedback360() {
  const [activeTab, setActiveTab] = useState("request");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-rotate testimonials
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const nextTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
      setIsAnimating(false);
    }, 300);
  };

  const prevTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-indigo-50 to-yellow-50 dark:from-slate-900 dark:to-slate-800 font-quicksand overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10 dark:opacity-5"
            style={{
              background: "linear-gradient(45deg, #4f46e5, #14b8a6)",
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 md:py-24 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="outline"
              className="mb-5 px-4 py-1.5 rounded-full border border-blue-100 bg-blue-300/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold uppercase tracking-wide backdrop-blur-sm"
            >
              360° Feedback System
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Comprehensive <span className="text-blue-600">360°</span> Feedback
          </motion.h1>

          <motion.p
            className="mt-6 text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Gather insights from peers, managers, and direct reports for a complete view of performance and growth opportunities.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="h-12 px-8 text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all shadow-lg hover:shadow-xl">
                Start New Review
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" className="h-12 px-8 text-lg font-medium border-2">
                View Past Reviews
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated participant types */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {PARTICIPANT_TYPES.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all"
            >
              <div className={`${type.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <UserCircleIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{type.name}</h3>
            </motion.div>
          ))}
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Feedback Features
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need for comprehensive performance evaluation
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <Card className="h-full border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm bg-white/80 dark:bg-slate-800/80">
                <CardContent className="p-6">
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    className="mb-4 p-3 rounded-full bg-gray-100 dark:bg-gray-800 w-fit"
                  >
                    {feature.icon}
                  </motion.div>
                  <CardTitle className="text-xl font-semibold mb-2">
                    {feature.title}
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feedback Interface */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Start Gathering Feedback
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Create a new feedback cycle in just a few clicks
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex w-full bg-gray-100 dark:bg-slate-700 p-2 rounded-none">
              <TabsTrigger value="request" className="flex-1 py-4 text-base font-medium">
                Request Feedback
              </TabsTrigger>
              <TabsTrigger value="give" className="flex-1 py-4 text-base font-medium">
                Give Feedback
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="request" className="p-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="space-y-6">
                  <div>
                    <Label className="text-lg">Select Reviewers</Label>
                    <Input placeholder="Search team members..." className="mt-2 py-4 text-base" />
                    <div className="mt-4 flex flex-wrap gap-2">
                      {["Alex Johnson", "Sarah Williams", "Michael Chen", "Emma Davis"].map((name) => (
                        <Badge key={name} className="px-3 py-2 text-base bg-blue-100 dark:bg-blue-900/50">
                          {name}
                          <button className="ml-2 text-blue-500 hover:text-blue-700">
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-lg">Feedback Categories</Label>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {['Leadership', 'Communication', 'Teamwork', 'Problem Solving'].map((cat) => (
                        <div key={cat} className="flex items-center space-x-3">
                          <input type="checkbox" id={cat} className="w-5 h-5 text-blue-600 rounded" />
                          <label htmlFor={cat} className="text-lg">{cat}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-lg">Due Date</Label>
                    <Input type="date" className="mt-2 py-4 text-base" />
                  </div>
                  <div className="flex justify-end">
                    <Button className="h-12 px-8 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      Send Requests
                    </Button>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="give" className="p-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="space-y-6">
                  <div>
                    <Label className="text-lg">About</Label>
                    <div className="mt-2 flex items-center space-x-4 bg-gray-100 dark:bg-slate-700 rounded-lg p-4">
                      <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center text-white">
                        AJ
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Alex Johnson</h3>
                        <p className="text-gray-600 dark:text-gray-300">Product Manager</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-lg">Strengths</Label>
                    <Textarea 
                      placeholder="What are they doing exceptionally well?" 
                      rows={4} 
                      className="mt-2 py-4 text-base"
                    />
                  </div>
                  <div>
                    <Label className="text-lg">Areas for Improvement</Label>
                    <Textarea 
                      placeholder="What could they work on?" 
                      rows={4} 
                      className="mt-2 py-4 text-base"
                    />
                  </div>
                  <div>
                    <Label className="text-lg">Overall Rating</Label>
                    <div className="flex space-x-2 mt-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.span 
                          key={star}
                          className="text-3xl text-gray-300 cursor-pointer hover:text-yellow-400"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          ★
                        </motion.span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button className="h-12 px-8 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      Submit Feedback
                    </Button>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-white dark:bg-slate-800 py-20 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How 360° Feedback Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A simple, effective process for gathering comprehensive feedback
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {PROCESS_STEPS.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
                whileHover={{ y: -10 }}
              >
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-900 rounded-xl p-8 h-full border border-gray-200 dark:border-slate-600">
                  <motion.div 
                    className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {step.step}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3 mt-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Leading Teams
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See how organizations are transforming their feedback culture
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 md:p-12"
              >
                <div className="flex flex-col md:flex-row items-center">
                  <div className="mb-6 md:mb-0 md:mr-8">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl">
                      {TESTIMONIALS[currentTestimonial].name.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <p className="text-xl italic text-gray-700 dark:text-gray-300 mb-6">
                      "{TESTIMONIALS[currentTestimonial].content}"
                    </p>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {TESTIMONIALS[currentTestimonial].name}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {TESTIMONIALS[currentTestimonial].role}, {TESTIMONIALS[currentTestimonial].company}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center mt-8 space-x-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  className={`w-3 h-3 rounded-full ${currentTestimonial === idx ? 'bg-blue-600' : 'bg-gray-300'}`}
                />
              ))}
            </div>

            <button 
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white dark:bg-slate-700 rounded-full p-2 shadow-md hover:bg-gray-100 dark:hover:bg-slate-600"
            >
              <ChevronLeftIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </button>
            <button 
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white dark:bg-slate-700 rounded-full p-2 shadow-md hover:bg-gray-100 dark:hover:bg-slate-600"
            >
              <ChevronRightIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-center overflow-hidden"
        >
          <div className="relative">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/20 rounded-full"></div>
            
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Start Your 360° Feedback?
              </h2>
            </motion.div>
            
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Transform your performance review process with comprehensive 360° feedback
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="h-14 px-10 text-lg font-medium bg-white text-blue-600 hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl">
                Get Started Now
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">360Feedback</h3>
              <p className="text-gray-400">Comprehensive performance insights</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-500">
            <p>© 2023 360Feedback. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}