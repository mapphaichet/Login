import Link from "next/link"
import { Home, LayoutGrid, Users, FolderOpen, Settings, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Sidebar() {
  return (
    <div className="w-64 border-r bg-white flex flex-col h-full">
      <div className="p-4 border-b">
        <h1 className="font-bold text-xl text-blue-600">TaskFlow</h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link href="/" className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-100 text-gray-700">
          <Home className="h-5 w-5" />
          <span className="font-medium">Trang chủ</span>
        </Link>

        <Link href="/boards" className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-100 text-gray-700">
          <LayoutGrid className="h-5 w-5" />
          <span className="font-medium">Bảng</span>
        </Link>

        <Link href="/members" className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-100 text-gray-700">
          <Users className="h-5 w-5" />
          <span className="font-medium">Thành viên</span>
        </Link>

        <Link
          href="/collections"
          className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-100 text-gray-700"
        >
          <FolderOpen className="h-5 w-5" />
          <span className="font-medium">Bộ sưu tập</span>
        </Link>

        <Link href="/settings" className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-100 text-gray-700">
          <Settings className="h-5 w-5" />
          <span className="font-medium">Cài đặt</span>
        </Link>
      </nav>

      <div className="p-4 border-t">
        <Button className="w-full flex items-center justify-center" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          <span>Tạo mới</span>
        </Button>
      </div>

      <div className="p-4 border-t flex items-center">
        <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">U</div>
        <div>
          <div className="font-medium">Người dùng</div>
          <div className="text-xs text-gray-500">user@example.com</div>
        </div>
      </div>
    </div>
  )
}
