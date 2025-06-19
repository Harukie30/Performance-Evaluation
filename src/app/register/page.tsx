"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Lock, User } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    role: "employee",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }
      toast.success("Registration successful! Please log in.");
      router.push("/login");
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center p-4 bg-blue-200"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden flex flex-col lg:flex-row"
      >
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center items-center text-center lg:text-left"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Create Your Performance Review Account
          </h1>
          <p className="text-gray-600 mb-8 max-w-md">
            Join our platform to manage your performance evaluations and track your professional growth.
          </p>
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            src="/images/reg.png"
            alt="Business Account Icon"
            className="w-64 h-auto mb-8"
          />
          <p className="text-gray-500 text-sm mt-auto">
            © 2025 Perormance login form. All Rights Reserved | Design by{" "}
            <a href="#" className="text-blue-500 hover:underline">
              SMCT DevTeam
            </a>
          </p>
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="w-full lg:w-1/2 p-8 lg:p-12 bg-yellow-100 flex flex-col justify-center"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <img
              src="/images/smct.png"
              alt="Logo"
              className="h-25 w-auto mx-auto mb-4"
            />
          </motion.div>
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="text-3xl font-bold text-gray-800 mb-2"
          >
            Create Your Account
          </motion.h2>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="text-gray-600 mb-8"
          >
            Fill in your details to register.
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="name" className="text-gray-700">
                FULL NAME
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter Your Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="email" className="text-gray-700">
                EMAIL ADDRESS
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter Your Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="password" className="text-gray-700">
                PASSWORD
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="department" className="text-gray-700">
                DEPARTMENT
              </Label>
              <div className="relative">
                <Input
                  id="department"
                  name="department"
                  type="text"
                  placeholder="Enter Your Department"
                  value={form.department}
                  onChange={handleChange}
                  required
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="role" className="text-gray-700">
                ROLE
              </Label>
              <div className="relative">
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                  className="pl-3 pr-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500 w-full bg-white"
                >
                  <option value="employee">Employee</option>
                  <option value="evaluator">Evaluator</option>
                </select>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.3 }}
            >
              <Button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white font-semibold rounded hover:bg-green-600 transition-colors duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white inline-block"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  "REGISTER"
                )}
              </Button>
            </motion.div>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.3 }}
              className="text-center text-sm text-gray-600 mt-4"
            >
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
                Login here
              </a>
            </motion.p>
          </form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
} 