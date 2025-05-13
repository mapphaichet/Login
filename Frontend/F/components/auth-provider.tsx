"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import Header from "./header"
import Sidebar from "./sidebar"

type User = {
  id: string
  email: string
  name: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// List of public paths that don't require authentication
const publicPaths = ["/login", "/forgot-password", "/verify-otp", "/google-signin", "/google-confirm"]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  // Redirect based on auth state
  useEffect(() => {
    if (isLoading) return

    const isPublicPath = publicPaths.some((path) => pathname?.startsWith(path))

    if (!user && !isPublicPath) {
      router.push("/login")
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string) => {
    try {
      // In a real app, you would validate credentials with your backend
      // For demo purposes, we'll just create a mock user
      const mockUser = {
        id: "1",
        email,
        name: email.split("@")[0],
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))

      // Redirect to the boards page - this is the same destination as the sign-in button
      router.push("/boards")

      return Promise.resolve()
    } catch (error) {
      console.error("Login error:", error)
      return Promise.reject(error)
    }
  }

  const loginWithGoogle = async () => {
    try {
      // In a real app, you would implement Google OAuth
      // For demo purposes, we'll just create a mock user
      const mockUser = {
        id: "2",
        email: "google-user@example.com",
        name: "Google User",
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))

      // Redirect to the boards page - this is the same destination as the sign-in button
      router.push("/boards")

      return Promise.resolve()
    } catch (error) {
      console.error("Google login error:", error)
      return Promise.reject(error)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
  }

  const isPublicPath = publicPaths.some((path) => pathname?.startsWith(path))

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
        (isPublicPath ? (
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
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
