"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Eye, Globe, Lock, Users, CheckCircle } from "lucide-react"
import { PrivacyModal } from "@/components/privacy-modal"
import { useToast } from "@/hooks/use-toast"

// Define types for privacy settings
type PrivacySetting = {
  id: string
  label: string
  description?: string
}

type PrivacySettingOption = {
  id: string
  label: string
  description?: string
}

// Define type for account information
type AccountInfo = {
  name: string
  email: string
  username: string
  phone: string
}

export default function SettingsPage() {
  const { toast } = useToast()

  // State for tracking which modal is open
  const [activeModal, setActiveModal] = useState<string | null>(null)

  // State for tracking account information
  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    name: "Nguyễn Văn A",
    email: "example@gmail.com",
    username: "nguyenvana",
    phone: "",
  })

  // State for tracking form changes
  const [formValues, setFormValues] = useState<AccountInfo>(accountInfo)

  // State for showing success message
  const [showSuccess, setShowSuccess] = useState(false)

  // State for tracking the current selected value for each privacy setting
  const [privacySettings, setPrivacySettings] = useState({
    "workspace-visibility": {
      id: "public",
      label: "Công khai",
      description: "Mọi người trong không gian làm việc có thể thấy hoạt động của bạn",
    },
    "activity-display": {
      id: "all",
      label: "Hiển thị tất cả thành viên",
      description: "Mọi người có thể thấy tất cả thành viên trong không gian làm việc",
    },
    "board-display": {
      id: "all",
      label: "Cho phép tất cả thành viên tạo bảng",
      description: "Mọi thành viên trong không gian làm việc có thể tạo bảng mới",
    },
    "board-settings-display": {
      id: "workspace",
      label: "Không gian làm việc - Mọi người có thể xem",
      description: "Mọi người trong không gian làm việc có thể xem bảng này",
    },
    "share-with-guests": {
      id: "allow",
      label: "Cho phép chia sẻ với khách",
      description: "Thành viên có thể mời người dùng bên ngoài tổ chức vào bảng",
    },
  })

  // Function to handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setAccountInfo(formValues)
    setShowSuccess(true)

    // Show toast notification
    toast({
      title: "Thay đổi đã được lưu",
      description: "Thông tin tài khoản của bạn đã được cập nhật thành công.",
    })

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false)
    }, 3000)
  }

  // Function to open a specific modal
  const openModal = (modalId: string) => {
    setActiveModal(modalId)
  }

  // Function to close the active modal
  const closeModal = () => {
    setActiveModal(null)
  }

  // Function to handle saving privacy settings
  const handleSavePrivacySetting = (modalId: string, value: string) => {
    // Find the selected option from the options array
    const selectedOption = getPrivacyOptions(modalId).find((option) => option.id === value)

    if (selectedOption) {
      // Update the privacy settings state
      setPrivacySettings((prev) => ({
        ...prev,
        [modalId]: selectedOption,
      }))

      // Show toast notification
      toast({
        title: "Cài đặt đã được lưu",
        description: "Cài đặt quyền riêng tư của bạn đã được cập nhật thành công.",
      })
    }
  }

  // Function to get privacy options for a specific setting
  const getPrivacyOptions = (modalId: string): PrivacySettingOption[] => {
    switch (modalId) {
      case "workspace-visibility":
        return [
          {
            id: "public",
            label: "Công khai",
            description: "Mọi người trong không gian làm việc có thể thấy hoạt động của bạn",
          },
          {
            id: "private",
            label: "Riêng tư",
            description: "Chỉ bạn và quản trị viên có thể thấy hoạt động của bạn",
          },
          {
            id: "team",
            label: "Chỉ nhóm",
            description: "Chỉ thành viên trong nhóm của bạn có thể thấy hoạt động của bạn",
          },
        ]
      case "activity-display":
        return [
          {
            id: "all",
            label: "Hiển thị tất cả thành viên",
            description: "Mọi người có thể thấy tất cả thành viên trong không gian làm việc",
          },
          {
            id: "team",
            label: "Chỉ hiển thị thành viên trong nhóm",
            description: "Chỉ hiển thị thành viên trong cùng nhóm với người xem",
          },
          {
            id: "none",
            label: "Không hiển thị thành viên",
            description: "Không hiển thị danh sách thành viên cho bất kỳ ai",
          },
        ]
      case "board-display":
        return [
          {
            id: "all",
            label: "Cho phép tất cả thành viên tạo bảng",
            description: "Mọi thành viên trong không gian làm việc có thể tạo bảng mới",
          },
          {
            id: "admin",
            label: "Chỉ quản trị viên có thể tạo bảng",
            description: "Chỉ quản trị viên và người được chỉ định có thể tạo bảng mới",
          },
          {
            id: "team-admin",
            label: "Quản trị viên nhóm có thể tạo bảng",
            description: "Quản trị viên nhóm có thể tạo bảng cho nhóm của họ",
          },
        ]
      case "board-settings-display":
        return [
          {
            id: "workspace",
            label: "Không gian làm việc - Mọi người có thể xem",
            description: "Mọi người trong không gian làm việc có thể xem bảng này",
          },
          {
            id: "workspace-edit",
            label: "Không gian làm việc - Mọi người có thể chỉnh sửa",
            description: "Mọi người trong không gian làm việc có thể chỉnh sửa bảng này",
          },
          {
            id: "team",
            label: "Nhóm - Chỉ thành viên nhóm có thể xem",
            description: "Chỉ thành viên trong nhóm được chỉ định có thể xem bảng này",
          },
          {
            id: "private",
            label: "Riêng tư - Chỉ thành viên bảng có thể xem",
            description: "Chỉ những người được mời trực tiếp có thể xem bảng này",
          },
        ]
      case "share-with-guests":
        return [
          {
            id: "allow",
            label: "Cho phép chia sẻ với khách",
            description: "Thành viên có thể mời người dùng bên ngoài tổ chức vào bảng",
          },
          {
            id: "admin-only",
            label: "Chỉ quản trị viên có thể mời khách",
            description: "Chỉ quản trị viên có thể mời người dùng bên ngoài tổ chức",
          },
          {
            id: "disable",
            label: "Tắt chia sẻ với khách",
            description: "Không ai có thể mời người dùng bên ngoài tổ chức",
          },
        ]
      default:
        return []
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Cài đặt</h1>

      <Tabs defaultValue="account">
        <TabsList className="mb-6">
          <TabsTrigger value="account">Tài khoản</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          <TabsTrigger value="privacy">Quyền riêng tư</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Thông tin tài khoản</CardTitle>
                  <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
                </div>
                {showSuccess && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span>Đã lưu thay đổi</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input id="name" name="name" value={formValues.name} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formValues.email} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Tên người dùng</Label>
                    <Input id="username" name="username" value={formValues.username} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="Nhập số điện thoại"
                      value={formValues.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit">Lưu thay đổi</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt thông báo</CardTitle>
              <CardDescription>Quản lý cách bạn nhận thông báo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {notificationSettings.map((setting, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div>
                      <h4 className="font-medium">{setting.title}</h4>
                      <p className="text-sm text-gray-500">{setting.description}</p>
                    </div>
                    <Switch defaultChecked={setting.enabled} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <div className="space-y-6">
            {/* Visibility in workspace */}
            <Card>
              <CardHeader>
                <CardTitle>Khả năng hiển thị trong không gian làm việc</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3 mb-4">
                  <div className="mt-1 text-gray-500">
                    <Users size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{privacySettings["workspace-visibility"].label}</p>
                    <p className="text-sm text-gray-500 mt-1">{privacySettings["workspace-visibility"].description}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => openModal("workspace-visibility")}>
                    Thay đổi
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Activity display policy */}
            <Card>
              <CardHeader>
                <CardTitle>Chính sách hiển thị các hoạt động</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-gray-500">
                    <Globe size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{privacySettings["activity-display"].label}</p>
                    <p className="text-sm text-gray-500 mt-1">{privacySettings["activity-display"].description}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => openModal("activity-display")}>
                    Thay đổi
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Board display policy */}
            <Card>
              <CardHeader>
                <CardTitle>Chính sách hiển thị các bảng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-gray-500">
                    <Eye size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{privacySettings["board-display"].label}</p>
                    <p className="text-sm text-gray-500 mt-1">{privacySettings["board-display"].description}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => openModal("board-display")}>
                    Thay đổi
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Board settings display policy */}
            <Card>
              <CardHeader>
                <CardTitle>Chính sách hiển thị cài đặt bảng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-gray-500">
                    <Lock size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{privacySettings["board-settings-display"].label}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {privacySettings["board-settings-display"].description}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => openModal("board-settings-display")}>
                    Thay đổi
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Share board with guests */}
            <Card>
              <CardHeader>
                <CardTitle>Chia sẻ bảng với khách</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-gray-500">
                    <Users size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{privacySettings["share-with-guests"].label}</p>
                    <p className="text-sm text-gray-500 mt-1">{privacySettings["share-with-guests"].description}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => openModal("share-with-guests")}>
                    Thay đổi
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Modals for each privacy setting */}
          <PrivacyModal
            isOpen={activeModal === "workspace-visibility"}
            onClose={closeModal}
            title="Khả năng hiển thị - Mặc định không gian làm việc"
            options={getPrivacyOptions("workspace-visibility")}
            defaultValue={privacySettings["workspace-visibility"].id}
            onSave={(value) => handleSavePrivacySetting("workspace-visibility", value)}
          />

          <PrivacyModal
            isOpen={activeModal === "activity-display"}
            onClose={closeModal}
            title="Hiển thị thành viên - Mặc định không gian làm việc"
            options={getPrivacyOptions("activity-display")}
            defaultValue={privacySettings["activity-display"].id}
            onSave={(value) => handleSavePrivacySetting("activity-display", value)}
          />

          <PrivacyModal
            isOpen={activeModal === "board-display"}
            onClose={closeModal}
            title="Hiển thị tạo bảng - Mặc định không gian làm việc"
            options={getPrivacyOptions("board-display")}
            defaultValue={privacySettings["board-display"].id}
            onSave={(value) => handleSavePrivacySetting("board-display", value)}
          />

          <PrivacyModal
            isOpen={activeModal === "board-settings-display"}
            onClose={closeModal}
            title="Cài đặt quyền truy cập bảng - Mặc định không gian làm việc"
            options={getPrivacyOptions("board-settings-display")}
            defaultValue={privacySettings["board-settings-display"].id}
            onSave={(value) => handleSavePrivacySetting("board-settings-display", value)}
          />

          <PrivacyModal
            isOpen={activeModal === "share-with-guests"}
            onClose={closeModal}
            title="Chia sẻ bảng với khách"
            options={getPrivacyOptions("share-with-guests")}
            defaultValue={privacySettings["share-with-guests"].id}
            onSave={(value) => handleSavePrivacySetting("share-with-guests", value)}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

const notificationSettings = [
  {
    title: "Thông báo email",
    description: "Nhận email khi có hoạt động mới trên bảng của bạn",
    enabled: true,
  },
  {
    title: "Thông báo trên trình duyệt",
    description: "Hiển thị thông báo trên trình duyệt khi có cập nhật mới",
    enabled: true,
  },
  {
    title: "Thông báo về bình luận",
    description: "Nhận thông báo khi có người bình luận trên thẻ của bạn",
    enabled: true,
  },
  {
    title: "Thông báo về hạn chót",
    description: "Nhận thông báo khi thẻ sắp đến hạn",
    enabled: false,
  },
  {
    title: "Thông báo khi được gán",
    description: "Nhận thông báo khi bạn được gán vào một thẻ mới",
    enabled: true,
  },
]
