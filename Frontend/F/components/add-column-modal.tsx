"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddColumnModalProps {
  isOpen: boolean
  onClose: () => void
  onAddColumn: (columnData: { name: string }) => void
}

export function AddColumnModal({ isOpen, onClose, onAddColumn }: AddColumnModalProps) {
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onAddColumn({
      name: name.trim(),
    })

    // Đặt lại form
    setName("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Thêm cột mới</DialogTitle>
            <DialogDescription>Tạo một cột mới cho bảng của bạn</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên cột</Label>
              <Input
                id="name"
                placeholder="Nhập tên cột"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Thêm cột
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
