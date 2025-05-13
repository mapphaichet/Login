"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LayoutGrid, Plus } from "lucide-react"
import Link from "next/link"
import { boardsData } from "./data"

export default function BoardsPage() {
  const [boards, setBoards] = useState(boardsData)

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bảng</h1>
          <p className="text-gray-500 mt-1">
            Tất cả các bảng trong không gian làm việc của bạn ({boards.length} tổng số)
          </p>
        </div>
        <Button className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Tạo bảng mới
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boards.map((board) => (
          <Card key={board.id} className="overflow-hidden">
            <div className="h-2" style={{ backgroundColor: board.color }} />
            <CardContent className="p-6">
              <div className="flex items-start mb-4">
                <div className="p-2 rounded-md mr-4" style={{ backgroundColor: `${board.color}20` }}>
                  <LayoutGrid className="h-6 w-6" style={{ color: board.color }} />
                </div>
                <div>
                  <h3 className="font-medium text-lg">{board.name}</h3>
                  <p className="text-sm text-gray-500">{board.totalTasks} công việc</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-6">{board.description}</p>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/board/${board.id}`}>Xem bảng</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
