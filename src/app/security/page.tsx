"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ShieldCheck, LockKeyhole, KeyRound, Server, Fingerprint, FileLock2, BadgeCheck } from "lucide-react";

export default function SecurityPage() {
  const [activeFeature, setActiveFeature] = useState("encryption");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const securityFeatures = [
    {
      
      id: "encryption",
      title: "Advanced Encryption",
      description: "All data is protected using AES-256 encryption both in transit and at rest, meeting financial industry security standards.",
      icon: <LockKeyhole size={48} className="text-emerald-500" />,
      stats: [
        { label: "Encryption Standard", value: "AES-256" },
        { label: "Data Protection", value: "100%" }
      ]
    },
    {
      id: "access",
      title: "Role-Based Access",
      description: "Granular permission controls ensure only authorized personnel can access sensitive information, with full audit trails.",
      icon: <KeyRound size={48} className="text-blue-500" />,
      stats: [
        { label: "Access Levels", value: "Customizable" },
        { label: "Audit Logs", value: "24/7 Monitoring" }
      ]
    },
    {
      id: "compliance",
      title: "Regulatory Compliance",
      description: "Our platform adheres to GDPR, CCPA, and industry-specific regulations with regular third-party audits.",
      icon: <FileLock2 size={48} className="text-indigo-500" />,
      stats: [
        { label: "Compliance Frameworks", value: "GDPR, CCPA" },
        { label: "Audit Frequency", value: "Quarterly" }
      ]
    }
  ];

  const complianceBadges = [
    { name: "GDPR", description: "General Data Protection Regulation" },
    { name: "CCPA", description: "California Consumer Privacy Act" },
    { name: "ISO 27001", description: "Information Security Standard" },
    { name: "SOC 2", description: "Service Organization Controls" }
  ];

  const selectedFeature = securityFeatures.find(f => f.id === activeFeature);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 font-sans">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {isClient && [...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-5 dark:opacity-[0.03]"
            style={{
              background: "linear-gradient(45deg, #0ea5e9, #10b981)",
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
              duration: Math.random() * 30 + 30,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="mb-8 flex justify-center"
            >
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 w-24 h-24 rounded-full flex items-center justify-center shadow-xl">
                <ShieldCheck size={48} className="text-white" />
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Enterprise-Grade Data Protection
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-slate-700 dark:text-slate-300 mb-8 max-w-2xl mx-auto"
            >
              Protecting your sensitive information with industry-leading security practices and encryption standards
            </motion.p>
          </motion.div>
        </header>

        {/* Security Features */}
        <section className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {securityFeatures.map((feature) => (
              <motion.div
                key={feature.id}
                whileHover={{ y: -10 }}
                onClick={() => setActiveFeature(feature.id)}
                className={`cursor-pointer transition-all ${
                  activeFeature === feature.id
                    ? "ring-2 ring-emerald-500 ring-opacity-50"
                    : "opacity-90 hover:opacity-100"
                }`}
              >
                <Card className="h-full border-0 shadow-lg rounded-2xl overflow-hidden">
                  <div className={`h-2 ${
                    feature.id === "encryption" ? "bg-emerald-500" : 
                    feature.id === "access" ? "bg-blue-500" : 
                    "bg-indigo-500"
                  }`}></div>
                  <CardContent className="p-8">
                    <div className="mb-6 flex justify-center">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-bold text-center mb-4">
                      {feature.title}
                    </CardTitle>
                    <p className="text-slate-600 dark:text-slate-300 text-center mb-6">
                      {feature.description}
                    </p>
                    
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      {feature.stats.map((stat, idx) => (
                        <div key={idx} className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4 text-center">
                          <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                          <p className="font-bold text-slate-800 dark:text-white">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Detailed View */}
        <section className="container mx-auto px-4 py-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white dark:bg-slate-800 border-0 shadow-xl rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-emerald-500/20 p-3 rounded-xl">
                    {selectedFeature?.icon}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold">
                    {selectedFeature?.title} in Detail
                  </h2>
                </div>
                <p className="text-slate-300 max-w-3xl">
                  {selectedFeature?.description}
                </p>
              </div>
              
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      How we implement this security measure:
                    </h3>
                    
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full mt-1">
                          <BadgeCheck size={20} className="text-emerald-500" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">Continuous Monitoring</p>
                          <p className="text-slate-600 dark:text-slate-300 mt-1">
                            24/7 security monitoring with automated threat detection
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full mt-1">
                          <BadgeCheck size={20} className="text-emerald-500" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">Regular Audits</p>
                          <p className="text-slate-600 dark:text-slate-300 mt-1">
                            Quarterly third-party security audits and penetration testing
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full mt-1">
                          <BadgeCheck size={20} className="text-emerald-500" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">Security Training</p>
                          <p className="text-slate-600 dark:text-slate-300 mt-1">
                            Ongoing security awareness training for all personnel
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-6">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Security Verification</h3>
                    
                    <div className="space-y-4">
                      {[
                        { label: "Encryption Status", value: "Active", status: "verified" },
                        { label: "Last Audit", value: "Jun 15, 2024", status: "verified" },
                        { label: "Threat Detection", value: "Real-time", status: "verified" },
                        { label: "Data Integrity", value: "100%", status: "verified" },
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center pb-3 border-b border-slate-300 dark:border-slate-700">
                          <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${item.status === "verified" ? "text-emerald-500" : "text-blue-500"}`}>
                              {item.value}
                            </span>
                            <div className={`w-2 h-2 rounded-full ${item.status === "verified" ? "bg-emerald-500" : "bg-blue-500"}`}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-600 dark:text-slate-300">Security Rating</span>
                        <span className="text-emerald-500 font-bold">A+</span>
                      </div>
                      <div className="w-full bg-slate-300 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                          initial={{ width: 0 }}
                          animate={{ width: "98%" }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Compliance Section */}
        <section className="container mx-auto px-4 py-12 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Compliance & Certifications
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Our security practices meet rigorous industry standards and regulations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {complianceBadges.map((badge, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx + 0.6 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50 shadow rounded-xl overflow-hidden">
                  <CardContent className="p-8 flex flex-col items-center">
                    <div className="mb-6 bg-slate-100 dark:bg-slate-700/50 w-20 h-20 rounded-full flex items-center justify-center">
                      <FileLock2 size={32} className="text-emerald-500" />
                    </div>
                    <CardTitle className="text-xl font-bold text-center mb-2">
                      {badge.name}
                    </CardTitle>
                    <p className="text-slate-600 dark:text-slate-300 text-center">
                      {badge.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Have security questions?
              </h2>
            </motion.div>
            
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Our security team is available to answer your questions and provide documentation on our security practices.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Contact Security Team
            </motion.button>
          </motion.div>
        </section>

        {/* Security Principles */}
        <section className="container mx-auto px-4 py-12 max-w-4xl">
          <Card className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-800/50 border-0 shadow rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
                Our Security Principles
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { 
                    title: "Transparency", 
                    description: "We openly communicate our security practices and are willing to undergo independent verification.",
                    icon: <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full"><ShieldCheck className="text-blue-500" /></div>
                  },
                  { 
                    title: "Continuous Improvement", 
                    description: "We regularly review and enhance our security measures to address evolving threats.",
                    icon: <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full"><FileLock2 className="text-emerald-500" /></div>
                  },
                  { 
                    title: "Privacy by Design", 
                    description: "Data protection is incorporated into all our systems from the ground up.",
                    icon: <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full"><Fingerprint className="text-indigo-500" /></div>
                  }
                ].map((principle, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx + 0.8 }}
                    className="bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-xl p-6"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      {principle.icon}
                      <h3 className="font-bold text-slate-900 dark:text-white">{principle.title}</h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      {principle.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12 mt-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <ShieldCheck className="h-10 w-10 text-emerald-400 mx-auto" />
              </div>
              <p className="text-slate-400 mb-4">
                Enterprise Security Platform • Protecting Your Data Since 2018
              </p>
              <p className="text-slate-500 text-sm">
                © 2024 SecureHR. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}