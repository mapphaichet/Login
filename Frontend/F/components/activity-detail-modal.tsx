"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageSquare, ThumbsUp, Pencil, Trash2, X, Check } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import type { Activity, Comment } from "@/types"

interface ActivityDetailModalProps {
  isOpen: boolean
  onClose: () => void
  activity: Activity | null
  onActivityUpdate: (updatedActivity: Activity) => void
}

export function ActivityDetailModal({ isOpen, onClose, activity, onActivityUpdate }: ActivityDetailModalProps) {
  const [commentText, setCommentText] = useState("")
  const [localActivity, setLocalActivity] = useState<Activity | null>(null)
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editCommentText, setEditCommentText] = useState("")
  const editInputRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

  // Cập nhật localActivity khi activity thay đổi
  useEffect(() => {
    if (activity) {
      setLocalActivity({ ...activity })
    } else {
      setLocalActivity(null)
    }
  }, [activity])

  // Focus vào input khi bắt đầu chỉnh sửa
  useEffect(() => {
    if (editingCommentId && editInputRef.current) {
      editInputRef.current.focus()
    }
  }, [editingCommentId])

  if (!localActivity) return null

  // Hàm xử lý khi người dùng thích hoạt động
  const handleLike = () => {
    if (!localActivity) return

    const updatedActivity = {
      ...localActivity,
      liked: !localActivity.liked,
    }
    setLocalActivity(updatedActivity)
    onActivityUpdate(updatedActivity)

    toast({
      title: updatedActivity.liked ? "Đã thích hoạt động" : "Đã bỏ thích hoạt động",
      duration: 2000,
    })
  }

  // Hàm xử lý khi người dùng gửi bình luận
  const handleSendComment = () => {
    if (!commentText.trim() || !localActivity) return

    // Tạo bình luận mới
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      user: {
        name: "Bạn",
        initials: "B",
      },
      text: commentText,
      time: "Vừa xong",
      isCurrentUser: true,
    }

    // Cập nhật danh sách bình luận
    const updatedActivity = {
      ...localActivity,
      comments: [...(localActivity.comments || []), newComment],
    }

    setLocalActivity(updatedActivity)
    onActivityUpdate(updatedActivity)

    // Xóa nội dung trong ô nhập liệu
    setCommentText("")

    toast({
      title: "Đã thêm bình luận",
      duration: 2000,
    })
  }

  // Bắt đầu chỉnh sửa bình luận
  const handleStartEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id)
    setEditCommentText(comment.text)
  }

  // Hủy chỉnh sửa bình luận
  const handleCancelEditComment = () => {
    setEditingCommentId(null)
    setEditCommentText("")
  }

  // Lưu bình luận đã chỉnh sửa
  const handleSaveEditComment = (commentId: string) => {
    if (!editCommentText.trim() || !localActivity || !localActivity.comments) return

    const updatedActivity = {
      ...localActivity,
      comments: localActivity.comments.map((comment) =>
        comment.id === commentId ? { ...comment, text: editCommentText, time: "Đã chỉnh sửa" } : comment,
      ),
    }

    setLocalActivity(updatedActivity)
    onActivityUpdate(updatedActivity)
    setEditingCommentId(null)
    setEditCommentText("")

    toast({
      title: "Đã cập nhật bình luận",
      duration: 2000,
    })
  }

  // Xóa bình luận
  const handleDeleteComment = (commentId: string) => {
    if (!localActivity || !localActivity.comments) return

    const updatedActivity = {
      ...localActivity,
      comments: localActivity.comments.filter((comment) => comment.id !== commentId),
    }

    setLocalActivity(updatedActivity)
    onActivityUpdate(updatedActivity)

    toast({
      title: "Đã xóa bình luận",
      duration: 2000,
    })
  }

  // Xử lý khi người dùng nhấn Enter để gửi bình luận
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendComment()
    }
  }

  // Xử lý khi người dùng nhấn Enter để lưu bình luận đã chỉnh sửa
  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, commentId: string) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSaveEditComment(commentId)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chi tiết hoạt động</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-start space-x-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={localActivity.user.avatar || "/placeholder.svg"} alt={localActivity.user.name} />
              <AvatarFallback>{localActivity.user.initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{localActivity.user.name}</div>
              <div className="text-sm text-muted-foreground">{localActivity.time}</div>
            </div>
          </div>

          <div className="bg-muted p-3 rounded-md mb-4">
            <p className="text-sm">
              <span className="font-medium">{localActivity.user.name}</span> {localActivity.action}
            </p>
            {localActivity.boardId && (
              <Link
                href={`/board/${localActivity.boardId}`}
                className="text-sm text-primary hover:underline mt-1 block"
              >
                Xem bảng
              </Link>
            )}
            {localActivity.before && localActivity.after && (
              <div className="mt-2 text-sm">
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-2">Trước:</span>
                  <span>{localActivity.before}</span>
                </div>
                <div className="flex items-center mt-1">
                  <span className="text-muted-foreground mr-2">Sau:</span>
                  <span>{localActivity.after}</span>
                </div>
              </div>
            )}
          </div>

          {localActivity.comments && localActivity.comments.length > 0 && (
            <div className="space-y-3 mb-4">
              <h4 className="text-sm font-medium">Bình luận</h4>
              {localActivity.comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                    <AvatarFallback>{comment.user.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    {editingCommentId === comment.id ? (
                      <div className="space-y-2">
                        <textarea
                          ref={editInputRef}
                          className="w-full min-h-[80px] p-2 text-sm border rounded-md"
                          value={editCommentText}
                          onChange={(e) => setEditCommentText(e.target.value)}
                          onKeyDown={(e) => handleEditKeyDown(e, comment.id)}
                        />
                        <div className="flex justify-end space-x-2">
                          <Button size="sm" variant="outline" onClick={handleCancelEditComment} className="h-7 text-xs">
                            <X className="h-3 w-3 mr-1" />
                            Hủy
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSaveEditComment(comment.id)}
                            disabled={!editCommentText.trim()}
                            className="h-7 text-xs"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Lưu
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="bg-muted p-2 rounded-md group relative">
                          <div className="flex justify-between">
                            <div className="font-medium text-sm">{comment.user.name}</div>
                            {comment.isCurrentUser && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                  >
                                    <span className="sr-only">Tùy chọn</span>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="lucide lucide-more-horizontal"
                                    >
                                      <circle cx="12" cy="12" r="1" />
                                      <circle cx="19" cy="12" r="1" />
                                      <circle cx="5" cy="12" r="1" />
                                    </svg>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleStartEditComment(comment)}>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Chỉnh sửa
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => handleDeleteComment(comment.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Xóa
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                          <p className="text-sm">{comment.text}</p>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{comment.time}</div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-2 mt-4">
            <Button
              variant="ghost"
              size="sm"
              className={localActivity.liked ? "text-primary" : ""}
              onClick={handleLike}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              {localActivity.liked ? "Đã thích" : "Thích"}
            </Button>
            <Button variant="ghost" size="sm">
              <MessageSquare className="h-4 w-4 mr-1" />
              Bình luận
            </Button>
          </div>

          <div className="mt-3">
            <div className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>B</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <textarea
                  className="w-full min-h-[80px] p-2 text-sm border rounded-md"
                  placeholder="Viết bình luận..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <div className="flex justify-end mt-2">
                  <Button size="sm" disabled={!commentText.trim()} onClick={handleSendComment}>
                    Gửi
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
