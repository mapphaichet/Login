"use client"

import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Bell, Check } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ActivityDetailModal } from "@/components/activity-detail-modal"
import { Badge } from "@/components/ui/badge"
import type { Activity } from "@/types"

interface NotificationDropdownProps {
  activities: Activity[]
  onActivityUpdate: (updatedActivity: Activity) => void
  unreadCount: number
  onMarkAllAsRead: () => void
}

export function NotificationDropdown({
  activities,
  onActivityUpdate,
  unreadCount,
  onMarkAllAsRead,
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // Lấy 5 hoạt động gần nhất
  const recentActivities = activities.slice(0, 5)

  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity)
    setIsDetailModalOpen(true)
    setIsOpen(false)
  }

  const handleActivityUpdate = (updatedActivity: Activity) => {
    onActivityUpdate(updatedActivity)
  }

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end">
          <DropdownMenuLabel className="flex justify-between items-center">
            <span>Thông báo</span>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={onMarkAllAsRead}>
                <Check className="h-3 w-3 mr-1" />
                Đánh dấu tất cả đã đọc
              </Button>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
            {recentActivities.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">Không có thông báo nào</div>
            ) : (
              recentActivities.map((activity) => (
                <DropdownMenuItem
                  key={activity.id}
                  className={`p-3 cursor-pointer ${!activity.read ? "bg-blue-50" : ""}`}
                  onClick={() => handleActivityClick(activity)}
                >
                  <div className="flex items-start space-x-3 w-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                      <AvatarFallback>{activity.user.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">
                        <span className="font-medium">{activity.user.name}</span> {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="cursor-pointer">
            <a href="/notifications" className="w-full text-center text-sm text-primary">
              Xem tất cả thông báo
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ActivityDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        activity={selectedActivity}
        onActivityUpdate={handleActivityUpdate}
      />
    </>
  )
}
