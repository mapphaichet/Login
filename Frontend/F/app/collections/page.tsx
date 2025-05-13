"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FolderOpen, Plus, MoreHorizontal, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { CollectionBoardsModal } from "@/components/collection-boards-modal"

// Định nghĩa kiểu dữ liệu
type Board = {
  id: string
  name: string
  description: string
  totalTasks: number
  color: string
  collectionId: string
}

type Collection = {
  id: string
  name: string
  boardCount: number
  color: string
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>(collectionsData)
  const [boards, setBoards] = useState<Board[]>(boardsData)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Lọc collections theo từ khóa tìm kiếm
  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Xử lý khi click vào một collection
  const handleCollectionClick = (collection: Collection) => {
    setSelectedCollection(collection)
    setIsModalOpen(true)
  }

  // Lấy danh sách boards trong một collection
  const getBoardsInCollection = (collectionId: string) => {
    return boards.filter((board) => board.collectionId === collectionId)
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bộ sưu tập</h1>
          <p className="text-gray-500 mt-1">Tổ chức các bảng của bạn thành bộ sưu tập</p>
        </div>
        <Button className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Bộ sưu tập mới
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          placeholder="Tìm kiếm bộ sưu tập..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCollections.map((collection) => (
          <Card key={collection.id} className="overflow-hidden">
            <div className="h-2" style={{ backgroundColor: collection.color }} />
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start">
                  <div className="p-2 rounded-md mr-4" style={{ backgroundColor: `${collection.color}20` }}>
                    <FolderOpen className="h-6 w-6" style={{ color: collection.color }} />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{collection.name}</h3>
                    <p className="text-sm text-gray-500">{collection.boardCount} bảng</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" className="w-full" onClick={() => handleCollectionClick(collection)}>
                Xem bảng
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal hiển thị danh sách boards trong collection */}
      {selectedCollection && (
        <CollectionBoardsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          collection={selectedCollection}
          boards={getBoardsInCollection(selectedCollection.id)}
        />
      )}
    </div>
  )
}

// Dữ liệu mẫu
const collectionsData: Collection[] = [
  {
    id: "1",
    name: "Dự án Marketing",
    boardCount: 4,
    color: "#3b82f6",
  },
  {
    id: "2",
    name: "Công việc phát triển",
    boardCount: 6,
    color: "#10b981",
  },
  {
    id: "3",
    name: "Tài nguyên thiết kế",
    boardCount: 3,
    color: "#8b5cf6",
  },
  {
    id: "4",
    name: "Sáng tạo nội dung",
    boardCount: 2,
    color: "#f59e0b",
  },
  {
    id: "5",
    name: "Dự án khách hàng",
    boardCount: 5,
    color: "#ef4444",
  },
  {
    id: "6",
    name: "Quy trình nội bộ",
    boardCount: 3,
    color: "#10b981",
  },
]

const boardsData: Board[] = [
  {
    id: "1",
    name: "Thiết kế lại Website",
    description: "Thiết kế lại hoàn chỉnh website công ty với nhận diện thương hiệu mới",
    totalTasks: 12,
    color: "#3b82f6",
    collectionId: "2",
  },
  {
    id: "2",
    name: "Chiến dịch Marketing",
    description: "Chiến dịch marketing kỹ thuật số Q3 cho việc ra mắt sản phẩm mới",
    totalTasks: 8,
    color: "#10b981",
    collectionId: "1",
  },
  {
    id: "3",
    name: "Ra mắt sản phẩm",
    description: "Quy trình ra mắt sản phẩm đầy đủ bao gồm kiểm thử và phân phối",
    totalTasks: 15,
    color: "#8b5cf6",
    collectionId: "1",
  },
  {
    id: "4",
    name: "Phát triển ứng dụng di động",
    description: "Phát triển ứng dụng di động mới cho iOS và Android",
    totalTasks: 20,
    color: "#f59e0b",
    collectionId: "2",
  },
  {
    id: "5",
    name: "Quy trình khách hàng",
    description: "Tối ưu hóa quy trình tiếp nhận khách hàng",
    totalTasks: 10,
    color: "#ef4444",
    collectionId: "5",
  },
  {
    id: "6",
    name: "Thiết kế logo",
    description: "Tạo các biến thể logo mới cho thương hiệu",
    totalTasks: 5,
    color: "#8b5cf6",
    collectionId: "3",
  },
]
