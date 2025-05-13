"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NotificationDropdown } from "@/components/notification-dropdown"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Activity } from "@/types"
import { useAuth } from "@/components/auth-provider"

// Định nghĩa kiểu dữ liệu
type SearchResult = {
  id: string
  name: string
  type: "board" | "collection"
  color: string
  description?: string
}

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [activities, setActivities] = useState<Activity[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { logout } = useAuth()

  // Dữ liệu mẫu cho tìm kiếm
  const boards = [
    {
      id: "1",
      name: "Thiết kế lại Website",
      type: "board" as const,
      color: "#3b82f6",
      description: "Thiết kế lại hoàn chỉnh website công ty",
    },
    {
      id: "2",
      name: "Chiến dịch Marketing",
      type: "board" as const,
      color: "#10b981",
      description: "Chiến dịch marketing Q3",
    },
    {
      id: "3",
      name: "Ra mắt sản phẩm",
      type: "board" as const,
      color: "#8b5cf6",
      description: "Quy trình ra mắt sản phẩm mới",
    },
    {
      id: "4",
      name: "Phát triển ứng dụng di động",
      type: "board" as const,
      color: "#f59e0b",
      description: "Ứng dụng iOS và Android",
    },
    {
      id: "5",
      name: "Quy trình khách hàng",
      type: "board" as const,
      color: "#ef4444",
      description: "Tối ưu hóa quy trình tiếp nhận",
    },
  ]

  const collections = [
    {
      id: "1",
      name: "Dự án Marketing",
      type: "collection" as const,
      color: "#3b82f6",
      description: "Các bảng liên quan đến marketing",
    },
    {
      id: "2",
      name: "Công việc phát triển",
      type: "collection" as const,
      color: "#10b981",
      description: "Các bảng phát triển sản phẩm",
    },
    {
      id: "3",
      name: "Tài nguyên thiết kế",
      type: "collection" as const,
      color: "#8b5cf6",
      description: "Các bảng thiết kế UI/UX",
    },
  ]

  // Tải dữ liệu hoạt động từ localStorage hoặc sử dụng dữ liệu mẫu
  useEffect(() => {
    const ACTIVITIES_STORAGE_KEY = "project_management_activities"
    const savedActivities = localStorage.getItem(ACTIVITIES_STORAGE_KEY)

    if (savedActivities) {
      try {
        const parsedActivities = JSON.parse(savedActivities)
        setActivities(parsedActivities)
      } catch (error) {
        console.error("Lỗi khi phân tích dữ liệu hoạt động từ localStorage:", error)
        setActivities(sampleActivities)
        localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(sampleActivities))
      }
    } else {
      setActivities(sampleActivities)
      localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(sampleActivities))
    }
  }, [])

  // Cập nhật số lượng thông báo chưa đọc
  useEffect(() => {
    const count = activities.filter((activity) => !activity.read).length
    setUnreadCount(count)
  }, [activities])

  // Lưu hoạt động vào localStorage khi có thay đổi
  useEffect(() => {
    localStorage.setItem("project_management_activities", JSON.stringify(activities))
  }, [activities])

  // Xử lý tìm kiếm
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([])
      return
    }

    const term = searchTerm.toLowerCase()

    // Tìm kiếm trong bảng
    const boardResults = boards.filter(
      (board) =>
        board.name.toLowerCase().includes(term) ||
        (board.description && board.description.toLowerCase().includes(term)),
    )

    // Tìm kiếm trong bộ sưu tập
    const collectionResults = collections.filter(
      (collection) =>
        collection.name.toLowerCase().includes(term) ||
        (collection.description && collection.description.toLowerCase().includes(term)),
    )

    // Kết hợp kết quả
    setSearchResults([...boardResults, ...collectionResults])
  }, [searchTerm])

  // Xử lý click bên ngoài để đóng kết quả tìm kiếm
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Xử lý khi click vào kết quả tìm kiếm
  const handleResultClick = (result: SearchResult) => {
    setIsSearchFocused(false)
    setSearchTerm("")

    if (result.type === "board") {
      router.push(`/board/${result.id}`)
    } else {
      router.push(`/collection/${result.id}`)
    }
  }

  // Xử lý cập nhật hoạt động
  const handleActivityUpdate = (updatedActivity: Activity) => {
    const updatedActivities = activities.map((activity) =>
      activity.id === updatedActivity.id ? updatedActivity : activity,
    )
    setActivities(updatedActivities)
  }

  // Đánh dấu tất cả thông báo đã đọc
  const handleMarkAllAsRead = () => {
    const updatedActivities = activities.map((activity) => ({
      ...activity,
      read: true,
    }))
    setActivities(updatedActivities)
  }

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center">
        <Link href="/" className="font-bold text-xl mr-8">
          Project Board
        </Link>

        <div className="relative w-64" ref={searchRef}>
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Tìm kiếm..."
            className="pl-8 h-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
          />

          {searchTerm && (
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Kết quả tìm kiếm */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-1 bg-white border rounded-md shadow-lg max-h-80 overflow-y-auto z-50">
              {searchResults.map((result) => (
                <div
                  key={`${result.type}-${result.id}`}
                  className="p-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: result.color }}></div>
                    <div>
                      <div className="font-medium">{result.name}</div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <span className="capitalize">{result.type === "board" ? "Bảng" : "Bộ sưu tập"}</span>
                        {result.description && <span className="ml-1">• {result.description}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isSearchFocused && searchTerm && searchResults.length === 0 && (
            <div className="absolute top-full left-0 w-full mt-1 bg-white border rounded-md shadow-lg p-4 text-center text-gray-500 z-50">
              Không tìm thấy kết quả nào
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <NotificationDropdown
          activities={activities}
          onActivityUpdate={handleActivityUpdate}
          unreadCount={unreadCount}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
        <button onClick={logout} className="ml-4 px-3 py-1 text-sm text-gray-700 hover:text-gray-900">
          Logout
        </button>

        <Avatar>
          <AvatarImage src="/placeholder.svg" alt="User" />
          <AvatarFallback>NA</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}

// Dữ liệu mẫu cho hoạt động
const sampleActivities: Activity[] = [
  {
    id: "1",
    user: {
      name: "Nguyễn Văn A",
      initials: "NA",
    },
    action: 'đã thêm thẻ "Thiết kế logo" vào bảng "Dự án phát triển website"',
    time: "30 phút trước",
    boardId: "1",
    boardName: "Dự án phát triển website",
    read: false,
    type: "card",
    timestamp: Date.now() - 30 * 60 * 1000,
    comments: [],
    liked: false,
  },
  {
    id: "2",
    user: {
      name: "Trần Thị B",
      initials: "TB",
    },
    action: 'đã di chuyển thẻ "Viết nội dung" sang cột "Đang thực hiện"',
    time: "2 giờ trước",
    boardId: "1",
    boardName: "Dự án phát triển website",
    read: false,
    type: "card",
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    comments: [],
    liked: false,
  },
  {
    id: "3",
    user: {
      name: "Lê Văn C",
      initials: "LC",
    },
    action: 'đã thêm bình luận vào thẻ "Phân tích đối thủ"',
    time: "5 giờ trước",
    boardId: "1",
    boardName: "Dự án phát triển website",
    read: true,
    type: "comment",
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
    comments: [],
    liked: false,
  },
  {
    id: "4",
    user: {
      name: "Phạm Thị D",
      initials: "PD",
    },
    action: 'đã thêm bạn vào bảng "Kế hoạch marketing Q2"',
    time: "1 ngày trước",
    boardId: "2",
    boardName: "Kế hoạch marketing Q2",
    read: true,
    type: "member",
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    comments: [],
    liked: false,
  },
  {
    id: "5",
    user: {
      name: "Hoàng Văn E",
      initials: "HE",
    },
    action: 'đã gán bạn vào thẻ "Thiết kế banner"',
    time: "2 ngày trước",
    boardId: "3",
    boardName: "Thiết kế UI/UX",
    read: true,
    type: "card",
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    comments: [],
    liked: false,
  },
]
