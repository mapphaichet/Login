"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon, User, Tag, Paperclip, X, Edit, Plus, Users, Clock, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface CardMember {
  id: string
  name: string
  email?: string
  avatar?: string
  initials: string
}

interface CardAttachment {
  id: string
  name: string
  url: string
  date: string
}

interface CardLabel {
  id: string
  name: string
  color: string
}

interface CardDetailModalProps {
  isOpen: boolean
  onClose: () => void
  card: {
    id: string
    title: string
    columnName: string
    description: string
    dueDate?: Date
    labels: CardLabel[]
    members: CardMember[]
    attachments: CardAttachment[]
    isJoined?: boolean
  }
  boardMembers: CardMember[]
  onUpdate: (updatedCard: any) => void
}

export function CardDetailModal({ isOpen, onClose, card, boardMembers, onUpdate }: CardDetailModalProps) {
  const [title, setTitle] = useState(card.title)
  const [description, setDescription] = useState(card.description)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [dueDate, setDueDate] = useState<Date | undefined>(card.dueDate)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isLabelPickerOpen, setIsLabelPickerOpen] = useState(false)
  const [isMemberPickerOpen, setIsMemberPickerOpen] = useState(false)
  const [selectedLabels, setSelectedLabels] = useState<CardLabel[]>(card.labels)
  const [selectedMembers, setSelectedMembers] = useState<CardMember[]>(card.members)
  const [isJoined, setIsJoined] = useState(card.isJoined || false)
  const [attachments, setAttachments] = useState<CardAttachment[]>(card.attachments)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState("19:00")
  const [reminderOption, setReminderOption] = useState("1 Ngày trước")
  const [useStartDate, setUseStartDate] = useState(false)
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [searchMember, setSearchMember] = useState("")
  const [searchLabel, setSearchLabel] = useState("")
  const [newLabelName, setNewLabelName] = useState("")
  const [newLabelColor, setNewLabelColor] = useState("#0079bf")
  const [isCreatingLabel, setIsCreatingLabel] = useState(false)
  const [editingLabelId, setEditingLabelId] = useState<string | null>(null)
  const [editingLabelName, setEditingLabelName] = useState("")
  const [startDateInput, setStartDateInput] = useState("")
  const [dueDateInput, setDueDateInput] = useState("")

  // This will focus the title input when editing mode is enabled
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }, [isEditingTitle])

  // This will focus the description textarea when editing mode is enabled
  useEffect(() => {
    if (isEditingDescription && descriptionTextareaRef.current) {
      descriptionTextareaRef.current.focus()
    }
  }, [isEditingDescription])

  // Update due date input when dueDate changes
  useEffect(() => {
    if (dueDate) {
      setDueDateInput(format(dueDate, "dd/MM/yyyy", { locale: vi }))
    } else {
      setDueDateInput("")
    }
  }, [dueDate])

  // Handle title edit submission
  const handleTitleSubmit = () => {
    setIsEditingTitle(false)
    onUpdate({ ...card, title })
  }

  // Handle description edit submission
  const handleDescriptionSubmit = () => {
    setIsEditingDescription(false)
    onUpdate({ ...card, description })
  }

  // Handle joining the card
  const handleJoin = () => {
    setIsJoined(!isJoined)
    onUpdate({ ...card, isJoined: !isJoined })

    toast({
      title: isJoined ? "Đã rời khỏi thẻ" : "Đã tham gia thẻ",
      description: isJoined
        ? "Bạn sẽ không nhận thông báo về thẻ này nữa"
        : "Bạn sẽ nhận thông báo về các cập nhật của thẻ này",
    })
  }

  // Handle date selection
  const handleDateSelect = () => {
    if (!dueDate) {
      setIsDatePickerOpen(false)
      return
    }

    // Lấy giờ và phút từ selectedTime
    const [hours, minutes] = selectedTime.split(":").map(Number)

    // Tạo ngày mới với giờ đã chọn
    const newDueDate = new Date(dueDate)
    newDueDate.setHours(hours || 0)
    newDueDate.setMinutes(minutes || 0)

    setDueDate(newDueDate)
    setIsDatePickerOpen(false)
    onUpdate({ ...card, dueDate: newDueDate })

    toast({
      title: "Đã cập nhật ngày hạn",
      description: `Ngày hạn của thẻ đã được đặt thành ${format(newDueDate, "dd/MM/yyyy HH:mm", { locale: vi })}`,
    })
  }

  // Handle member selection
  const handleMemberToggle = (member: CardMember) => {
    const isMemberSelected = selectedMembers.some((m) => m.id === member.id)
    let newMembers

    if (isMemberSelected) {
      newMembers = selectedMembers.filter((m) => m.id !== member.id)
    } else {
      newMembers = [...selectedMembers, member]
    }

    setSelectedMembers(newMembers)
    onUpdate({ ...card, members: newMembers })

    // Hiển thị thông báo
    toast({
      title: isMemberSelected ? "Đã xóa thành viên" : "Đã thêm thành viên",
      description: isMemberSelected ? `Đã xóa ${member.name} khỏi thẻ này` : `Đã thêm ${member.name} vào thẻ này`,
    })
  }

  // Handle label selection
  const handleLabelToggle = (label: CardLabel) => {
    const isLabelSelected = selectedLabels.some((l) => l.id === label.id)
    let newLabels

    if (isLabelSelected) {
      newLabels = selectedLabels.filter((l) => l.id !== label.id)
    } else {
      newLabels = [...selectedLabels, label]
    }

    setSelectedLabels(newLabels)
    onUpdate({ ...card, labels: newLabels })

    // Hiển thị thông báo
    toast({
      title: isLabelSelected ? "Đã xóa nhãn" : "Đã thêm nhãn",
      description: isLabelSelected
        ? `Đã xóa nhãn ${label.name || "không tên"} khỏi thẻ này`
        : `Đã thêm nhãn ${label.name || "không tên"} vào thẻ này`,
    })
  }

  // Handle creating a new label
  const handleCreateLabel = () => {
    if (isCreatingLabel) {
      const newLabel: CardLabel = {
        id: `label-${Date.now()}`,
        name: newLabelName,
        color: newLabelColor,
      }

      const newLabels = [...selectedLabels, newLabel]
      setSelectedLabels(newLabels)
      onUpdate({ ...card, labels: newLabels })

      setNewLabelName("")
      setIsCreatingLabel(false)

      toast({
        title: "Đã tạo nhãn mới",
        description: `Đã tạo và thêm nhãn ${newLabelName || "không tên"} vào thẻ này`,
      })
    } else {
      setIsCreatingLabel(true)
    }
  }

  // Handle file upload
  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // In a real app, you would upload these files to a server
    // Here we'll just simulate adding them to the attachments list
    const newAttachments = Array.from(files).map((file) => ({
      id: `attachment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      url: URL.createObjectURL(file),
      date: format(new Date(), "dd/MM/yyyy HH:mm", { locale: vi }),
    }))

    const updatedAttachments = [...attachments, ...newAttachments]
    setAttachments(updatedAttachments)
    onUpdate({ ...card, attachments: updatedAttachments })

    toast({
      title: "Đã thêm tệp đính kèm",
      description: `Đã thêm ${newAttachments.length} tệp đính kèm mới vào thẻ`,
    })

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Handle editing label
  const handleEditLabel = (label: CardLabel) => {
    setEditingLabelId(label.id)
    setEditingLabelName(label.name || "")
  }

  // Handle save label edit
  const handleSaveLabelEdit = () => {
    if (!editingLabelId) return

    const updatedLabels = selectedLabels.map((label) => {
      if (label.id === editingLabelId) {
        return { ...label, name: editingLabelName }
      }
      return label
    })

    setSelectedLabels(updatedLabels)
    onUpdate({ ...card, labels: updatedLabels })
    setEditingLabelId(null)

    toast({
      title: "Đã cập nhật nhãn",
      description: `Đã đổi tên nhãn thành "${editingLabelName}"`,
    })
  }

  // Available labels
  const availableLabels: CardLabel[] = [
    { id: "label-1", name: "Hoàn thành", color: "#61bd4f" },
    { id: "label-2", name: "Cần xem xét", color: "#f2d600" },
    { id: "label-3", name: "Ưu tiên cao", color: "#ff9f1a" },
    { id: "label-4", name: "Đang thực hiện", color: "#eb5a46" },
    { id: "label-5", name: "Bị chặn", color: "#c377e0" },
    { id: "label-6", name: "Cần thảo luận", color: "#0079bf" },
    ...selectedLabels.filter(
      (label) => !["label-1", "label-2", "label-3", "label-4", "label-5", "label-6"].includes(label.id),
    ),
  ]

  // Available colors for new labels
  const labelColors = [
    "#61bd4f",
    "#f2d600",
    "#ff9f1a",
    "#eb5a46",
    "#c377e0",
    "#0079bf",
    "#00c2e0",
    "#51e898",
    "#ff78cb",
    "#344563",
  ]

  // Filter members based on search
  const filteredBoardMembers = boardMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchMember.toLowerCase()) ||
      (member.email && member.email.toLowerCase().includes(searchMember.toLowerCase())),
  )

  // Filter labels based on search
  const filteredLabels = availableLabels.filter((label) => label.name.toLowerCase().includes(searchLabel.toLowerCase()))

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = selectedMonth.getFullYear()
    const month = selectedMonth.getMonth()

    // Get the first day of the month
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay()

    // Calculate days from previous month to show
    const daysFromPrevMonth = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

    // Calculate total days to show (including days from previous and next months)
    const totalDays = 42 // 6 rows of 7 days

    const days = []

    // Add days from previous month
    const prevMonth = new Date(year, month, 0)
    const prevMonthDays = prevMonth.getDate()

    for (let i = prevMonthDays - daysFromPrevMonth + 1; i <= prevMonthDays; i++) {
      days.push({
        date: new Date(year, month - 1, i),
        isCurrentMonth: false,
      })
    }

    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      })
    }

    // Add days from next month
    const remainingDays = totalDays - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      })
    }

    return days
  }

  const calendarDays = generateCalendarDays()

  // Check if a date is selected
  const isDateSelected = (date: Date) => {
    if (!dueDate) return false
    return (
      date.getDate() === dueDate.getDate() &&
      date.getMonth() === dueDate.getMonth() &&
      date.getFullYear() === dueDate.getFullYear()
    )
  }

  // Navigate to previous month
  const goToPrevMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1))
  }

  // Navigate to next month
  const goToNextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1))
  }

  // Navigate to previous year
  const goToPrevYear = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear() - 1, selectedMonth.getMonth(), 1))
  }

  // Navigate to next year
  const goToNextYear = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear() + 1, selectedMonth.getMonth(), 1))
  }

  // Format month and year
  const formatMonthYear = (date: Date) => {
    return `Tháng ${date.getMonth() + 1} ${date.getFullYear()}`
  }

  // Day names
  const dayNames = ["Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "CN"]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl max-h-screen overflow-y-auto dialog-content">
        <Button variant="ghost" size="icon" className="h-8 w-8 absolute right-2 top-2" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>

        <div className="space-y-4">
          {/* Header section with title */}
          <div className="flex items-start gap-3">
            <div className="flex-1">
              {isEditingTitle ? (
                <div className="space-y-2">
                  <Input
                    ref={titleInputRef}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-xl font-bold"
                    onBlur={handleTitleSubmit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleTitleSubmit()
                      }
                    }}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleTitleSubmit}>
                      Lưu
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setTitle(card.title)
                        setIsEditingTitle(false)
                      }}
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              ) : (
                <h2
                  className="text-xl font-bold cursor-pointer hover:bg-gray-100 p-1 rounded"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {title}
                </h2>
              )}
              <div className="text-sm text-muted-foreground mt-1">
                Trong danh sách <Badge variant="outline">{card.columnName}</Badge>
              </div>
            </div>
          </div>

          {/* Main content split into two columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Left column - main content */}
            <div className="md:col-span-2 space-y-6">
              {/* Labels section */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Tag className="h-4 w-4 mr-2" />
                  <span>Nhãn</span>
                </div>
                {selectedLabels.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedLabels.map((label) => (
                      <Badge
                        key={label.id}
                        className="px-3 py-1 cursor-pointer"
                        style={{ backgroundColor: label.color, color: "#ffffff" }}
                        onClick={() => setIsLabelPickerOpen(true)}
                      >
                        {label.name || " "}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div
                    className="p-2 border border-dashed rounded-md text-gray-500 cursor-pointer hover:bg-gray-50"
                    onClick={() => setIsLabelPickerOpen(true)}
                  >
                    Nhấn để thêm nhãn
                  </div>
                )}
              </div>

              {/* Due date display */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Ngày hạn</span>
                </div>
                {dueDate ? (
                  <Badge
                    variant="outline"
                    className="px-3 py-1 cursor-pointer flex items-center gap-2 w-fit"
                    onClick={() => setIsDatePickerOpen(true)}
                  >
                    <CalendarIcon className="h-4 w-4" />
                    <span>{format(dueDate, "dd/MM/yyyy HH:mm", { locale: vi })}</span>
                  </Badge>
                ) : (
                  <div
                    className="p-2 border border-dashed rounded-md text-gray-500 cursor-pointer hover:bg-gray-50"
                    onClick={() => setIsDatePickerOpen(true)}
                  >
                    Nhấn để thêm ngày hạn
                  </div>
                )}
              </div>

              {/* Members section */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Thành viên</span>
                </div>
                {selectedMembers.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-2 bg-gray-100 rounded-full pl-1 pr-3 py-1 cursor-pointer hover:bg-gray-200"
                        onClick={() => setIsMemberPickerOpen(true)}
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>{member.initials}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{member.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="p-2 border border-dashed rounded-md text-gray-500 cursor-pointer hover:bg-gray-50"
                    onClick={() => setIsMemberPickerOpen(true)}
                  >
                    Nhấn để thêm thành viên
                  </div>
                )}
              </div>

              {/* Description section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium text-base">Mô tả</span>
                  </div>
                  {!isEditingDescription && (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingDescription(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </Button>
                  )}
                </div>

                {isEditingDescription ? (
                  <div className="space-y-2">
                    <Textarea
                      ref={descriptionTextareaRef}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-[120px]"
                      placeholder="Thêm mô tả chi tiết cho thẻ này..."
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleDescriptionSubmit}>
                        Lưu
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setDescription(card.description)
                          setIsEditingDescription(false)
                        }}
                      >
                        Hủy
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "p-3 rounded-md cursor-pointer hover:bg-gray-100 min-h-[80px]",
                      !description && "bg-gray-50 text-gray-500 italic",
                    )}
                    onClick={() => setIsEditingDescription(true)}
                  >
                    {description || "Thêm mô tả chi tiết cho thẻ này..."}
                  </div>
                )}
              </div>

              {/* Attachments section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Paperclip className="h-4 w-4 mr-2" />
                    <span className="font-medium text-base">Tệp đính kèm</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleFileUpload}>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm tệp
                  </Button>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} multiple />
                </div>

                {attachments.length > 0 ? (
                  <div className="space-y-3">
                    {attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-start gap-3 p-3 border rounded-md">
                        <div className="bg-gray-100 h-14 w-14 flex items-center justify-center rounded overflow-hidden">
                          {attachment.name.endsWith(".jpg") ||
                          attachment.name.endsWith(".png") ||
                          attachment.name.endsWith(".jpeg") ? (
                            <img
                              src={attachment.url || "/placeholder.svg"}
                              alt={attachment.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Paperclip className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium hover:underline"
                          >
                            {attachment.name}
                          </a>
                          <div className="text-xs text-gray-500">Thêm vào {attachment.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="p-2 border border-dashed rounded-md text-gray-500 cursor-pointer hover:bg-gray-50"
                    onClick={handleFileUpload}
                  >
                    Nhấn để thêm tệp đính kèm
                  </div>
                )}
              </div>
            </div>

            {/* Right column - actions */}
            <div className="space-y-3">
              <div className="font-medium">Thêm vào thẻ</div>

              {/* Join/Leave button */}
              <Button
                variant="outline"
                className="w-full justify-start text-gray-700 bg-gray-100 hover:bg-gray-200"
                onClick={handleJoin}
              >
                <User className="h-4 w-4 mr-2" />
                {isJoined ? "Rời đi" : "Tham gia"}
              </Button>

              {/* Members button */}
              <Dialog open={isMemberPickerOpen} onOpenChange={setIsMemberPickerOpen}>
                <DialogContent className="sm:max-w-md">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Thành viên</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setIsMemberPickerOpen(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <Input
                      placeholder="Tìm kiếm các thành viên"
                      value={searchMember}
                      onChange={(e) => setSearchMember(e.target.value)}
                    />

                    <div className="space-y-4">
                      <div className="text-sm font-medium">Thành viên của bảng</div>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {filteredBoardMembers.map((member) => {
                          const isMemberSelected = selectedMembers.some((m) => m.id === member.id)
                          return (
                            <div
                              key={member.id}
                              className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                                isMemberSelected ? "bg-blue-50" : "hover:bg-gray-100"
                              }`}
                              onClick={() => handleMemberToggle(member)}
                            >
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                  <AvatarFallback>{member.initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{member.name}</div>
                                  {member.email && <div className="text-xs text-gray-500">{member.email}</div>}
                                </div>
                              </div>
                              {isMemberSelected && <Check className="h-5 w-5 text-blue-500" />}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="w-full justify-start" onClick={() => setIsMemberPickerOpen(true)}>
                <Users className="h-4 w-4 mr-2" />
                Thành viên
              </Button>

              {/* Labels button */}
              <Dialog open={isLabelPickerOpen} onOpenChange={setIsLabelPickerOpen}>
                <DialogContent className="sm:max-w-md">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Nhãn</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setIsLabelPickerOpen(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <Input
                      placeholder="Tìm nhãn..."
                      value={searchLabel}
                      onChange={(e) => setSearchLabel(e.target.value)}
                    />

                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {filteredLabels.map((label) => {
                        const isLabelSelected = selectedLabels.some((l) => l.id === label.id)
                        return (
                          <div key={label.id} className="flex items-center gap-2 p-1">
                            <Checkbox
                              id={`label-${label.id}`}
                              checked={isLabelSelected}
                              onCheckedChange={() => handleLabelToggle(label)}
                              className="h-5 w-5"
                            />
                            {editingLabelId === label.id ? (
                              <div className="flex-1 flex items-center gap-2">
                                <Input
                                  value={editingLabelName}
                                  onChange={(e) => setEditingLabelName(e.target.value)}
                                  className="h-8"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSaveLabelEdit()
                                    if (e.key === "Escape") setEditingLabelId(null)
                                  }}
                                />
                                <Button size="sm" onClick={handleSaveLabelEdit}>
                                  Lưu
                                </Button>
                              </div>
                            ) : (
                              <div
                                className="flex-1 h-8 flex items-center justify-between px-3 rounded cursor-pointer"
                                style={{ backgroundColor: label.color }}
                              >
                                <span className="text-sm text-white font-medium">{label.name || " "}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-white hover:bg-white/20"
                                  onClick={() => handleEditLabel(label)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {isCreatingLabel ? (
                      <div className="space-y-3 pt-2 border-t">
                        <Input
                          placeholder="Tên nhãn (tùy chọn)"
                          value={newLabelName}
                          onChange={(e) => setNewLabelName(e.target.value)}
                        />
                        <div className="flex flex-wrap gap-2">
                          {labelColors.map((color) => (
                            <div
                              key={color}
                              className={`h-6 w-6 rounded-full cursor-pointer ${
                                newLabelColor === color ? "ring-2 ring-offset-2 ring-blue-500" : ""
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => setNewLabelColor(color)}
                            />
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button className="flex-1" onClick={handleCreateLabel}>
                            Tạo
                          </Button>
                          <Button variant="outline" onClick={() => setIsCreatingLabel(false)}>
                            Hủy
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button variant="secondary" className="w-full" onClick={handleCreateLabel}>
                        Tạo nhãn mới
                      </Button>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="w-full justify-start" onClick={() => setIsLabelPickerOpen(true)}>
                <Tag className="h-4 w-4 mr-2" />
                Nhãn
              </Button>

              {/* Due date button */}
              <Dialog open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <DialogContent className="sm:max-w-md">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Ngày</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setIsDatePickerOpen(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <button onClick={goToPrevYear} className="p-1 hover:bg-gray-100 rounded">
                        «
                      </button>
                      <button onClick={goToPrevMonth} className="p-1 hover:bg-gray-100 rounded">
                        ‹
                      </button>
                      <div className="font-medium">{formatMonthYear(selectedMonth)}</div>
                      <button onClick={goToNextMonth} className="p-1 hover:bg-gray-100 rounded">
                        ›
                      </button>
                      <button onClick={goToNextYear} className="p-1 hover:bg-gray-100 rounded">
                        »
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {dayNames.map((day) => (
                        <div key={day} className="text-center text-sm font-medium py-1">
                          {day}
                        </div>
                      ))}

                      {calendarDays.map((day, index) => (
                        <button
                          key={index}
                          className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center text-sm",
                            !day.isCurrentMonth && "text-gray-400",
                            day.isCurrentMonth && "hover:bg-gray-100",
                            isDateSelected(day.date) && "bg-blue-500 text-white hover:bg-blue-600",
                          )}
                          onClick={() => setDueDate(day.date)}
                        >
                          {day.date.getDate()}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4 pt-2 border-t">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="text-sm font-medium">Ngày bắt đầu</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="start-date"
                            className="h-5 w-5"
                            checked={useStartDate}
                            onCheckedChange={(checked) => setUseStartDate(!!checked)}
                          />
                          <Input
                            placeholder="N/T/NNNN"
                            className="flex-1"
                            disabled={!useStartDate}
                            value={startDateInput}
                            onChange={(e) => setStartDateInput(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="text-sm font-medium">Ngày hết hạn</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="due-date"
                            checked={!!dueDate}
                            onCheckedChange={(checked) => {
                              if (!checked) setDueDate(undefined)
                            }}
                            className="h-5 w-5"
                          />
                          <div className="flex gap-2 flex-1">
                            <Input value={dueDateInput} placeholder="N/T/NNNN" className="flex-1" readOnly />
                            <Input
                              placeholder="19:00"
                              className="w-24"
                              value={selectedTime}
                              onChange={(e) => setSelectedTime(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">Thiết lập Nhắc nhở</div>
                        <select
                          className="w-full p-2 border rounded-md"
                          value={reminderOption}
                          onChange={(e) => setReminderOption(e.target.value)}
                        >
                          <option>1 Ngày trước</option>
                          <option>2 Ngày trước</option>
                          <option>1 Giờ trước</option>
                        </select>
                        <div className="text-xs text-gray-500">
                          Nhắc nhở sẽ được gửi đến tất cả các thành viên và người theo dõi thẻ này.
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 pt-2">
                        <Button className="w-full" onClick={handleDateSelect}>
                          Lưu
                        </Button>
                        <Button
                          variant="secondary"
                          className="w-full"
                          onClick={() => {
                            setDueDate(undefined)
                            setIsDatePickerOpen(false)
                            onUpdate({ ...card, dueDate: undefined })
                          }}
                        >
                          Gỡ bỏ
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="w-full justify-start" onClick={() => setIsDatePickerOpen(true)}>
                <CalendarIcon className="h-4 w-4 mr-2" />
                Ngày hạn
              </Button>

              {/* Attachment button */}
              <Button variant="outline" className="w-full justify-start" onClick={handleFileUpload}>
                <Paperclip className="h-4 w-4 mr-2" />
                Tệp đính kèm
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
