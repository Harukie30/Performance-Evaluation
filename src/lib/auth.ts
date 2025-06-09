// Simple user data
const USERS = [
  {
    id: "1",
    email: "admin@smct.com",
    password: "admin123",
    role: "admin",
    name: "Admin User",
    department: "IT",
    permissions: ["manage_users", "view_all_reviews", "create_reviews", "edit_reviews", "delete_reviews"]
  },
  {
    id: "2",
    email: "hr@smct.com",
    password: "hr123",
    role: "hr",
    name: "HR Manager",
    department: "Human Resources",
    permissions: ["view_all_reviews", "create_reviews", "edit_reviews"]
  },
  {
    id: "3",
    email: "evaluator@smct.com",
    password: "eval123",
    role: "evaluator",
    name: "John Evaluator",
    department: "Operations",
    permissions: ["create_reviews", "edit_own_reviews"]
  }
];

export const auth = {
  login: async (email: string, password: string) => {
    console.log("Auth login attempt:", { email, password });
    console.log("Available users:", USERS.map(u => ({ email: u.email, role: u.role })));
    
    // Simulate a small delay to feel like a real login
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = USERS.find(u => u.email === email && u.password === password);
    console.log("User lookup result:", user ? "found" : "not found");
    
    if (!user) {
      throw new Error("Invalid email or password");
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      department: user.department,
      permissions: user.permissions
    };
  },

  logout: async () => {
    try {
      // Call the logout endpoint to clear all cookies
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Important: include cookies in the request
      });
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      
      // Force a hard reload to clear any in-memory state
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if the API call fails, redirect to login
      window.location.href = '/login';
    }
  },

  getCurrentUser: () => {
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");
    
    if (!role || !email) {
      return null;
    }

    return { role, email };
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("userRole");
  }
};

export const verifyAuth = async (token: string) => {
  try {
    // Decode the token
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    
    // Find the user
    const user = USERS.find(u => u.id === decoded.id);
    
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      department: user.department,
      permissions: user.permissions
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}; 