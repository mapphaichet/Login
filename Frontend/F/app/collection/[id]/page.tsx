"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle, Share, UserMinus, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ShareModal } from "@/components/share-modal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { boardsData } from "@/app/boards/data"

export default function CollectionDetailPage({ params }: { params: { id: string } }) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [members, setMembers] = useState<typeof collectionMembers>([...collectionMembers])
  const { toast } = useToast()

  // In a real app, you would fetch the collection data based on the ID
  const collectionId = params.id

  // Find the collection data based on ID
  const collection = collections.find((c) => c.id === collectionId) || {
    id: collectionId,
    name: "Bộ sưu tập không tồn tại",
    description: "Không tìm thấy bộ sưu tập này",
    color: "#ccc",
    icon: "?",
    boardCount: 0,
    updatedAt: "",
  }

  // Lấy danh sách bảng từ boardsData dựa trên collection.boardCount
  const collectionBoards = boardsData.slice(0, collection.boardCount).map((board) => ({
    id: board.id,
    name: board.name,
    background: "/placeholder.svg?height=150&width=300&text=" + encodeURIComponent(board.name),
    color: board.color,
    updatedAt: "Hôm nay, 10:30",
    collectionId: collectionId,
  }))

  // Xử lý xóa thành viên
  const handleRemoveMember = (memberId: string) => {
    // Lọc ra thành viên cần xóa
    const updatedMembers = members.filter((member) => member.id !== memberId)
    setMembers(updatedMembers)

    // Hiển thị thông báo
    toast({
      title: "Đã xóa thành viên",
      description: "Thành viên đã được xóa khỏi bộ sưu tập",
    })
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div
            className="w-10 h-10 rounded mr-3 flex items-center justify-center text-white"
            style={{ backgroundColor: collection.color }}
          >
            {collection.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{collection.name}</h1>
            <p className="text-sm text-muted-foreground">{collection.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsShareModalOpen(true)}>
            <Share className="h-4 w-4 mr-2" />
            Chia sẻ
          </Button>
          <Button variant="outline" size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Thêm bảng mới
          </Button>
        </div>
      </div>

      {/* Hiển thị thành viên */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Thành viên ({members.length})
            </h2>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/add-member?collectionId=${collectionId}`}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Thêm thành viên
              </Link>
            </Button>
          </div>
          <div className="space-y-2">
            {members.map((member) => (
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      •••
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Tùy chọn</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleRemoveMember(member.id)}>
                      <UserMinus className="h-4 w-4 mr-2 text-red-500" />
                      <span className="text-red-500">Xóa khỏi bộ sưu tập</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mt-6">Bảng trong bộ sưu tập</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {collectionBoards.map((board) => (
          <Link key={board.id} href={`/board/${board.id}`} className="group">
            <Card className="overflow-hidden h-full border hover:border-primary transition-colors">
              <div className="aspect-video w-full relative">
                <Image
                  src={board.background || "/placeholder.svg?height=150&width=300"}
                  alt={board.name}
                  width={300}
                  height={150}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium truncate">{board.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">Cập nhật {board.updatedAt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}

        <Link href={`/create-board?collection=${collectionId}`}>
          <Card className="h-full border border-dashed hover:border-primary transition-colors flex flex-col items-center justify-center p-6 text-center">
            <PlusCircle className="h-8 w-8 mb-2 text-muted-foreground" />
            <h3 className="font-medium">Tạo bảng mới</h3>
            <p className="text-sm text-muted-foreground mt-1">Thêm một bảng mới vào bộ sưu tập này</p>
          </Card>
        </Link>
      </div>

      {collectionBoards.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Chưa có bảng nào trong bộ sưu tập này</h3>
          <p className="text-muted-foreground mb-6">Hãy tạo bảng đầu tiên cho bộ sưu tập của bạn</p>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Tạo bảng mới
          </Button>
        </div>
      )}

      {/* Modal chia sẻ */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        boardName={collection.name}
        boardId={collectionId}
      />
    </div>
  )
}

// Add this at the end of the file
const collections = [
  {
    id: "1",
    name: "Marketing",
    description: "Các bảng liên quan đến hoạt động marketing",
    color: "#eb5a46",
    icon: "M",
    boardCount: 5,
    updatedAt: "hôm qua",
  },
  {
    id: "2",
    name: "Phát triển sản phẩm",
    description: "Quản lý quy trình phát triển sản phẩm",
    color: "#0079bf",
    icon: "P",
    boardCount: 3,
    updatedAt: "2 ngày trước",
  },
  {
    id: "3",
    name: "Thiết kế",
    description: "Các dự án thiết kế UI/UX",
    color: "#61bd4f",
    icon: "T",
    boardCount: 4,
    updatedAt: "hôm nay",
  },
]

// Thành viên của bộ sưu tập
const collectionMembers = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    initials: "NA",
    avatar: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "tranthib@example.com",
    initials: "TB",
    avatar: "/placeholder.svg",
  },
  {
    id: "3",
    name: "Lê Văn C",
    email: "levanc@example.com",
    initials: "LC",
    avatar: "/placeholder.svg",
  },
  {
    id: "4",
    name: "Phạm Thị D",
    email: "phamthid@example.com",
    initials: "PD",
    avatar: "/placeholder.svg",
  },
]
