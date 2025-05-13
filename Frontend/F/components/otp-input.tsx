"use client"

import { useRef, useState, useEffect, type KeyboardEvent, type ClipboardEvent, type ChangeEvent } from "react"

interface OTPInputProps {
  length: number
  onComplete: (otp: string) => void
}

export function OTPInput({ length = 6, onComplete }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const focusInput = (index: number) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index]?.focus()
      // Select the content
      inputRefs.current[index]?.select()
    }
  }

  // Focus the first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 100)
    }
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value

    if (isNaN(Number(value))) return

    // Only take the last character if multiple are somehow entered
    const singleValue = value.slice(-1)

    // Update the OTP array
    const newOtp = [...otp]
    newOtp[index] = singleValue
    setOtp(newOtp)

    // Check if we've completed the OTP
    if (newOtp.every((v) => v !== "")) {
      onComplete(newOtp.join(""))
    }

    // Move to next input if we have a value
    if (singleValue && index < length - 1) {
      focusInput(index + 1)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        // If current input is empty and backspace is pressed, move to previous input
        focusInput(index - 1)
      } else {
        // Clear current input
        const newOtp = [...otp]
        newOtp[index] = ""
        setOtp(newOtp)
      }
      e.preventDefault()
    }
    // Handle left arrow key
    else if (e.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1)
    }
    // Handle right arrow key
    else if (e.key === "ArrowRight" && index < length - 1) {
      focusInput(index + 1)
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Check if pasted data is numeric
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split("").slice(0, length)
      const newOtp = [...otp]

      digits.forEach((digit, idx) => {
        if (idx < length) {
          newOtp[idx] = digit
        }
      })

      setOtp(newOtp)

      // Focus the next empty input or the last one
      const nextEmptyIndex = newOtp.findIndex((val) => val === "")
      if (nextEmptyIndex !== -1) {
        focusInput(nextEmptyIndex)
      } else {
        focusInput(length - 1)
      }

      // Call onComplete if all inputs are filled
      if (newOtp.every((v) => v !== "")) {
        onComplete(newOtp.join(""))
      }
    }
  }

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          ref={(el) => (inputRefs.current[index] = el)}
          className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          autoComplete="off"
        />
      ))}
    </div>
  )
}
