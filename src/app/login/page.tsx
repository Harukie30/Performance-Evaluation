"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { Mail, Lock, CheckCircle } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto md:h-[600px]">
        {/* Left Panel */}
        <div className="relative flex-1 p-10 flex flex-col justify-center text-white" style={{
          background: `linear-gradient(rgba(118, 75, 162, 0.7), rgba(102, 126, 234, 0.8)), url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          {/* Overlay for pseudo-element effect */}
          <div className="absolute inset-0 z-10" style={{
            background: 'linear-gradient(to bottom, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.8))'
          }} />
          
          <div className="relative z-20">
            <h1 className="text-4xl lg:text-5xl mb-4 font-bold text-shadow-lg">Welcome Back</h1>
            <p className="text-lg opacity-90 leading-relaxed mb-8 max-w-lg">
              Access your account to manage projects, track progress, and collaborate with your team.
            </p>
            
            <ul className="list-none space-y-4">
              <li className="flex items-center text-lg">
                <div className="mr-3 bg-white bg-opacity-20 w-9 h-9 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                Secure & encrypted data protection
              </li>
              <li className="flex items-center text-lg">
                <div className="mr-3 bg-white bg-opacity-20 w-9 h-9 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                Access from any device, anywhere
              </li>
              <li className="flex items-center text-lg">
                <div className="mr-3 bg-white bg-opacity-20 w-9 h-9 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                Real-time collaboration tools
              </li>
              <li className="flex items-center text-lg">
                <div className="mr-3 bg-white bg-opacity-20 w-9 h-9 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                24/7 customer support
              </li>
            </ul>
          </div>
        </div>
        
        {/* Right Panel */}
        <div className="flex-1 p-10 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h2 className="text-4xl text-gray-800 font-bold mb-2">Login</h2>
            <p className="text-xl text-gray-600">Sign in to your account to continue</p>
          </div>
          
          <div className="max-w-sm mx-auto w-full">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <Label htmlFor="email" className="block text-gray-700 font-medium mb-2 text-lg">Email Address</Label>
                <Mail className="absolute left-4 top-1/2 -translate-y-1/4 text-blue-500 text-xl" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                />
              </div>
              
              <div className="relative">
                <Label htmlFor="password" className="block text-gray-700 font-medium mb-2 text-lg">Password</Label>
                <Lock className="absolute left-4 top-1/2 -translate-y-1/4 text-blue-500 text-xl" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                />
              </div>
              
              <div className="flex justify-between items-center text-base">
                <div className="flex items-center">
                  <input type="checkbox" id="remember" className="mr-2" />
                  <Label htmlFor="remember" className="text-gray-600">Remember me</Label>
                </div>
                <a href="#" className="text-blue-600 font-medium hover:underline transition-colors duration-300">Forgot password?</a>
              </div>
              
              <Button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              
              <div className="text-center my-6 relative text-gray-500">
                <span className="relative z-10 bg-white px-4">Or continue with</span>
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gray-200 z-0" />
              </div>
              
              {/* Social login buttons (omitted for now as no lucide-react equivalents) */}
              
              <div className="text-center mt-8 text-gray-600 text-base">
                Don't have an account? <a href="#" className="text-blue-600 font-medium hover:underline ml-1">Sign up</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
