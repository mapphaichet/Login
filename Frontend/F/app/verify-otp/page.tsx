"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { OTPInput } from "@/components/otp-input"
import { useAuth } from "@/components/auth-provider"

export default function VerifyOTPPage() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [otp, setOtp] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || "johndoe@gmail.com"
  const { login } = useAuth()

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)

    try {
      // Simulate API call to verify OTP
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Use the same login function as the sign-in button
      // This ensures the same authentication and redirection logic
      await login(email, "password123") // Using a dummy password since OTP verification already confirms identity

      // The login function in useAuth will handle the redirection
    } catch (error) {
      console.error("Error during OTP verification:", error)
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert("A new verification code has been sent to your email.")
  }

  const handleOtpComplete = (value: string) => {
    setOtp(value)
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2 text-center">ENTER OTP</h1>
          <p className="text-gray-500 mb-1 text-center">Enter the verification code sent to</p>
          <p className="text-gray-500 mb-8 text-center">{email}</p>
        </div>

        <form onSubmit={handleVerify}>
          <div className="mb-8">
            <OTPInput length={6} onComplete={handleOtpComplete} />
          </div>

          <button
            type="submit"
            disabled={isVerifying || otp.length !== 6}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md mb-6"
          >
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </button>

          <div className="text-center mb-4">
            <span className="text-gray-500">Didn't receive the code? </span>
            <button type="button" onClick={handleResend} className="text-purple-600 hover:underline">
              Resend
            </button>
          </div>

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
