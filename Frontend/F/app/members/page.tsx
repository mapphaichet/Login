"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, ChevronDown, ChevronRight, LayoutGrid } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

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

export default function MembersPage() {
  const [expandedBoard, setExpandedBoard] = useState<string | null>(null)
  const [boards, setBoards] = useState<Board[]>(boardsData)
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false)
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null)
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const { toast } = useToast()

  // Xử lý khi click vào một bảng
  const handleBoardClick = (boardId: string) => {
    if (expandedBoard === boardId) {
      setExpandedBoard(null)
    } else {
      setExpandedBoard(boardId)
    }
  }

  // Xử lý khi xóa thành viên
  const handleRemoveMember = (boardId: string, memberId: string) => {
    // Cập nhật danh sách bảng
    const updatedBoards = boards.map((board) => {
      if (board.id === boardId) {
        return {
          ...board,
          members: board.members.filter((member) => member.id !== memberId),
        }
      }
      return board
    })

    setBoards(updatedBoards)

    // Hiển thị thông báo
    toast({
      title: "Đã xóa thành viên",
      description: "Thành viên đã được xóa khỏi bảng",
    })
  }

  // Xử lý khi thay đổi quyền truy cập
  const handleChangeRole = (boardId: string, memberId: string, newRole: "admin" | "editor" | "viewer") => {
    // Cập nhật danh sách bảng
    const updatedBoards = boards.map((board) => {
      if (board.id === boardId) {
        return {
          ...board,
          members: board.members.map((member) => {
            if (member.id === memberId) {
              return { ...member, role: newRole }
            }
            return member
          }),
        }
      }
      return board
    })

    setBoards(updatedBoards)

    // Hiển thị thông báo
    toast({
      title: "Đã cập nhật quyền truy cập",
      description: "Quyền truy cập của thành viên đã được cập nhật",
    })
  }

  // Mở modal thêm thành viên
  const openAddMemberModal = (boardId: string) => {
    setSelectedBoardId(boardId)
    setNewMemberEmail("")
    setIsAddMemberModalOpen(true)
  }

  // Xử lý thêm thành viên mới
  const handleAddMember = () => {
    if (!selectedBoardId || !newMemberEmail.trim()) return

    // Kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newMemberEmail)) {
      toast({
        title: "Email không hợp lệ",
        description: "Vui lòng nhập một địa chỉ email hợp lệ",
        variant: "destructive",
      })
      return
    }

    // Kiểm tra email đã tồn tại chưa
    const board = boards.find((b) => b.id === selectedBoardId)
    if (board && board.members.some((m) => m.email === newMemberEmail)) {
      toast({
        title: "Thành viên đã tồn tại",
        description: "Email này đã được thêm vào bảng",
        variant: "destructive",
      })
      return
    }

    // Tạo thành viên mới
    const newMember: Member = {
      id: `member-${Date.now()}`,
      name: newMemberEmail.split("@")[0],
      email: newMemberEmail,
      initials: newMemberEmail.substring(0, 2).toUpperCase(),
      role: "viewer",
    }

    // Cập nhật danh sách bảng
    const updatedBoards = boards.map((board) => {
      if (board.id === selectedBoardId) {
        return {
          ...board,
          members: [...board.members, newMember],
        }
      }
      return board
    })

    setBoards(updatedBoards)
    setIsAddMemberModalOpen(false)

    // Hiển thị thông báo
    toast({
      title: "Đã thêm thành viên",
      description: `${newMemberEmail} đã được thêm vào bảng`,
    })
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Quản lý thành viên</h1>
        <p className="text-gray-500 mt-1">Quản lý thành viên trong các bảng của bạn</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thành viên theo bảng</CardTitle>
          <CardDescription>Quản lý thành viên trong từng bảng của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {boards.map((board) => (
              <div key={board.id} className="border rounded-md overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleBoardClick(board.id)}
                >
                  <div className="flex items-center">
                    {expandedBoard === board.id ? (
                      <ChevronDown className="h-5 w-5 mr-2 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 mr-2 text-gray-500" />
                    )}
                    <div
                      className="w-10 h-10 rounded mr-3 flex items-center justify-center"
                      style={{ backgroundColor: board.color }}
                    >
                      <LayoutGrid className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{board.name}</div>
                      <div className="text-sm text-gray-500">{board.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex -space-x-2 mr-4">
                      {board.members.slice(0, 3).map((member) => (
                        <Avatar key={member.id} className="h-8 w-8 border-2 border-white">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>{member.initials}</AvatarFallback>
                        </Avatar>
                      ))}
                      {board.members.length > 3 && (
                        <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs">
                          +{board.members.length - 3}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        openAddMemberModal(board.id)
                      }}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Quản lý ({board.members.length})
                    </Button>
                  </div>
                </div>

                {expandedBoard === board.id && (
                  <div className="p-4 bg-gray-50 border-t">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Thành viên trong bảng
                      </h3>
                      <Button variant="outline" size="sm" onClick={() => openAddMemberModal(board.id)}>
                        Thêm thành viên
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {board.members.length === 0 ? (
                        <p className="text-sm text-gray-500">Không có thành viên nào trong bảng này</p>
                      ) : (
                        board.members.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-2 hover:bg-white rounded-md"
                          >
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
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  member.role === "admin"
                                    ? "bg-purple-100 text-purple-800"
                                    : member.role === "editor"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {member.role === "admin"
                                  ? "Quản trị viên"
                                  : member.role === "editor"
                                    ? "Biên tập viên"
                                    : "Người xem"}
                              </span>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    Đổi quyền
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleChangeRole(board.id, member.id, "admin")}>
                                    <span className={member.role === "admin" ? "font-bold" : ""}>Quản trị viên</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleChangeRole(board.id, member.id, "editor")}>
                                    <span className={member.role === "editor" ? "font-bold" : ""}>Biên tập viên</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleChangeRole(board.id, member.id, "viewer")}>
                                    <span className={member.role === "viewer" ? "font-bold" : ""}>Người xem</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500"
                                onClick={() => handleRemoveMember(board.id, member.id)}
                              >
                                Xóa
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal thêm thành viên */}
      <Dialog open={isAddMemberModalOpen} onOpenChange={setIsAddMemberModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm thành viên mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Địa chỉ email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
              />
            </div>
            <p className="text-sm text-gray-500">
              Người dùng sẽ nhận được email mời tham gia vào bảng với quyền "Người xem".
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMemberModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddMember} disabled={!newMemberEmail.trim()}>
              Thêm thành viên
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Dữ liệu mẫu - Đảm bảo có đủ 23 bảng để khớp với thống kê
const boardsData: Board[] = [
  {
    id: "1",
    name: "Thiết kế lại Website",
    color: "#3b82f6",
    description: "Thiết kế lại hoàn chỉnh website công ty với nhận diện thương hiệu mới",
    members: [
      {
        id: "1",
        name: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        initials: "NA",
        role: "admin",
      },
      {
        id: "2",
        name: "Trần Thị B",
        email: "tranthib@example.com",
        initials: "TB",
        role: "editor",
      },
      {
        id: "3",
        name: "Lê Văn C",
        email: "levanc@example.com",
        initials: "LC",
        role: "viewer",
      },
      {
        id: "4",
        name: "Phạm Thị D",
        email: "phamthid@example.com",
        initials: "PD",
        role: "editor",
      },
    ],
  },
  {
    id: "2",
    name: "Chiến dịch Marketing",
    color: "#10b981",
    description: "Chiến dịch marketing kỹ thuật số Q3 cho việc ra mắt sản phẩm mới",
    members: [
      {
        id: "1",
        name: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        initials: "NA",
        role: "admin",
      },
      {
        id: "5",
        name: "Hoàng Văn E",
        email: "hoangvane@example.com",
        initials: "HE",
        role: "editor",
      },
      {
        id: "6",
        name: "Nguyễn Thị F",
        email: "nguyenthif@example.com",
        initials: "NF",
        role: "viewer",
      },
    ],
  },
  {
    id: "3",
    name: "Ra mắt sản phẩm",
    color: "#8b5cf6",
    description: "Quy trình ra mắt sản phẩm đầy đủ bao gồm kiểm thử và phân phối",
    members: [
      {
        id: "2",
        name: "Trần Thị B",
        email: "tranthib@example.com",
        initials: "TB",
        role: "admin",
      },
      {
        id: "7",
        name: "Trần Văn G",
        email: "tranvang@example.com",
        initials: "TG",
        role: "editor",
      },
      {
        id: "8",
        name: "Lê Thị H",
        email: "lethih@example.com",
        initials: "LH",
        role: "editor",
      },
    ],
  },
  {
    id: "4",
    name: "Phát triển ứng dụng di động",
    color: "#f59e0b",
    description: "Phát triển ứng dụng di động mới cho iOS và Android",
    members: [
      {
        id: "3",
        name: "Lê Văn C",
        email: "levanc@example.com",
        initials: "LC",
        role: "admin",
      },
      {
        id: "9",
        name: "Phạm Văn I",
        email: "phamvani@example.com",
        initials: "PI",
        role: "editor",
      },
    ],
  },
  {
    id: "5",
    name: "Quy trình khách hàng",
    color: "#ef4444",
    description: "Tối ưu hóa quy trình tiếp nhận khách hàng",
    members: [
      {
        id: "4",
        name: "Phạm Thị D",
        email: "phamthid@example.com",
        initials: "PD",
        role: "admin",
      },
      {
        id: "10",
        name: "Nguyễn Văn J",
        email: "nguyenvanj@example.com",
        initials: "NJ",
        role: "viewer",
      },
    ],
  },
  // Thêm các bảng khác để đủ 23 bảng
  {
    id: "6",
    name: "Thiết kế UI/UX",
    color: "#8b5cf6",
    description: "Thiết kế giao diện người dùng cho ứng dụng mới",
    members: [
      {
        id: "2",
        name: "Trần Thị B",
        email: "tranthib@example.com",
        initials: "TB",
        role: "admin",
      },
    ],
  },
  {
    id: "7",
    name: "Nghiên cứu thị trường",
    color: "#3b82f6",
    description: "Phân tích thị trường và đối thủ cạnh tranh",
    members: [
      {
        id: "5",
        name: "Hoàng Văn E",
        email: "hoangvane@example.com",
        initials: "HE",
        role: "admin",
      },
    ],
  },
  {
    id: "8",
    name: "Phát triển nội dung",
    color: "#f59e0b",
    description: "Tạo nội dung cho website và mạng xã hội",
    members: [
      {
        id: "6",
        name: "Nguyễn Thị F",
        email: "nguyenthif@example.com",
        initials: "NF",
        role: "admin",
      },
    ],
  },
  {
    id: "9",
    name: "Tối ưu hóa SEO",
    color: "#10b981",
    description: "Cải thiện thứ hạng tìm kiếm cho website",
    members: [
      {
        id: "7",
        name: "Trần Văn G",
        email: "tranvang@example.com",
        initials: "TG",
        role: "admin",
      },
    ],
  },
  {
    id: "10",
    name: "Quản lý sự kiện",
    color: "#ef4444",
    description: "Lập kế hoạch và tổ chức sự kiện ra mắt sản phẩm",
    members: [
      {
        id: "8",
        name: "Lê Thị H",
        email: "lethih@example.com",
        initials: "LH",
        role: "admin",
      },
    ],
  },
  {
    id: "11",
    name: "Phát triển backend",
    color: "#3b82f6",
    description: "Xây dựng API và cơ sở dữ liệu cho ứng dụng",
    members: [
      {
        id: "9",
        name: "Phạm Văn I",
        email: "phamvani@example.com",
        initials: "PI",
        role: "admin",
      },
    ],
  },
  {
    id: "12",
    name: "Kiểm thử phần mềm",
    color: "#8b5cf6",
    description: "Kiểm tra chất lượng và sửa lỗi cho ứng dụng",
    members: [
      {
        id: "10",
        name: "Nguyễn Văn J",
        email: "nguyenvanj@example.com",
        initials: "NJ",
        role: "admin",
      },
    ],
  },
  {
    id: "13",
    name: "Thiết kế logo",
    color: "#f59e0b",
    description: "Tạo logo mới cho thương hiệu",
    members: [
      {
        id: "2",
        name: "Trần Thị B",
        email: "tranthib@example.com",
        initials: "TB",
        role: "admin",
      },
    ],
  },
  {
    id: "14",
    name: "Chiến lược mạng xã hội",
    color: "#10b981",
    description: "Phát triển kế hoạch tiếp thị trên các nền tảng mạng xã hội",
    members: [
      {
        id: "6",
        name: "Nguyễn Thị F",
        email: "nguyenthif@example.com",
        initials: "NF",
        role: "admin",
      },
    ],
  },
  {
    id: "15",
    name: "Phân tích dữ liệu",
    color: "#3b82f6",
    description: "Thu thập và phân tích dữ liệu người dùng",
    members: [
      {
        id: "9",
        name: "Phạm Văn I",
        email: "phamvani@example.com",
        initials: "PI",
        role: "admin",
      },
    ],
  },
  {
    id: "16",
    name: "Tối ưu hóa hiệu suất",
    color: "#ef4444",
    description: "Cải thiện tốc độ và hiệu suất của ứng dụng",
    members: [
      {
        id: "3",
        name: "Lê Văn C",
        email: "levanc@example.com",
        initials: "LC",
        role: "admin",
      },
    ],
  },
  {
    id: "17",
    name: "Quản lý khách hàng",
    color: "#8b5cf6",
    description: "Theo dõi và quản lý mối quan hệ với khách hàng",
    members: [
      {
        id: "4",
        name: "Phạm Thị D",
        email: "phamthid@example.com",
        initials: "PD",
        role: "admin",
      },
    ],
  },
  {
    id: "18",
    name: "Phát triển sản phẩm",
    color: "#f59e0b",
    description: "Lập kế hoạch và phát triển tính năng mới cho sản phẩm",
    members: [
      {
        id: "1",
        name: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        initials: "NA",
        role: "admin",
      },
    ],
  },
  {
    id: "19",
    name: "Quản lý nhân sự",
    color: "#10b981",
    description: "Tuyển dụng và quản lý nhân viên mới",
    members: [
      {
        id: "5",
        name: "Hoàng Văn E",
        email: "hoangvane@example.com",
        initials: "HE",
        role: "admin",
      },
    ],
  },
  {
    id: "20",
    name: "Kế hoạch tài chính",
    color: "#3b82f6",
    description: "Lập ngân sách và dự báo tài chính",
    members: [
      {
        id: "7",
        name: "Trần Văn G",
        email: "tranvang@example.com",
        initials: "TG",
        role: "admin",
      },
    ],
  },
  {
    id: "21",
    name: "Đào tạo nhân viên",
    color: "#ef4444",
    description: "Phát triển chương trình đào tạo cho nhân viên mới",
    members: [
      {
        id: "8",
        name: "Lê Thị H",
        email: "lethih@example.com",
        initials: "LH",
        role: "admin",
      },
    ],
  },
  {
    id: "22",
    name: "Báo cáo hiệu suất",
    color: "#8b5cf6",
    description: "Tạo báo cáo về hiệu suất dự án và nhóm",
    members: [
      {
        id: "10",
        name: "Nguyễn Văn J",
        email: "nguyenvanj@example.com",
        initials: "NJ",
        role: "admin",
      },
    ],
  },
  {
    id: "23",
    name: "Quản lý tài liệu",
    color: "#10b981",
    description: "Tổ chức và quản lý tài liệu dự án",
    members: [
      {
        id: "6",
        name: "Nguyễn Thị F",
        email: "nguyenthif@example.com",
        initials: "NF",
        role: "admin",
      },
    ],
  },
]
