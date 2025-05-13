"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface PrivacyModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  options: {
    id: string
    label: string
    description?: string
  }[]
  defaultValue?: string
  onSave: (value: string) => void
}

export function PrivacyModal({
  isOpen,
  onClose,
  title,
  description,
  options,
  defaultValue,
  onSave,
}: PrivacyModalProps) {
  const [selectedValue, setSelectedValue] = useState(defaultValue || options[0]?.id || "")

  // Update selectedValue when defaultValue changes
  useEffect(() => {
    if (defaultValue) {
      setSelectedValue(defaultValue)
    }
  }, [defaultValue])

  const handleSave = () => {
    onSave(selectedValue)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="py-4">
          <RadioGroup value={selectedValue} onValueChange={setSelectedValue} className="space-y-4">
            {options.map((option) => (
              <div key={option.id} className="flex items-start space-x-2">
                <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                <div className="grid gap-1.5">
                  <Label htmlFor={option.id} className="font-medium">
                    {option.label}
                  </Label>
                  {option.description && <p className="text-sm text-muted-foreground">{option.description}</p>}
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSave}>Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
