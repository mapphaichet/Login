"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Header from "./header"
import Sidebar from "./sidebar"

type User = {
  id: string
  email: string
  name: string
  picture?: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// List of public paths that don't require authentication
const publicPaths = ["/login", "/forgot-password", "/verify-otp"]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Check authentication status and get user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/user/profile', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle token from Google callback
  useEffect(() => {
    const token = searchParams?.get('token');
    if (token) {
      // Remove token from URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [searchParams]);

  // Redirect based on auth state
  useEffect(() => {
    if (isLoading) return;

    const isPublicPath = publicPaths.some((path) => pathname?.startsWith(path));

    if (!user && !isPublicPath) {
      router.push("/login");
    }
  }, [user, isLoading, pathname, router]);

  const loginWithGoogle = async () => {
    try {
      window.location.href = 'http://localhost:8080/auth/google';
    } catch (error) {
      console.error("Google login error:", error);
      return Promise.reject(error);
    }
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:8080/auth/logout', {
        credentials: 'include',
        method: 'POST'
      });
      setUser(null);
      window.location.href = '/login';
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const login = async (email: string, password: string) => {
    // Implement regular login if needed
    return Promise.reject("Regular login not implemented");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithGoogle,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {!isLoading &&
        (publicPaths.some(path => pathname?.startsWith(path)) ? (
          children
        ) : (
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              <div className="flex-1 overflow-auto bg-gray-50">{children}</div>
            </div>
          </div>
        ))}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
