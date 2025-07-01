"use client";
import { motion, AnimatePresence } from "framer-motion";


import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Github,
  Linkedin,
Users,
  Code,
  Rocket,
  ShieldCheck,
  Sparkles,
  GitPullRequest,
  Globe,
  Cpu,
  Lock,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";

export default function DevTeamLanding() {
  const teamMembers = [
    {
      name: "Allan Justin Mascarinas",
      role: "Fullstack Dev",
      avatar: "/images/lan.jpg",
      skills: [
        {
          name: "React",
          icon: <Code className="inline h-4 w-4 mr-1 text-blue-500" />,
        },
        {
          name: "TypeScript",
          icon: <Zap className="inline h-4 w-4 mr-1 text-blue-500" />,
        },
        {
          name: "Next.js",
          icon: <Rocket className="inline h-4 w-4 mr-1 text-blue-500" />,
        },
      ],
      github: "#",
      linkedin: "#",
      projects: 18,
      expertise: "Fornt and Back end",
      bio: "Loves building scalable web apps and exploring new tech.",
      portfolio: "#",
    },
    {
      name: "Jenecil Patac",
      role: "Backend Engineer",
      avatar: "/images/jen.jpeg",
      skills: [
        {
          name: "Node.js",
          icon: <Cpu className="inline h-4 w-4 mr-1 text-blue-500" />,
        },
        {
          name: "GraphQL",
          icon: <Globe className="inline h-4 w-4 mr-1 text-blue-500" />,
        },
        {
          name: "AWS",
          icon: <ShieldCheck className="inline h-4 w-4 mr-1 text-blue-500" />,
        },
      ],
      github: "#",
      linkedin: "#",
      projects: 22,
      expertise: "Cloud Architecture",
      bio: "Cloud enthusiast and API design expert.",
      portfolio: "#",
    },
    {
      name: "Mark Anthony Bulala",
      role: "Back-end Developer",
      avatar: "/images/mac.jpg",
      skills: [
        {
          name: "React",
          icon: <Code className="inline h-4 w-4 mr-1 text-blue-500" />,
        },
        {
          name: "Python",
          icon: <Sparkles className="inline h-4 w-4 mr-1 text-blue-500" />,
        },
        {
          name: "Docker",
          icon: <Rocket className="inline h-4 w-4 mr-1 text-blue-500" />,
        },
      ],
      github: "#",
      linkedin: "#",
      projects: 15,
      expertise: "DevOps Integration",
      bio: "Automates everything and loves container tech.",
      portfolio: "#",
    },
    {
      name: "Amadeus Mozart Labao ",
      role: "Front-End Dev",
      avatar: "/images/zart.jpg",
      skills: [
        {
          name: "Kubernetes",
          icon: <Cpu className="inline h-4 w-4 mr-1 text-blue-500" />,
        },
        {
          name: "CI/CD",
          icon: (
            <GitPullRequest className="inline h-4 w-4 mr-1 text-blue-500" />
          ),
        },
        {
          name: "Terraform",
          icon: <Globe className="inline h-4 w-4 mr-1 text-blue-500" />,
        },
      ],
      github: "#",
      linkedin: "#",
      projects: 27,
      expertise: "Web Design",
      bio: "UI/UX perfectionist and open source contributor.",
      portfolio: "#",
    },
  ];

  const features = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "AI-Powered Automotive Engineering",
      description: "Leveraging AI for vehicle design, performance tuning, and predictive maintenance.",
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Advanced Vehicle Security",
      description: "Military-grade cybersecurity to protect connected cars from modern threats.",
    },
    {
      icon: <GitPullRequest className="h-6 w-6" />,
      title: "Next-Gen R&D",
      description: "Pioneering new automotive technologies through continuous research and development.",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "High-Performance Drivetrains",
      description: "Engineered for maximum power, efficiency, and an unparalleled driving experience.",
    },
  ];

  const words = [
    { text: "Building" },
    { text: "the" },
    { text: "future", className: "text-blue-500" },
    { text: "of" },
    { text: "digital", className: "text-blue-500" },
    { text: "government" },
  ];

  // Tech stack for carousel
  const techStack = [
    { name: "Next.js", img: "/tech/next.png" },
    { name: "TypeScript", img: "/tech/type.png" },
    { name: "Tailwind CSS", img: "/tech/wind.png" },
    { name: "Node.js", img: "/tech/node.svg" },
    { name: "PostgreSQL", img: "/tech/post.png" },
    { name: "AWS", img: "/tech/aws.png" },
    { name: "Docker", img: "/tech/docker.svg" },
  ];
  const [currentTech, setCurrentTech] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const handlePrev = () =>
    setCurrentTech((prev) => (prev === 0 ? techStack.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrentTech((prev) => (prev === techStack.length - 1 ? 0 : prev + 1));

  // Auto-rotate carousel every 3 seconds, pause on hover
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered, techStack.length]);

  return (
    <div
      className="min-h-screen field-sizing-fixed overflow-x-hidden"
      style={{
        backgroundImage: "linear-gradient(to bottom, #fff, #1e3a8a), url('/images/bgg.png')",
        backgroundSize: "cover, cover",
        backgroundPosition: "center, center",
        backgroundRepeat: "no-repeat, no-repeat",
      }}
    >
      {/* Animated Gradient Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(120deg, rgba(59,130,246,0.12) 0%, rgba(30,64,175,0.10) 100%)",
          animation: "gradientMove 8s ease-in-out infinite alternate",
        }}
      />
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animated-gradient {
          background-size: 200% 200%;
        }
      `}</style>
      {/* Hero Section */}
      <section className="relative py-24 px-0 w-full overflow-hidden">
        {/* Background image with blur */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/images/bgg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(5px) brightness(0.5)",
          }}
          aria-hidden="true"
        />
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 z-10 bg-black/50" aria-hidden="true" />
        {/* Main content */}
        <div className="relative z-20">
          <div className="flex flex-col md:flex-row gap-12 items-center justify-between px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <div className="flex items-center gap-4 mb-6">
                <img
                  src="/images/smct.png"
                  alt="SMCT Logo"
                  className="h-10 w-auto"
                />
                <span className="text-2xl font-extrabold text-white tracking-tight">
                  SMCT DevTeam
                </span>
              </div>
              <span className="inline-block mb-3 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold tracking-wide border border-blue-200 shadow-sm">
                Official Internal Team
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Exclusively Empowering SMCT's Digital Future
              </h1>
              <p className="text-lg text-white mb-8 max-w-lg">
                The SMCT DevTeam is dedicated to building secure, innovative, and
                high-impact digital solutions exclusively for the SMCT community.
                Our mission: to set the standard for government technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-blue-600 text-white hover:bg-blue-700 shadow"
                >
                  Request SMCT Project
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-blue-700 border-blue-600 hover:bg-blue-50"
                >
                  See SMCT Impact
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex-1 flex flex-col justify-center items-center"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <h3 className="text-2xl font-bold mb-6 text-center bg-clip-text text-white">
                Our Technology Stack
              </h3>
              {/* Tech badges with enhanced animations */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full border border-blue-100 bg-white/70 hover:bg-blue-50 shadow-sm"
                    onClick={handlePrev}
                    aria-label="Previous tech"
                  >
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="text-blue-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </Button>
                </motion.div>

                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={techStack[currentTech].name}
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    className="w-80 h-80 flex items-center justify-center"
                  >
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Badge
                        className="px-8 py-7 rounded-3xl border-blue-200 bg-white/90 text-blue-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all cursor-pointer"
                      >
                        <div className="flex flex-col items-center gap-5">
                          {techStack[currentTech].img && (
                            <motion.img
                              src={techStack[currentTech].img}
                              alt={techStack[currentTech].name}
                              className="h-36 w-36 object-contain"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.1 }}
                            />
                          )}
                          <span className="text-3xl font-bold">{techStack[currentTech].name}</span>
                        </div>
                      </Badge>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full border border-blue-100 bg-white/70 hover:bg-blue-50 shadow-sm"
                    onClick={handleNext}
                    aria-label="Next tech"
                  >
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="text-blue-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Button>
                </motion.div>
              </div>

              {/* Tech stack indicators */}
              <div className="flex justify-center gap-2 mb-6">
                {techStack.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentTech(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentTech
                        ? "bg-blue-600 w-6"
                        : "bg-blue-200 w-2"
                    }`}
                    whileHover={{ scale: 1.2 }}
                    aria-label={`View ${techStack[index].name}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
  <div className="text-center mb-16">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Badge 
        variant="outline" 
        className="mb-4 bg-blue-50/50 text-blue-600 border-blue-100 hover:bg-blue-50 px-4 py-1 rounded-full shadow-sm"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        Why SMCT Automotive
      </Badge>
    </motion.div>
    
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-bold mb-5 bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent"
    >
      Next-Gen Automotive Solutions
    </motion.h2>
    
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      viewport={{ once: true }}
      className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
    >
      We integrate state-of-the-art technology with deep automotive expertise to build secure, high-performance vehicle solutions.
    </motion.p>
  </div>

  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
    {features.map((feature, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true, margin: "-50px" }}
        whileHover={{ 
          y: -8, 
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        className="relative group"
      >
        <Card className="h-full p-8 bg-white/90 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
          {/* Gradient background overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-indigo-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
          
          {/* Animated border effect */}
          <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-blue-100/50 transition-all duration-300 pointer-events-none" />
          
          {/* Icon container with subtle shine */}
          <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-blue-600 bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-inner group-hover:shadow-none transition-all">
            <div className="relative z-10">
              {feature.icon}
            </div>
            <div className="absolute inset-0 bg-white/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <CardTitle className="mb-3 text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {feature.title}
          </CardTitle>
          
          <CardDescription className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
            {feature.description}
          </CardDescription>
          
          {/* Learn more link (hidden until hover) */}
          <div className="mt-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <Button variant="link" size="sm" className="px-0 text-blue-600 hover:text-blue-800">
              Learn more
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </Card>
      </motion.div>
    ))}
  </div>

  {/* Decorative elements */}
  <div className="absolute left-0 right-0 -bottom-20 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none -z-10" />
</section>


      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
  <div className="text-center mb-16">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Badge 
        variant="outline" 
        className="mb-4 bg-blue-50/50 text-blue-600 border-blue-100 hover:bg-blue-50 px-4 py-1 rounded-full shadow-sm"
      >
        <Users className="h-4 w-4 mr-2" />
        Meet The Team
      </Badge>
    </motion.div>
    
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-bold mb-5 text-white"
    >
      Our Elite Development Team
    </motion.h2>
    
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      viewport={{ once: true }}
      className="text-xl text-white max-w-3xl mx-auto leading-relaxed"
    >
      Security-cleared professionals dedicated to transforming government technology with innovation and excellence.
    </motion.p>
  </div>

  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
    {teamMembers.map((member, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true, margin: "-50px" }}
        whileHover={{ 
          y: -10, 
          scale: 1.03,
          transition: { duration: 0.2 }
        }}
        className="relative group"
      >
        <Card className="h-full overflow-hidden bg-white/90 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all">
          {/* Gradient background overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-indigo-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
          
          {/* Avatar section with animated border */}
          <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 p-6 flex justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('/patterns/grid-pattern.svg')] opacity-10" />
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative z-10"
            >
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                <AvatarImage src={member.avatar} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 text-2xl font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            {/* Security clearance badge */}
            <div className="absolute bottom-3 right-3">
              <Badge className="bg-white text-blue-600 border border-blue-200 shadow-sm flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                <span className="text-xs">Security Cleared</span>
              </Badge>
            </div>
          </div>
          
          {/* Content section */}
          <CardContent className="text-center pt-6 px-6">
            <CardTitle className="mb-1.5 text-gray-900 text-xl font-semibold group-hover:text-blue-600 transition-colors">
              {member.name}
            </CardTitle>
            <CardDescription className="text-blue-600 font-medium">
              {member.role}
            </CardDescription>
            
            {/* Expertise with animated underline */}
            <div className="relative inline-block mt-3">
              <p className="text-sm font-medium text-gray-700 relative z-10">
                {member.expertise}
              </p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-100 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <p className="text-sm text-gray-500 mt-3 leading-relaxed">
              {member.bio}
            </p>
            
            {/* Skills badges */}
            <div className="flex flex-wrap gap-2 justify-center mt-5 mb-4">
              {member.skills.map((skill, i) => (
                <Tooltip key={i} content={skill.name}>
                  <Badge
                    className="bg-white text-blue-600 border border-blue-100 hover:bg-blue-50 transition-colors shadow-sm px-3 py-1.5"
                  >
                    <span className="text-blue-500">{skill.icon}</span>
                    <span className="ml-1.5">{skill.name}</span>
                  </Badge>
                </Tooltip>
              ))}
            </div>
          </CardContent>
          
          {/* Social footer with animated icons */}
          <CardFooter className="flex justify-center gap-3 bg-blue-50/50 border-t border-blue-100/50 p-4">
            <Tooltip content="GitHub Profile">
              <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full bg-white border border-blue-100 shadow-sm hover:bg-blue-50 text-blue-600"
                  asChild
                >
                  <a href={member.github} target="_blank" rel="noopener">
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
              </motion.div>
            </Tooltip>
            <Tooltip content="LinkedIn Profile">
              <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full bg-white border border-blue-100 shadow-sm hover:bg-blue-50 text-blue-600"
                  asChild
                >
                  <a href={member.linkedin} target="_blank" rel="noopener">
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
              </motion.div>
            </Tooltip>
            {member.portfolio && (
              <Tooltip content="Portfolio">
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full bg-white border border-blue-100 shadow-sm hover:bg-blue-50 text-blue-600"
                    asChild
                  >
                    <a href={member.portfolio} target="_blank" rel="noopener">
                      <Globe className="h-4 w-4" />
                    </a>
                  </Button>
                </motion.div>
              </Tooltip>
            )}
          </CardFooter>
          
          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute -inset-1 bg-blue-100/20 blur-lg" />
          </div>
        </Card>
      </motion.div>
    ))}
  </div>
</section>
    </div>
  );
}
