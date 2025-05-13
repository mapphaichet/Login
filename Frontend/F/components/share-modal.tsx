"use client"

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Check, Copy, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  boardName: string
  boardId: string
}

export function ShareModal({ isOpen, onClose, boardName, boardId }: ShareModalProps) {
  const [email, setEmail] = useState("")
  const [permission, setPermission] = useState("view")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  // URL để chia sẻ
  const shareUrl = `${window.location.origin}/board/${boardId}`

  // Xử lý sao chép URL
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Xử lý gửi lời mời
  const handleSendInvite = () => {
    if (!email) return

    // Trong ứng dụng thực tế, bạn sẽ gửi lời mời qua API
    console.log("Gửi lời mời đến:", email, "với quyền:", permission)

    // Hiển thị thông báo thành công
    toast({
      title: "Đã gửi lời mời",
      description: `Đã gửi lời mời đến ${email}`,
    })

    // Đặt lại form
    setEmail("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chia sẻ bảng</DialogTitle>
          <DialogDescription>Mời người khác tham gia vào bảng "{boardName}"</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Địa chỉ email</Label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Mail className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  className="pl-8"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button onClick={handleSendInvite} disabled={!email}>
                Gửi
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Quyền truy cập</Label>
            <RadioGroup value={permission} onValueChange={setPermission} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="view" id="view" />
                <Label htmlFor="view" className="font-normal">
                  Chỉ xem
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="edit" id="edit" />
                <Label htmlFor="edit" className="font-normal">
                  Chỉnh sửa
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Liên kết chia sẻ</Label>
            <div className="flex items-center space-x-2">
              <Input value={shareUrl} readOnly className="flex-1" />
              <Button variant="outline" size="sm" onClick={handleCopyUrl}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Bất kỳ ai có liên kết này đều có thể xem bảng này. Hãy cẩn thận khi chia sẻ.
            </p>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
