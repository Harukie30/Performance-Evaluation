"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { authAPI } from "@/services/api";

// Login form schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleLogin = async (data: LoginFormValues) => {
    console.log("=== LOGIN ATTEMPT START ===");
    console.log("Form submitted with data:", { 
      email: data.email, 
      password: data.password ? "[REDACTED]" : "undefined",
      rememberMe: data.rememberMe 
    });

    if (isLocked) {
      const remainingTime = Math.ceil((lockoutTime! - Date.now()) / 1000);
      toast.error(
        `Account is locked. Please try again in ${remainingTime} seconds.`
      );
      return;
    }

    setIsLoading(true);
    console.log("Starting login process...");

    try {
      if (!data.email || !data.password) {
        throw new Error("Email and password are required");
      }

      console.log("Attempting login with:", { email: data.email });
      console.log("About to call authAPI.login...");
      
      const response = await authAPI.login(data.email, data.password);
      console.log("Raw login response:", response);

      if (!response || !response.data) {
        console.error("No response or data received");
        throw new Error("No response from server");
      }

      console.log("Login response data:", response.data);

      if (!response.data.user) {
        console.error("No user data in response");
        throw new Error("Invalid response format from server");
      }

      const userData = response.data.user;
      console.log("User data received:", {
        id: userData.id,
        email: userData.email,
        role: userData.role,
        name: userData.name,
      });

      // Store remember me preference and user data only if remember me is checked
      if (data.rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("userEmail", userData.email);
        localStorage.setItem("userRole", userData.role);
        localStorage.setItem("userName", userData.name);
      } else {
        // Clear any existing stored data
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
      }

      toast.success("Login successful!");

      // Redirect based on user role (case-insensitive comparison)
      const userRole = userData.role.toLowerCase();
      if (userRole === "hr") {
        console.log("User is HR, redirecting to HR dashboard");
        router.push("/hr-dashboard");
      } else if (userRole === "evaluator") {
        console.log("User is Evaluator, redirecting to evaluator dashboard");
        router.push("/evaluator-dashboard");
      } else if (userRole === "employee") {
        console.log("User is Employee, redirecting to employee dashboard");
        router.push("/employee-dashboard");
      } else {
        console.log("User is regular user, redirecting to dashboard");
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.log("=== LOGIN ERROR CAUGHT ===");
      console.error("Login error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack,
        config: error.config,
        isAxiosError: error.isAxiosError,
        code: error.code,
        name: error.name,
        toString: error.toString()
      });

      setLoginAttempts((prev) => {
        const newAttempts = prev + 1;
        console.log(`Login attempt ${newAttempts} failed`);
        if (newAttempts >= 5) {
          console.log("Account locked due to too many failed attempts");
          setIsLocked(true);
          setLockoutTime(Date.now() + 15 * 60 * 1000); // 15 minutes lockout
          setTimeout(() => {
            setIsLocked(false);
            setLoginAttempts(0);
            setLockoutTime(null);
          }, 15 * 60 * 1000);
        }
        return newAttempts;
      });

      // Extract error message from different possible sources
      let errorMessage = "Invalid credentials";
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
        if (error.response.data.details) {
          console.log("Error details:", error.response.data.details);
        }
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.status === 401) {
        errorMessage = "Invalid email or password";
      } else if (error.response?.status === 400) {
        errorMessage = "Please check your input and try again";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later";
      } else if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
        errorMessage = "Network error. Please check your connection";
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = "Request timeout. Please try again";
      }
      
      console.log("Final error message:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      console.log("=== LOGIN ATTEMPT END ===");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-200 to-blue-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden flex flex-col lg:flex-row"
      >
        {/* Left side - Image and Info */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center items-center text-center lg:text-left bg-gradient-to-br from-blue-500 to-blue-600 text-white"
        >
          <h1 className="text-4xl font-bold mb-6">Welcome Back!</h1>
          <p className="text-blue-100 mb-8 max-w-md">
            Access your performance evaluation dashboard and manage your
            professional growth.
          </p>
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            src="/images/dataa.png"
            alt="Business Account Icon"
            className="w-64 h-auto mb-8"
          />
          <div className="mt-auto text-sm text-blue-100">
            <p>Don't have an account?</p>
            <Link
              href="/register"
              className="text-white font-semibold hover:underline"
            >
              Create an account
            </Link>
          </div>
        </motion.div>

        {/* Right side - Login Form */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center"
        >
          <div className="max-w-md mx-auto w-full">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="text-center mb-8"
            >
              <img
                src="/images/smct.png"
                alt="Logo"
                className="h-16 w-auto mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold text-gray-900">
                Sign in to your account
              </h2>
            </motion.div>

            <Form {...form}>
              <div 
                className="space-y-6"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isLoading && !isLocked) {
                    e.preventDefault();
                    form.handleSubmit(handleLogin)();
                  }
                }}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10"
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="pl-10 pr-10"
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Remember me
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-500 text-white hover:bg-green-500 transition-colors"
                  disabled={isLoading || isLocked}
                  onClick={form.handleSubmit(handleLogin)}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </div>
            </Form>

            {isLocked && lockoutTime && (
              <div className="mt-4 text-center text-sm text-red-600">
                Account is locked. Please try again in{" "}
                {Math.ceil((lockoutTime - Date.now()) / 1000)} seconds.
              </div>
            )}

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                By signing in, you agree to our{" "}
                <Link
                  href="/terms"
                  className="text-blue-600 hover:text-blue-500"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-blue-600 hover:text-blue-500"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
