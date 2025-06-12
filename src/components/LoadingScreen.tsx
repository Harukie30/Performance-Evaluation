"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100"
    >
      {/* Subtle background animation */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        animate={{
          background: [
            'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
            'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
            'linear-gradient(135deg, #e5e7eb 0%, #f3f4f6 100%)',
            'linear-gradient(135deg, #f3f4f6 0%, #f9fafb 100%)',
          ]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      >
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMC41IiBmaWxsPSIjZDRkOGUxIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjwvc3ZnPg==')] opacity-20" />
      </motion.div>

      <div className="relative z-10 text-center p-8 bg-blue/90 backdrop-blur-sm rounded-xl border bg-blue-100 border-gray-200 shadow-lg max-w-sm w-full mx-4">
        {/* Logo with gentle pulse */}
        <motion.div
          className="mb-6"
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <img
            src="/images/smct.png"
            alt="SMCT Logo"
            className="h-16 w-auto mx-auto"
          />
        </motion.div>

        {/* Modern animated progress bar */}
        <motion.div
          className="h-3.5 bg-gray-200 rounded-full overflow-hidden mb-6"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-yellow-400"
            initial={{ width: "0%" }}
            animate={{ 
              width: ["0%", "30%", "70%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Spinner with smooth rotation */}
        <motion.div
          className="mb-6"
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          <Loader2 className="h-8 w-8 text-blue-500 mx-auto" />
        </motion.div>

        {/* Elegant text animation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-700"
        >
          <p className="text-lg font-medium mb-1">Preparing Performance Dashboard</p>
          <motion.p
            className="text-sm text-gray-500 flex justify-center items-center"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          >
            Securely loading employee data
            <motion.span 
              className="ml-1 inline-block"
              animate={{ opacity: [0, 1] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.3
              }}
            >.</motion.span>
            <motion.span 
              className="inline-block"
              animate={{ opacity: [0, 1] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.6
              }}
            >.</motion.span>
            <motion.span 
              className="inline-block"
              animate={{ opacity: [0, 1] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.9
              }}
            >.</motion.span>
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}