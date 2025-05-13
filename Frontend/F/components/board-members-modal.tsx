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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, UserPlus, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

// Định nghĩa kiểu dữ liệu
type Member = {
  id: string
  name: string
  email: string
  initials: string
  avatar?: string
  role: "admin" | "editor" | "viewer"
}

type Board = {
  id: string
  name: string
  color: string
  description: string
  members: Member[]
}

interface BoardMembersModalProps {
  isOpen: boolean
  onClose: () => void
  board: Board
  onRemoveMember: (memberId: string) => void
  onChangeRole: (memberId: string, newRole: "admin" | "editor" | "viewer") => void
}

export function BoardMembersModal({ isOpen, onClose, board, onRemoveMember, onChangeRole }: BoardMembersModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [email, setEmail] = useState("")
  const { toast } = useToast()

  // Lọc thành viên theo từ khóa tìm kiếm
  const filteredMembers = board.members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Xử lý khi thêm thành viên mới
  const handleAddMember = () => {
    if (!email) return

    // Kiểm tra email đã tồn tại chưa
    const existingMember = board.members.find((member) => member.email === email)
    if (existingMember) {
      toast({
        title: "Thành viên đã tồn tại",
        description: "Email này đã được thêm vào bảng",
        variant: "destructive",
      })
      return
    }

    // Trong ứng dụng thực tế, bạn sẽ gửi lời mời qua API
    toast({
      title: "Đã gửi lời mời",
      description: `Đã gửi lời mời đến ${email}`,
    })

    // Đặt lại form
    setEmail("")
  }

  // Lấy tên hiển thị cho vai trò
  const getRoleName = (role: "admin" | "editor" | "viewer") => {
    switch (role) {
      case "admin":
        return "Quản trị viên"
      case "editor":
        return "Biên tập viên"
      case "viewer":
        return "Người xem"
      default:
        return "Không xác định"
    }
  }

  // Lấy màu cho vai trò
  const getRoleColor = (role: "admin" | "editor" | "viewer") => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "editor":
        return "bg-blue-100 text-blue-800"
      case "viewer":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quản lý thành viên</DialogTitle>
          <DialogDescription>Quản lý thành viên trong bảng "{board.name}"</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Thêm thành viên mới */}
          <div className="space-y-2">
            <Label htmlFor="add-member">Thêm thành viên mới</Label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <UserPlus className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  id="add-member"
                  type="email"
                  placeholder="Nhập email thành viên"
                  className="pl-8"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button onClick={handleAddMember} disabled={!email}>
                Thêm
              </Button>
            </div>
          </div>

          {/* Tìm kiếm thành viên */}
          <div className="space-y-2">
            <Label htmlFor="search-members">Tìm kiếm thành viên</Label>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                id="search-members"
                placeholder="Tìm theo tên hoặc email"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Danh sách thành viên */}
          <div className="space-y-2">
            <Label>Thành viên ({board.members.length})</Label>
            <div className="max-h-[300px] overflow-y-auto space-y-2 border rounded-md p-2">
              {filteredMembers.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  {searchTerm ? "Không tìm thấy thành viên nào" : "Không có thành viên nào"}
                </p>
              ) : (
                filteredMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>{member.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(member.role)}`}>
                        {getRoleName(member.role)}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Đổi quyền
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onChangeRole(member.id, "admin")}>
                            <span className={member.role === "admin" ? "font-bold" : ""}>Quản trị viên</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onChangeRole(member.id, "editor")}>
                            <span className={member.role === "editor" ? "font-bold" : ""}>Biên tập viên</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onChangeRole(member.id, "viewer")}>
                            <span className={member.role === "viewer" ? "font-bold" : ""}>Người xem</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 h-8 w-8 p-0"
                        onClick={() => onRemoveMember(member.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
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
