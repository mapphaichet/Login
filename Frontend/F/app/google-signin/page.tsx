"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PandaLogo } from "@/components/panda-logo"
import { GoogleLogo } from "@/components/google-logo"

export default function GoogleSignInPage() {
  const router = useRouter()
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)

  const handleAccountSelect = (email: string) => {
    setSelectedAccount(email)
    router.push("/google-confirm")
  }

  const accounts = [
    { name: "John Doe", email: "johndoe@gmail.com", initial: "J" },
    { name: "Sarah Smith", email: "sarahsmith@gmail.com", initial: "S" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center">
        <GoogleLogo />
        <span className="ml-2 text-xl">Sign in with Google</span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Left side with panda logo */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <PandaLogo size={120} />
          <h2 className="text-2xl font-bold mt-8">Choose an account</h2>
          <p className="text-gray-600">to continue to taskmanagement.com</p>
        </div>

        {/* Right side with account selection */}
        <div className="flex-1 flex flex-col justify-center max-w-md px-8">
          {/* Account options */}
          <div className="border rounded-lg overflow-hidden">
            {accounts.map((account, index) => (
              <div
                key={account.email}
                className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${
                  index > 0 ? "border-t border-gray-200" : ""
                }`}
                onClick={() => handleAccountSelect(account.email)}
              >
                <div className={`w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white`}>
                  {account.initial}
                </div>
                <div className="ml-4">
                  <div className="font-medium">{account.name}</div>
                  <div className="text-gray-500 text-sm">{account.email}</div>
                </div>
              </div>
            ))}

            <div className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-t border-gray-200`}>
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <div className="font-medium">Use another account</div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-600">
            Before using taskmanagement.com, you can review the{" "}
            <a href="#" className="text-blue-600">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600">
              Terms of Service
            </a>
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
