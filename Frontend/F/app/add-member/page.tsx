import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function AddMemberPage() {
  return (
    <div className="max-w-md mx-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Thêm thành viên</CardTitle>
          <CardDescription>Mời thành viên tham gia vào bảng của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Địa chỉ email
              </label>
              <Input id="email" placeholder="Nhập địa chỉ email" type="email" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Lời nhắn (tùy chọn)</label>
              <textarea
                className="w-full min-h-[100px] p-2 border rounded-md"
                placeholder="Nhập lời nhắn cho thành viên mới"
              />
            </div>

            <div className="pt-2">
              <p className="text-sm text-gray-500 mb-4">
                Người được mời sẽ nhận được email thông báo và có thể tham gia vào bảng của bạn.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Hủy</Button>
          <Button>Gửi lời mời</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
