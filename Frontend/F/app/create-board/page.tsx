import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function CreateBoardPage({
  searchParams,
}: {
  searchParams?: { collection?: string }
}) {
  // Lấy collectionId từ URL nếu có
  const collectionId = searchParams?.collection

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Tạo bảng mới</CardTitle>
          <CardDescription>Tạo một bảng mới để bắt đầu dự án của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="board-name" className="block text-sm font-medium mb-1">
                Tên bảng
              </label>
              <Input id="board-name" placeholder="Nhập tên bảng" />
            </div>

            {collectionId && (
              <div>
                <label className="block text-sm font-medium mb-1">Bộ sưu tập</label>
                <div className="p-2 border rounded-md bg-gray-50">
                  <p className="text-sm">Bảng này sẽ được thêm vào bộ sưu tập đã chọn</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Hình nền</label>
              <div className="grid grid-cols-3 gap-2">
                {backgrounds.map((bg, index) => (
                  <div
                    key={index}
                    className="aspect-video rounded-md overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary"
                  >
                    <Image
                      src={bg || "/placeholder.svg"}
                      alt={`Background ${index + 1}`}
                      width={120}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button className="w-full">Tạo bảng</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const backgrounds = [
  "/placeholder.svg?height=80&width=120",
  "/placeholder.svg?height=80&width=120",
  "/placeholder.svg?height=80&width=120",
  "/placeholder.svg?height=80&width=120",
  "/placeholder.svg?height=80&width=120",
  "/placeholder.svg?height=80&width=120",
]
