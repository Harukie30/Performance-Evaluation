"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Github, Linkedin, Mail, Code, Rocket, ShieldCheck, 
  Sparkles, GitPullRequest, Globe, Cpu, Lock, Zap 
} from "lucide-react";
import { GlowingStarsBackground } from "@/components/ui/glowing-stars";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { WavyBackground } from "@/components/ui/wavy-background";

export default function DevTeamLanding() {
  const teamMembers = [
    {
      name: "Allan Justin Mascarinas",
      role: "Fullstack Dev",
      avatar: "/images/lan.png",
      skills: ["React", "TypeScript", "Next.js"],
      github: "#",
      linkedin: "#",
      projects: 18,
      expertise: "Fornt and Back end"
    },
    {
      name: "Jenecil Patac",
      role: "Backend Engineer",
      avatar: "/images/jen.png",
      skills: ["Node.js", "GraphQL", "AWS"],
      github: "#",
      linkedin: "#",
      projects: 22,
      expertise: "Cloud Architecture"
    },
    {
      name: "Mark Anthony Bulala",
      role: "Back-end Developer",
      avatar: "/images/mac.png",
      skills: ["React", "Python", "Docker"],
      github: "#",
      linkedin: "#",
      projects: 15,
      expertise: "DevOps Integration"
    },
    {
      name: "Amadeus Mozart Labao ",
      role: "Front-End Dev",
      avatar: "/images/zart.png",
      skills: ["Kubernetes", "CI/CD", "Terraform"],
      github: "#",
      linkedin: "#",
      projects: 27,
      expertise: "Web Design"
    }
  ];

  const features = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "AI-Enhanced Development",
      description: "Leveraging cutting-edge AI tools to accelerate delivery"
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Zero-Trust Security",
      description: "Military-grade security protocols for all projects"
    },
    {
      icon: <GitPullRequest className="h-6 w-6" />,
      title: "Continuous Innovation",
      description: "Weekly sprints with measurable outcomes"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Performance",
      description: "Optimized solutions with 99.99% uptime"
    }
  ];

  const words = [
    { text: "Building" },
    { text: "the" },
    { text: "future", className: "text-blue-500" },
    { text: "of" },
    { text: "digital", className: "text-blue-500" },
    { text: "government" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 relative overflow-x-hidden">
      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <div className="flex items-center gap-4 mb-6">
              <img src="/images/smct.png" alt="SMCT Logo" className="h-10 w-auto" />
              <span className="text-2xl font-extrabold text-blue-700 tracking-tight">SMCT DevTeam</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Building the Future of Digital Government
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Transforming government services through innovative technology and secure digital experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 shadow">
                Start Project
              </Button>
              <Button size="lg" variant="outline" className="text-blue-700 border-blue-600 hover:bg-blue-50">
                View Case Studies
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex-1 flex justify-center"
          >
            <Card className="rounded-2xl shadow-xl bg-white p-8 border border-gray-100 w-full max-w-md">
              <Code className="h-12 w-12 text-blue-500 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-center text-gray-800">Our Tech Stack</h3>
              <div className="flex flex-wrap gap-2 mb-6 justify-center">
                {["Next.js", "TypeScript", "Tailwind", "Node.js", "AWS"].map((tech) => (
                  <Badge key={tech} className="bg-blue-50 text-blue-700 border border-blue-100">
                    {tech}
                  </Badge>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-50 text-blue-700 border border-blue-100">Why SMCT</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Next-Gen Government Solutions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We combine cutting-edge technology with deep public sector expertise to deliver secure, scalable solutions.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -6, scale: 1.03 }}
              className="transition-all"
            >
              <Card className="h-full p-6 bg-white border border-blue-50 shadow hover:shadow-lg">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-blue-500 bg-blue-50">
                  {feature.icon}
                </div>
                <CardTitle className="mb-2 text-gray-900">{feature.title}</CardTitle>
                <CardDescription className="text-gray-600">{feature.description}</CardDescription>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-50 text-blue-700 border border-blue-100">Meet The Team</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Our Talented Developers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Security-cleared professionals dedicated to transforming government technology.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -6, scale: 1.03 }}
              className="transition-all"
            >
              <Card className="overflow-hidden bg-white border border-blue-50 shadow hover:shadow-lg">
                <div className="bg-blue-50 p-6 flex justify-center">
                  <Avatar className="w-20 h-20 border-4 border-white shadow">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardContent className="text-center pt-6">
                  <CardTitle className="mb-1 text-gray-900">{member.name}</CardTitle>
                  <CardDescription className="text-blue-700 font-medium">
                    {member.role}
                  </CardDescription>
                  <p className="text-sm text-gray-500 mt-2">{member.expertise}</p>
                  <div className="flex flex-wrap gap-2 justify-center mt-4 mb-4">
                    {member.skills.map((skill, i) => (
                      <Badge key={i} className="bg-blue-50 text-blue-700 border border-blue-100">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center gap-2 bg-blue-50 border-t border-blue-100">
                  <Button variant="ghost" size="icon" asChild>
                    <a href={member.github} target="_blank" rel="noopener">
                      <Github className="h-4 w-4 text-blue-700" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a href={member.linkedin} target="_blank" rel="noopener">
                      <Linkedin className="h-4 w-4 text-blue-700" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}