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
import { Textarea } from "@/components/ui/textarea"

interface AddCardModalProps {
  isOpen: boolean
  onClose: () => void
  onAddCard: (cardData: { title: string; description?: string }) => void
  columnId: string
}

export function AddCardModal({ isOpen, onClose, onAddCard, columnId }: AddCardModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onAddCard({
      title: title.trim(),
      description: description.trim() || undefined,
    })

    // Đặt lại form
    setTitle("")
    setDescription("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Thêm thẻ mới</DialogTitle>
            <DialogDescription>Tạo một thẻ mới cho danh sách của bạn</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề</Label>
              <Input
                id="title"
                placeholder="Nhập tiêu đề thẻ"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả (tùy chọn)</Label>
              <Textarea
                id="description"
                placeholder="Nhập mô tả chi tiết"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Thêm thẻ
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
