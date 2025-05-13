"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle, Settings, Share, UserPlus, MoreHorizontal, Clock, MessageSquare, Paperclip } from "lucide-react"
import Link from "next/link"
import { ShareModal } from "@/components/share-modal"
import { AddCardModal } from "@/components/add-card-modal"
import { AddColumnModal } from "@/components/add-column-modal"
import { CardDetailModal } from "@/components/card-detail-modal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DragDropContext, Droppable, Draggable, type DropResult } from "react-beautiful-dnd"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

// Import boardsData
import { boardsData } from "../boards/data"

// Define boards variable
const boards = [
  {
    id: "board-1",
    name: "Bảng 1",
    color: "#3b82f6",
    members: 3,
    description: "Mô tả bảng 1",
    columns: [
      {
        id: "col-1",
        name: "Cần làm",
        cards: [
          {
            id: "card-1",
            title: "Công việc 1",
            labels: ["#3b82f6"],
            description: "Mô tả công việc 1",
          },
          {
            id: "card-2",
            title: "Công việc 2",
            labels: ["#10b981"],
            description: "Mô tả công việc 2",
          },
        ],
      },
      {
        id: "col-2",
        name: "Đang thực hiện",
        cards: [
          {
            id: "card-3",
            title: "Công việc 3",
            labels: ["#8b5cf6"],
            description: "Mô tả công việc 3",
          },
        ],
      },
      {
        id: "col-3",
        name: "Đã hoàn thành",
        cards: [],
      },
    ],
  },
  {
    id: "board-2",
    name: "Bảng 2",
    color: "#10b981",
    members: 5,
    description: "Mô tả bảng 2",
    columns: [
      {
        id: "col-4",
        name: "Cần làm",
        cards: [
          {
            id: "card-4",
            title: "Công việc 4",
            labels: ["#f59e0b"],
            description: "Mô tả công việc 4",
          },
          {
            id: "card-5",
            title: "Công việc 5",
            labels: ["#ef4444"],
            description: "Mô tả công việc 5",
          },
        ],
      },
      {
        id: "col-5",
        name: "Đang thực hiện",
        cards: [
          {
            id: "card-6",
            title: "Công việc 6",
            labels: ["#ec4899"],
            description: "Mô tả công việc 6",
          },
        ],
      },
      {
        id: "col-6",
        name: "Đã hoàn thành",
        cards: [],
      },
    ],
  },
]

// Định nghĩa kiểu dữ liệu
type CardType = {
  id: string
  title: string
  description?: string
  labels:
    | string[]
    | {
        id: string
        name: string
        color: string
      }[]
  dueDate?: Date
  members?: {
    id: string
    name: string
    avatar?: string
    initials: string
  }[]
  attachments?: { id: string; name: string; url: string; date: string }[] | number
  comments?: number
  isJoined?: boolean
}

type Column = {
  id: string
  name: string
  cards: CardType[]
}

type Board = {
  id: string
  name: string
  color: string
  members: number
  description: string
  columns: Column[]
}

type CardMember = {
  id: string
  name: string
  avatar?: string
  initials: string
  email?: string
}

type CardLabel = {
  id: string
  name: string
  color: string
}

type CardDetailType = {
  id: string
  title: string
  columnName: string
  description: string
  dueDate?: Date
  labels: CardLabel[]
  members: CardMember[]
  attachments: {
    id: string
    name: string
    url: string
    date: string
  }[]
  isJoined?: boolean
}

export default function BoardPage({ params }: { params: { id: string } }) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false)
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false)
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null)
  const [board, setBoard] = useState<Board | null>(null)
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null)
  const [columnName, setColumnName] = useState("")
  const [selectedCard, setSelectedCard] = useState<CardDetailType | null>(null)
  const [isCardDetailModalOpen, setIsCardDetailModalOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const columnNameInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Tìm dữ liệu bảng dựa trên ID
  useEffect(() => {
    // Trong ứng dụng thực tế, bạn sẽ gọi API để lấy dữ liệu bảng
    const foundBoard = boards.find((b) => b.id === params.id)

    // Tìm tên bảng từ boardsData nếu có
    const boardDataFromList = boardsData.find((b) => b.id === params.id)

    // Nếu không tìm thấy bảng cụ thể, tạo một bảng mặc định với ID đó
    if (!foundBoard) {
      const defaultBoard: Board = {
        id: params.id,
        name: boardDataFromList ? boardDataFromList.name : `Bảng ${params.id}`,
        color: boardDataFromList ? boardDataFromList.color : getRandomColor(),
        members: Math.floor(Math.random() * 5) + 1,
        description: boardDataFromList ? boardDataFromList.description : "Mô tả bảng này chưa được cập nhật",
        columns: [
          {
            id: "col-1",
            name: "Cần làm",
            cards: [
              {
                id: "card-1",
                title: "Công việc mẫu 1",
                labels: [getRandomColor()],
                description: "Mô tả công việc mẫu 1",
              },
              {
                id: "card-2",
                title: "Công việc mẫu 2",
                labels: [getRandomColor()],
                description: "Mô tả công việc mẫu 2",
              },
            ],
          },
          {
            id: "col-2",
            name: "Đang thực hiện",
            cards: [
              {
                id: "card-3",
                title: "Công việc mẫu 3",
                labels: [getRandomColor()],
                description: "Mô tả công việc mẫu 3",
              },
            ],
          },
          {
            id: "col-3",
            name: "Đã hoàn thành",
            cards: [],
          },
        ],
      }
      setBoard(defaultBoard)
    } else {
      setBoard(foundBoard)
    }
  }, [params.id])

  // Hàm tạo màu ngẫu nhiên
  function getRandomColor() {
    const colors = [
      "#3b82f6",
      "#10b981",
      "#8b5cf6",
      "#f59e0b",
      "#ef4444",
      "#ec4899",
      "#06b6d4",
      "#14b8a6",
      "#8b5cf6",
      "#f43f5e",
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  // Xử lý khi thêm thẻ mới
  const handleAddCard = (columnId: string) => {
    setActiveColumnId(columnId)
    setIsAddCardModalOpen(true)
  }

  // Xử lý khi thêm thẻ mới
  const handleCardAdded = (cardData: { title: string; description?: string }) => {
    if (!board || !activeColumnId) return

    const newCard: CardType = {
      id: `card-${Date.now()}`,
      title: cardData.title,
      description: cardData.description,
      labels: [],
    }

    const updatedColumns = board.columns.map((column) => {
      if (column.id === activeColumnId) {
        return {
          ...column,
          cards: [...column.cards, newCard],
        }
      }
      return column
    })

    setBoard({
      ...board,
      columns: updatedColumns,
    })

    setIsAddCardModalOpen(false)
  }

  // Xử lý khi thêm cột mới
  const handleColumnAdded = (columnData: { name: string }) => {
    if (!board) return

    const newColumn: Column = {
      id: `column-${Date.now()}`,
      name: columnData.name,
      cards: [],
    }

    setBoard({
      ...board,
      columns: [...board.columns, newColumn],
    })

    setIsAddColumnModalOpen(false)
  }

  // Xử lý khi bắt đầu chỉnh sửa tên cột
  const handleEditColumnName = (columnId: string, name: string) => {
    setEditingColumnId(columnId)
    setColumnName(name)
    setTimeout(() => {
      if (columnNameInputRef.current) {
        columnNameInputRef.current.focus()
        columnNameInputRef.current.select()
      }
    }, 0)
  }

  // Xử lý khi lưu tên cột mới
  const handleSaveColumnName = () => {
    if (!board || !editingColumnId || !columnName.trim()) {
      setEditingColumnId(null)
      return
    }

    const updatedColumns = board.columns.map((column) => {
      if (column.id === editingColumnId) {
        return {
          ...column,
          name: columnName,
        }
      }
      return column
    })

    setBoard({
      ...board,
      columns: updatedColumns,
    })

    setEditingColumnId(null)
  }

  // Xử lý khi click vào thẻ
  const handleCardClick = (columnId: string, card: CardType) => {
    // Nếu đang kéo thả, không mở modal
    if (isDragging) return

    // Format các thông tin của thẻ để phù hợp với CardDetailType
    const column = board?.columns.find((col) => col.id === columnId)

    if (!column) return

    // Convert labels from string[] to CardLabel[]
    let cardLabels: CardLabel[] = []
    if (Array.isArray(card.labels)) {
      if (typeof card.labels[0] === "string") {
        cardLabels = (card.labels as string[]).map((color, index) => ({
          id: `label-${index}`,
          name: getDefaultLabelName(index),
          color,
        }))
      } else {
        cardLabels = card.labels as CardLabel[]
      }
    }

    // Ensure members is an array
    const cardMembers = Array.isArray(card.members) ? card.members : []

    // Ensure attachments is an array of objects
    let cardAttachments = []
    if (card.attachments) {
      if (typeof card.attachments === "number") {
        cardAttachments = Array(card.attachments)
          .fill(0)
          .map((_, i) => ({
            id: `attachment-${i}`,
            name: `Tệp đính kèm ${i + 1}.jpg`,
            url: "/placeholder.svg",
            date: "10/05/2023",
          }))
      } else {
        cardAttachments = card.attachments
      }
    }

    const detailCard: CardDetailType = {
      id: card.id,
      title: card.title,
      columnName: column.name,
      description: card.description || "",
      dueDate: card.dueDate,
      labels: cardLabels,
      members: cardMembers,
      attachments: cardAttachments,
      isJoined: card.isJoined,
    }

    setSelectedCard(detailCard)
    setIsCardDetailModalOpen(true)
  }

  // Helper function to get default label names
  const getDefaultLabelName = (index: number): string => {
    const names = ["Ưu tiên cao", "Ưu tiên trung bình", "Ưu tiên thấp", "Đang chờ", "Cần giúp đỡ", "Đã xong"]
    return names[index % names.length]
  }

  // Handle card updates from the detail modal
  const handleCardUpdate = (updatedCard: CardDetailType) => {
    if (!board || !selectedCard) return

    const updatedColumns = board.columns.map((column) => {
      const cardIndex = column.cards.findIndex((card) => card.id === updatedCard.id)

      if (cardIndex >= 0) {
        // Update the card with new information
        const updatedCards = [...column.cards]
        updatedCards[cardIndex] = {
          ...updatedCards[cardIndex],
          title: updatedCard.title,
          description: updatedCard.description,
          dueDate: updatedCard.dueDate,
          labels: updatedCard.labels,
          members: updatedCard.members,
          attachments: updatedCard.attachments,
          isJoined: updatedCard.isJoined,
        }

        return {
          ...column,
          cards: updatedCards,
        }
      }

      return column
    })

    setBoard({
      ...board,
      columns: updatedColumns,
    })

    // Update the selected card
    setSelectedCard(updatedCard)

    // Trong ứng dụng thực tế, bạn sẽ gọi API để cập nhật thẻ
    // updateCard(updatedCard.id, updatedCard)
  }

  // Xử lý khi kéo thả kết thúc
  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false)

    const { source, destination, draggableId } = result

    // Nếu không có điểm đến hoặc điểm đến giống điểm đi, không làm gì cả
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return
    }

    if (!board) return

    // Tìm cột nguồn và cột đích
    const sourceColumn = board.columns.find((col) => col.id === source.droppableId)
    const destColumn = board.columns.find((col) => col.id === destination.droppableId)

    if (!sourceColumn || !destColumn) return

    // Tạo bản sao của các mảng thẻ
    const sourceCards = [...sourceColumn.cards]
    const destCards = sourceColumn.id === destColumn.id ? sourceCards : [...destColumn.cards]

    // Lấy thẻ được kéo
    const [movedCard] = sourceCards.splice(source.index, 1)

    // Thêm thẻ vào vị trí mới
    if (sourceColumn.id === destColumn.id) {
      // Nếu kéo trong cùng một cột
      sourceCards.splice(destination.index, 0, movedCard)
    } else {
      // Nếu kéo sang cột khác
      destCards.splice(destination.index, 0, movedCard)
    }

    // Cập nhật state
    const updatedColumns = board.columns.map((column) => {
      if (column.id === sourceColumn.id) {
        return {
          ...column,
          cards: sourceCards,
        }
      }
      if (column.id === destColumn.id && sourceColumn.id !== destColumn.id) {
        return {
          ...column,
          cards: destCards,
        }
      }
      return column
    })

    setBoard({
      ...board,
      columns: updatedColumns,
    })

    // Hiển thị thông báo
    toast({
      title: "Đã di chuyển thẻ",
      description: `Đã di chuyển "${movedCard.title}" từ "${sourceColumn.name}" sang "${destColumn.name}"`,
    })

    // Trong ứng dụng thực tế, bạn sẽ gọi API để cập nhật vị trí thẻ
    // moveCard(sourceColumn.id, destColumn.id, draggableId)
  }

  // Sample board members for the card detail modal
  const boardMembers: CardMember[] = [
    { id: "member-1", name: "Nguyễn Văn A", initials: "NA", email: "nguyenvana@example.com" },
    { id: "member-2", name: "Trần Thị B", initials: "TB", email: "tranthib@example.com" },
    { id: "member-3", name: "Lê Văn C", initials: "LC", email: "levanc@example.com" },
    { id: "member-4", name: "Phạm Thị D", initials: "PD", email: "phamthid@example.com" },
    { id: "member-5", name: "Hoàng Văn E", initials: "HE", email: "hoangvane@example.com" },
  ]

  if (!board) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Đang tải dữ liệu bảng...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{board.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{board.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2 mr-2">
            {[...Array(Math.min(board.members || 3, 3))].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs"
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
            {(board.members || 0) > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs">
                +{board.members - 3}
              </div>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsShareModalOpen(true)}>
            <Share className="h-4 w-4 mr-2" />
            Chia sẻ
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/add-member?boardId=${board.id}`}>
              <UserPlus className="h-4 w-4 mr-2" />
              Thêm thành viên
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/settings?boardId=${board.id}`}>
              <Settings className="h-4 w-4 mr-2" />
              Cài đặt
            </Link>
          </Button>
        </div>
      </div>

      <DragDropContext onDragStart={() => setIsDragging(true)} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-200px)]">
          {board.columns.map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="w-72 flex-shrink-0">
                  <Card className={`${snapshot.isDraggingOver ? "bg-gray-50" : ""}`}>
                    <div className="p-3 pb-2 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {editingColumnId === column.id ? (
                            <div className="flex items-center w-full">
                              <Input
                                ref={columnNameInputRef}
                                value={columnName}
                                onChange={(e) => setColumnName(e.target.value)}
                                onBlur={handleSaveColumnName}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleSaveColumnName()
                                  } else if (e.key === "Escape") {
                                    setEditingColumnId(null)
                                  }
                                }}
                                className="h-7 py-1"
                              />
                            </div>
                          ) : (
                            <>
                              <h3
                                className="font-medium cursor-pointer"
                                onClick={() => handleEditColumnName(column.id, column.name)}
                              >
                                {column.name}
                              </h3>
                              <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                                {column.cards.length}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleAddCard(column.id)}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-2">
                      <div className="space-y-2">
                        {column.cards.map((card, index) => (
                          <Draggable key={card.id} draggableId={card.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white p-3 rounded-md border shadow-sm cursor-pointer hover:shadow-md transition-shadow ${
                                  snapshot.isDragging ? "shadow-lg ring-2 ring-primary ring-opacity-50" : ""
                                }`}
                                onClick={() => handleCardClick(column.id, card)}
                              >
                                {/* Labels */}
                                {card.labels && card.labels.length > 0 && (
                                  <div className="flex gap-1 mb-2 flex-wrap">
                                    {Array.isArray(card.labels) && typeof card.labels[0] === "string"
                                      ? // If labels are just strings (colors)
                                        card.labels.map((label, index) => (
                                          <div
                                            key={index}
                                            className="h-2 w-10 rounded-full"
                                            style={{ backgroundColor: label as string }}
                                          />
                                        ))
                                      : // If labels are objects with id, name, color
                                        (card.labels as CardLabel[]).map((label) => (
                                          <Badge
                                            key={label.id}
                                            className="px-2 h-5 text-[10px]"
                                            style={{ backgroundColor: label.color, color: "#ffffff" }}
                                          >
                                            {label.name}
                                          </Badge>
                                        ))}
                                  </div>
                                )}

                                <div className="font-medium">{card.title}</div>
                                {card.description && (
                                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{card.description}</p>
                                )}

                                <div className="flex items-center justify-between mt-3 text-gray-500">
                                  <div className="flex items-center space-x-2 text-xs">
                                    {card.dueDate && (
                                      <div className="flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        <span>
                                          {card.dueDate instanceof Date
                                            ? format(card.dueDate, "dd/MM HH:mm", { locale: vi })
                                            : card.dueDate}
                                        </span>
                                      </div>
                                    )}
                                    {card.attachments && (
                                      <div className="flex items-center">
                                        <Paperclip className="h-3 w-3 mr-1" />
                                        <span>
                                          {typeof card.attachments === "number"
                                            ? card.attachments
                                            : card.attachments.length}
                                        </span>
                                      </div>
                                    )}
                                    {card.comments && card.comments > 0 && (
                                      <div className="flex items-center">
                                        <MessageSquare className="h-3 w-3 mr-1" />
                                        <span>{card.comments}</span>
                                      </div>
                                    )}
                                  </div>

                                  {card.members && card.members.length > 0 && (
                                    <div className="flex -space-x-1">
                                      {card.members.map((member) => (
                                        <Avatar key={member.id} className="h-6 w-6 border border-white">
                                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                          <AvatarFallback className="text-[10px]">{member.initials}</AvatarFallback>
                                        </Avatar>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full mt-2 justify-start text-muted-foreground"
                        onClick={() => handleAddCard(column.id)}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Thêm thẻ
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </Droppable>
          ))}
          <div className="w-72 flex-shrink-0">
            <Button
              variant="outline"
              className="w-full h-10 justify-start"
              onClick={() => setIsAddColumnModalOpen(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Thêm cột khác
            </Button>
          </div>
        </div>
      </DragDropContext>

      {/* Modal chia sẻ */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        boardName={board.name}
        boardId={board.id}
      />

      {/* Modal thêm thẻ */}
      <AddCardModal
        isOpen={isAddCardModalOpen}
        onClose={() => setIsAddCardModalOpen(false)}
        onAddCard={handleCardAdded}
        columnId={activeColumnId || ""}
      />

      {/* Modal thêm cột */}
      <AddColumnModal
        isOpen={isAddColumnModalOpen}
        onClose={() => setIsAddColumnModalOpen(false)}
        onAddColumn={handleColumnAdded}
      />

      {/* Modal chi tiết thẻ */}
      {selectedCard && (
        <CardDetailModal
          isOpen={isCardDetailModalOpen}
          onClose={() => setIsCardDetailModalOpen(false)}
          card={selectedCard}
          boardMembers={boardMembers}
          onUpdate={handleCardUpdate}
        />
      )}
    </div>
  )
}
