// Định nghĩa kiểu dữ liệu
export type Board = {
  id: string
  name: string
  description: string
  totalTasks: number
  color: string
}

// Dữ liệu mẫu - Đảm bảo có đúng 23 bảng để khớp với thống kê
export const boardsData: Board[] = [
  {
    id: "1",
    name: "Thiết kế lại Website",
    description: "Thiết kế lại hoàn chỉnh website công ty với nhận diện thương hiệu mới",
    totalTasks: 12,
    color: "#3b82f6",
  },
  {
    id: "2",
    name: "Chiến dịch Marketing",
    description: "Chiến dịch marketing kỹ thuật số Q3 cho việc ra mắt sản phẩm mới",
    totalTasks: 8,
    color: "#10b981",
  },
  {
    id: "3",
    name: "Ra mắt sản phẩm",
    description: "Quy trình ra mắt sản phẩm đầy đủ bao gồm kiểm thử và phân phối",
    totalTasks: 15,
    color: "#8b5cf6",
  },
  {
    id: "4",
    name: "Phát triển ứng dụng di động",
    description: "Phát triển ứng dụng di động mới cho iOS và Android",
    totalTasks: 20,
    color: "#f59e0b",
  },
  {
    id: "5",
    name: "Quy trình khách hàng",
    description: "Tối ưu hóa quy trình tiếp nhận khách hàng",
    totalTasks: 10,
    color: "#ef4444",
  },
  {
    id: "6",
    name: "Thiết kế UI/UX",
    description: "Thiết kế giao diện người dùng cho ứng dụng mới",
    totalTasks: 14,
    color: "#8b5cf6",
  },
  {
    id: "7",
    name: "Nghiên cứu thị trường",
    description: "Phân tích thị trường và đối thủ cạnh tranh",
    totalTasks: 7,
    color: "#3b82f6",
  },
  {
    id: "8",
    name: "Phát triển nội dung",
    description: "Tạo nội dung cho website và mạng xã hội",
    totalTasks: 9,
    color: "#f59e0b",
  },
  {
    id: "9",
    name: "Tối ưu hóa SEO",
    description: "Cải thiện thứ hạng tìm kiếm cho website",
    totalTasks: 11,
    color: "#10b981",
  },
  {
    id: "10",
    name: "Quản lý sự kiện",
    description: "Lập kế hoạch và tổ chức sự kiện ra mắt sản phẩm",
    totalTasks: 18,
    color: "#ef4444",
  },
  {
    id: "11",
    name: "Phát triển backend",
    description: "Xây dựng API và cơ sở dữ liệu cho ứng dụng",
    totalTasks: 16,
    color: "#3b82f6",
  },
  {
    id: "12",
    name: "Kiểm thử phần mềm",
    description: "Kiểm tra chất lượng và sửa lỗi cho ứng dụng",
    totalTasks: 13,
    color: "#8b5cf6",
  },
  {
    id: "13",
    name: "Thiết kế logo",
    description: "Tạo logo mới cho thương hiệu",
    totalTasks: 4,
    color: "#f59e0b",
  },
  {
    id: "14",
    name: "Chiến lược mạng xã hội",
    description: "Phát triển kế hoạch tiếp thị trên các nền tảng mạng xã hội",
    totalTasks: 9,
    color: "#10b981",
  },
  {
    id: "15",
    name: "Phân tích dữ liệu",
    description: "Thu thập và phân tích dữ liệu người dùng",
    totalTasks: 7,
    color: "#3b82f6",
  },
  {
    id: "16",
    name: "Tối ưu hóa hiệu suất",
    description: "Cải thiện tốc độ và hiệu suất của ứng dụng",
    totalTasks: 6,
    color: "#ef4444",
  },
  {
    id: "17",
    name: "Quản lý khách hàng",
    description: "Theo dõi và quản lý mối quan hệ với khách hàng",
    totalTasks: 12,
    color: "#8b5cf6",
  },
  {
    id: "18",
    name: "Phát triển sản phẩm",
    description: "Lập kế hoạch và phát triển tính năng mới cho sản phẩm",
    totalTasks: 15,
    color: "#f59e0b",
  },
  {
    id: "19",
    name: "Quản lý nhân sự",
    description: "Tuyển dụng và quản lý nhân viên mới",
    totalTasks: 8,
    color: "#10b981",
  },
  {
    id: "20",
    name: "Kế hoạch tài chính",
    description: "Lập ngân sách và dự báo tài chính",
    totalTasks: 10,
    color: "#3b82f6",
  },
  {
    id: "21",
    name: "Đào tạo nhân viên",
    description: "Phát triển chương trình đào tạo cho nhân viên mới",
    totalTasks: 7,
    color: "#ef4444",
  },
  {
    id: "22",
    name: "Báo cáo hiệu suất",
    description: "Tạo báo cáo về hiệu suất dự án và nhóm",
    totalTasks: 9,
    color: "#8b5cf6",
  },
  {
    id: "23",
    name: "Quản lý tài liệu",
    description: "Tổ chức và quản lý tài liệu dự án",
    totalTasks: 6,
    color: "#10b981",
  },
]
