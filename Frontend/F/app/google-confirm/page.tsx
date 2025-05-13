"use client"

import { useRouter } from "next/navigation"
import { PandaLogo } from "@/components/panda-logo"
import { GoogleLogo } from "@/components/google-logo"
import { useAuth } from "@/components/auth-provider"

export default function GoogleConfirmPage() {
  const router = useRouter()
  const { loginWithGoogle } = useAuth()

  const handleCancel = () => {
    router.push("/google-signin")
  }

  const handleContinue = async () => {
    try {
      // Use the same loginWithGoogle function as the sign-in with Google button
      // This ensures the same authentication and redirection logic
      await loginWithGoogle()

      // The loginWithGoogle function in useAuth will handle the redirection
    } catch (error) {
      console.error("Error during Google sign-in:", error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center">
        <GoogleLogo />
        <span className="ml-2 text-xl">Sign in with Google</span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Left side with panda logo and text */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <PandaLogo size={120} />
          <h2 className="text-2xl font-bold mt-8">You are signing in to</h2>
          <p className="text-gray-600 text-lg">taskmanagement.com</p>
        </div>

        {/* Right side with account info and buttons */}
        <div className="flex-1 flex flex-col justify-center max-w-md px-8">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white">J</div>
            <div className="ml-4">
              <div className="font-medium">John Doe</div>
              <div className="text-gray-500 text-sm">johndoe@gmail.com</div>
            </div>
            <div className="ml-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-8">
            To understand how taskmanagement.com will handle and protect your data.
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleCancel}
              className="flex-1 py-2.5 px-4 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 py-2.5 px-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm"
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 flex justify-between border-t">
        <div className="flex items-center">
          <select className="bg-transparent border-none text-sm text-gray-600 focus:outline-none">
            <option>English</option>
            <option>Français</option>
            <option>Español</option>
            <option>Deutsch</option>
          </select>
        </div>
        <div className="flex gap-4 text-sm text-gray-600">
          <a href="#" className="hover:underline">
            Help
          </a>
          <a href="#" className="hover:underline">
            Privacy
          </a>
          <a href="#" className="hover:underline">
            Terms
          </a>
        </div>
      </div>
    </div>
  )
}
