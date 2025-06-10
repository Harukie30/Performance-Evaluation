"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const user = await response.json();
      Cookies.set("user", JSON.stringify(user), {
        expires: 7,
        path: "/",
        sameSite: "lax",
      });

      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-blue-200">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center items-center text-center lg:text-left">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Manage Your Performace Review Account
          </h1>
          <p className="text-gray-600 mb-8 max-w-md">
            Donec dictum nisl nec mi lacinia, sed maximus tellus eleifend. Proin
            molestie cursus sapien ac eleifend
          </p>
          <img
            src="/images/dataa.png"
            alt="Business Account Icon"
            className="w-64 h-auto mb-8"
          />
          <p className="text-gray-500 text-sm mt-auto">
            © 2019 Business login form. All Rights Reserved | Design by{" "}
            <a href="#" className="text-blue-500 hover:underline">
              W3layouts
            </a>
          </p>
        </div>

        <div className="w-full lg:w-1/2 p-8 lg:p-12 bg-gray-50 flex flex-col justify-center">
          <div>
            <img
              src="/images/smct.png" // change to your actual logo path
              alt="Logo"
              className="h-25 w-auto mx-auto mb-4"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Login To Your Account
          </h2>
          <p className="text-gray-600 mb-8">Enter your details to login.</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                EMAIL ADDRESS
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
              />
              <Label htmlFor="remember" className="text-gray-700">
                Remember Me
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
                  Logging in...
                </>
              ) : (
                "LOGIN"
              )}
            </Button>

            <p className="text-center text-sm text-gray-600 mt-4">
              By clicking login, you agree to our{" "}
              <a href="#" className="text-blue-500 hover:underline">
                Terms & Conditions!
              </a>
            </p>

            <p className="text-center text-gray-600 mt-4">
              Don't have an account?{" "}
              <a href="#" className="text-blue-500 hover:underline">
                Register here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
