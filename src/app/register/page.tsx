"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      toast.success("Registration successful!");
      router.push("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-blue-200">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center items-center text-center lg:text-left">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Create Your Performance Review Account
          </h1>
          <p className="text-gray-600 mb-8 max-w-md">
            Join our platform to manage your performance evaluations and track your professional growth.
          </p>
          <img
            src="/images/dataa.png"
            alt="Business Account Icon"
            className="w-64 h-auto mb-8"
          />
          <p className="text-gray-500 text-sm mt-auto">
            © 2019 Business registration form. All Rights Reserved | Design by{" "}
            <a href="#" className="text-blue-500 hover:underline">
              W3layouts
            </a>
          </p>
        </div>

        <div className="w-full lg:w-1/2 p-8 lg:p-12 bg-yellow-100 flex flex-col justify-center">
          <div>
            <img
              src="/images/smct.png"
              alt="Logo"
              className="h-25 w-auto mx-auto mb-4"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Create Your Account
          </h2>
          <p className="text-gray-600 mb-8">Fill in your details to register.</p>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-700">
                FULL NAME
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter Your Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
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
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
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
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700">
                CONFIRM PASSWORD
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
              />
              <Label htmlFor="terms" className="text-gray-700">
                I agree to the Terms & Conditions
              </Label>
            </div>

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

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
                Login here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
} 