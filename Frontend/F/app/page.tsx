"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LayoutGrid, Users, FolderOpen, Clock } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ActivityDetailModal } from "@/components/activity-detail-modal"
import { useAuth } from "@/components/auth-provider"
import type { Activity, Project } from "@/types"

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalBoards: 23,
    teamMembers: 12,
    collections: 6,
    recentActivities: 24,
  })

  const [projects, setProjects] = useState<Project[]>(recentProjects)
  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Load activities from localStorage or use sample data
  useEffect(() => {
    if (!isAuthenticated) return

    const ACTIVITIES_STORAGE_KEY = "project_management_activities"
    const savedActivities = localStorage.getItem(ACTIVITIES_STORAGE_KEY)

    if (savedActivities) {
      try {
        const parsedActivities = JSON.parse(savedActivities)
        setActivities(parsedActivities)
      } catch (error) {
        console.error("Error parsing activities data from localStorage:", error)
        setActivities(teamActivities)
        localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(teamActivities))
      }
    } else {
      setActivities(teamActivities)
      localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(teamActivities))
    }
  }, [isAuthenticated])

  // Save activities to localStorage when they change
  useEffect(() => {
    if (activities.length > 0) {
      localStorage.setItem("project_management_activities", JSON.stringify(activities))
    }
  }, [activities])

  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity)
    setIsActivityModalOpen(true)
  }

  const handleActivityUpdate = (updatedActivity: Activity) => {
    const updatedActivities = activities.map((activity) =>
      activity.id === updatedActivity.id ? updatedActivity : activity,
    )
    setActivities(updatedActivities)
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Bảng điều khiển</h1>
        <p className="text-gray-500 mt-1">Chào mừng bạn quay trở lại bảng điều khiển công việc.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Tổng số bảng</p>
                <h3 className="text-3xl font-bold mt-1">{stats.totalBoards}</h3>
              </div>
              <div className="bg-blue-100 p-2 rounded-md">
                <LayoutGrid className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Thành viên</p>
                <h3 className="text-3xl font-bold mt-1">{stats.teamMembers}</h3>
              </div>
              <div className="bg-green-100 p-2 rounded-md">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Bộ sưu tập</p>
                <h3 className="text-3xl font-bold mt-1">{stats.collections}</h3>
              </div>
              <div className="bg-purple-100 p-2 rounded-md">
                <FolderOpen className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Hoạt động gần đây</p>
                <h3 className="text-3xl font-bold mt-1">{stats.recentActivities}</h3>
              </div>
              <div className="bg-amber-100 p-2 rounded-md">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Dự án gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {projects.map((project) => (
              <div key={project.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{project.name}</h3>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/board/${project.id}`}>Xem bảng</Link>
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  {project.completedTasks} trên {project.totalTasks} công việc đã hoàn thành
                </p>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(project.completedTasks / project.totalTasks) * 100}%`,
                      backgroundColor: project.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Activity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Hoạt động nhóm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.slice(0, 4).map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                onClick={() => handleActivityClick(activity)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{activity.user.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{activity.user.name}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" asChild>
              <Link href="/notifications">Xem tất cả hoạt động</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity Detail Modal */}
      <ActivityDetailModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        activity={selectedActivity}
        onActivityUpdate={handleActivityUpdate}
      />
    </div>
  )
}

// Sample data
const recentProjects: Project[] = [
  {
    id: "1",
    name: "Thiết kế lại Website",
    totalTasks: 12,
    completedTasks: 5,
    color: "#3b82f6",
  },
  {
    id: "2",
    name: "Chiến dịch Marketing",
    totalTasks: 8,
    completedTasks: 3,
    color: "#10b981",
  },
  {
    id: "3",
    name: "Ra mắt sản phẩm",
    totalTasks: 15,
    completedTasks: 15,
    color: "#8b5cf6",
  },
]

const teamActivities: Activity[] = [
  {
    id: "1",
    user: {
      name: "Alex",
      initials: "A",
    },
    action: 'đã hoàn thành "Thiết kế Logo"',
    time: "2 giờ trước",
    boardId: "1",
    boardName: "Thiết kế lại Website",
    comments: [],
    liked: false,
    read: true,
  },
  {
    id: "2",
    user: {
      name: "Sarah",
      initials: "S",
    },
    action: 'đã thêm công việc mới "Tạo wireframes"',
    time: "3 giờ trước",
    boardId: "1",
    boardName: "Thiết kế lại Website",
    comments: [],
    liked: false,
    read: true,
  },
  {
    id: "3",
    user: {
      name: "Michael",
      initials: "M",
    },
    action: 'đã bình luận về "Nghiên cứu người dùng"',
    time: "5 giờ trước",
    boardId: "2",
    boardName: "Chiến dịch Marketing",
    comments: [
      {
        id: "comment-1",
        user: {
          name: "Michael",
          initials: "M",
        },
        text: "Chúng ta nên tập trung vào nhóm người dùng 18-35 tuổi",
        time: "5 giờ trước",
      },
    ],
    liked: true,
    read: true,
  },
  {
    id: "4",
    user: {
      name: "Jessica",
      initials: "J",
    },
    action: 'đã chuyển "Viết nội dung" sang Đang thực hiện',
    time: "Hôm qua",
    boardId: "3",
    boardName: "Ra mắt sản phẩm",
    comments: [],
    liked: false,
    read: true,
  },
]
