"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LayoutGrid, Plus } from "lucide-react"
import Link from "next/link"
import { boardsData } from "@/app/boards/data"

// Định nghĩa kiểu dữ liệu
type Collection = {
  id: string
  name: string
  boardCount: number
  color: string
}

interface CollectionBoardsModalProps {
  isOpen: boolean
  onClose: () => void
  collection: Collection
  boards: any[] // Sử dụng kiểu dữ liệu từ boardsData
}

export function CollectionBoardsModal({ isOpen, onClose, collection, boards }: CollectionBoardsModalProps) {
  // Lấy danh sách bảng từ boardsData dựa trên collection.boardCount
  const collectionBoards = boardsData.slice(0, collection.boardCount).map((board) => ({
    ...board,
    collectionId: collection.id,
  }))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <div className="w-6 h-6 rounded mr-2" style={{ backgroundColor: collection.color }} />
            <span>{collection.name}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Bảng trong bộ sưu tập này ({collectionBoards.length})</h3>
            <Button size="sm" asChild>
              <Link href={`/create-board?collectionId=${collection.id}`}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm bảng
              </Link>
            </Button>
          </div>

          {collectionBoards.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Chưa có bảng nào trong bộ sưu tập này</p>
              <Button asChild>
                <Link href={`/create-board?collectionId=${collection.id}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo bảng
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {collectionBoards.map((board) => (
                <div key={board.id} className="border rounded-md p-4 hover:border-gray-300 transition-colors">
                  <div className="flex items-start">
                    <div className="p-2 rounded-md mr-4" style={{ backgroundColor: `${board.color}20` }}>
                      <LayoutGrid className="h-5 w-5" style={{ color: board.color }} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{board.name}</h4>
                      <p className="text-sm text-gray-500">{board.totalTasks} công việc</p>
                      <p className="text-sm text-gray-700 mt-1">{board.description}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/board/${board.id}`}>Xem bảng</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
