"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would send a request to your backend
    // Redirect to OTP verification page
    router.push(`/verify-otp?email=${encodeURIComponent(email)}`)
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-8 py-12 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2 text-center">FORGOT PASSWORD</h1>
          <p className="text-gray-500 text-center">Enter your email to receive a reset link</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-base font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md mb-6"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>

          <div className="text-center">
            <Link href="/login" className="text-purple-600 hover:underline">
              Return to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
