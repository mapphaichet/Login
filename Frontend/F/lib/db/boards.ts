import type { Board } from "@/types"

// Dữ liệu mẫu
export const boards: Board[] = [
  {
    id: "1",
    name: "Thiết kế lại Website",
    color: "#3b82f6",
    members: 5,
    description: "Thiết kế lại hoàn chỉnh website công ty với nhận diện thương hiệu mới",
    totalTasks: 12,
    columns: [
      {
        id: "col-1",
        name: "Cần làm",
        cards: [
          {
            id: "card-1",
            title: "Thiết kế logo",
            labels: ["#61bd4f", "#f2d600"],
            description: "Thiết kế logo mới cho thương hiệu",
            dueDate: "15/05/2025",
            members: [
              { id: "1", name: "Nguyễn Văn A", initials: "NA" },
              { id: "2", name: "Trần Thị B", initials: "TB" },
            ],
            attachments: 2,
            comments: 3,
          },
          {
            id: "card-2",
            title: "Phân tích đối thủ",
            labels: ["#ff9f1a"],
            description: "Nghiên cứu và phân tích các đối thủ cạnh tranh",
            dueDate: "18/05/2025",
            members: [{ id: "3", name: "Lê Văn C", initials: "LC" }],
            comments: 1,
          },
          {
            id: "card-3",
            title: "Lên kế hoạch nội dung",
            labels: [],
            description: "Xây dựng kế hoạch nội dung cho website",
            members: [{ id: "4", name: "Phạm Thị D", initials: "PD" }],
          },
        ],
      },
      {
        id: "col-2",
        name: "Đang thực hiện",
        cards: [
          {
            id: "card-4",
            title: "Viết nội dung",
            labels: ["#eb5a46"],
            description: "Viết nội dung cho trang chủ và trang giới thiệu",
            dueDate: "10/05/2025",
            members: [
              { id: "4", name: "Phạm Thị D", initials: "PD" },
              { id: "5", name: "Hoàng Văn E", initials: "HE" },
            ],
            attachments: 1,
          },
          {
            id: "card-5",
            title: "Thiết kế UI trang chủ",
            labels: ["#c377e0", "#0079bf"],
            description: "Thiết kế giao diện trang chủ theo yêu cầu",
            members: [{ id: "2", name: "Trần Thị B", initials: "TB" }],
            comments: 5,
          },
        ],
      },
      {
        id: "col-3",
        name: "Đã hoàn thành",
        cards: [
          {
            id: "card-6",
            title: "Khảo sát người dùng",
            labels: ["#61bd4f"],
            description: "Thực hiện khảo sát nhu cầu người dùng",
            dueDate: "01/05/2025",
            members: [
              { id: "1", name: "Nguyễn Văn A", initials: "NA" },
              { id: "3", name: "Lê Văn C", initials: "LC" },
            ],
            attachments: 3,
            comments: 2,
          },
          {
            id: "card-7",
            title: "Tạo wireframe",
            labels: ["#0079bf"],
            description: "Tạo wireframe cho các trang chính",
            members: [{ id: "2", name: "Trần Thị B", initials: "TB" }],
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Chiến dịch Marketing",
    color: "#10b981",
    members: 3,
    description: "Chiến dịch marketing kỹ thuật số Q3 cho việc ra mắt sản phẩm mới",
    totalTasks: 8,
    columns: [
      {
        id: "col-1",
        name: "Cần làm",
        cards: [
          {
            id: "card-1",
            title: "Lên kế hoạch nội dung",
            labels: ["#61bd4f"],
            description: "Xây dựng kế hoạch nội dung cho mạng xã hội",
            dueDate: "20/05/2025",
            members: [{ id: "1", name: "Nguyễn Văn A", initials: "NA" }],
          },
          {
            id: "card-2",
            title: "Thiết kế banner quảng cáo",
            labels: ["#ff9f1a", "#0079bf"],
            description: "Thiết kế banner cho các nền tảng quảng cáo",
            dueDate: "22/05/2025",
            members: [{ id: "2", name: "Trần Thị B", initials: "TB" }],
            attachments: 1,
          },
        ],
      },
      {
        id: "col-2",
        name: "Đang thực hiện",
        cards: [
          {
            id: "card-3",
            title: "Phân tích đối thủ",
            labels: ["#eb5a46"],
            description: "Phân tích chiến lược marketing của đối thủ",
            members: [
              { id: "3", name: "Lê Văn C", initials: "LC" },
              { id: "4", name: "Phạm Thị D", initials: "PD" },
            ],
            comments: 3,
          },
          {
            id: "card-4",
            title: "Chuẩn bị email marketing",
            labels: ["#c377e0"],
            description: "Thiết kế mẫu email và lên kế hoạch gửi",
            dueDate: "15/05/2025",
            members: [{ id: "1", name: "Nguyễn Văn A", initials: "NA" }],
            attachments: 2,
          },
        ],
      },
      {
        id: "col-3",
        name: "Đã hoàn thành",
        cards: [
          {
            id: "card-5",
            title: "Xác định ngân sách",
            labels: ["#61bd4f"],
            description: "Lập kế hoạch ngân sách cho chiến dịch Q3",
            members: [
              { id: "1", name: "Nguyễn Văn A", initials: "NA" },
              { id: "5", name: "Hoàng Văn E", initials: "HE" },
            ],
            comments: 1,
          },
        ],
      },
    ],
  },
  // ... Thêm các bảng khác, có thể lấy từ dữ liệu mẫu trước đó
]

// Tạo thêm các bảng để đủ 23 bảng
// Bảng 3 đến 23

for (let i = 3; i <= 23; i++) {
  if (!boards.find((board) => board.id === i.toString())) {
    boards.push({
      id: i.toString(),
      name: `Bảng ${i}`,
      description: `Mô tả cho Bảng ${i}`,
      totalTasks: Math.floor(Math.random() * 20) + 1,
      color: ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899", "#06b6d4"][
        Math.floor(Math.random() * 7)
      ],
      members: Math.floor(Math.random() * 5) + 1,
      columns: [
        {
          id: `col-1-board-${i}`,
          name: "Cần làm",
          cards: [
            {
              id: `card-1-board-${i}`,
              title: `Công việc mẫu 1 - Bảng ${i}`,
              labels: ["#61bd4f"],
              description: `Mô tả công việc mẫu 1 - Bảng ${i}`,
            },
            {
              id: `card-2-board-${i}`,
              title: `Công việc mẫu 2 - Bảng ${i}`,
              labels: ["#ff9f1a"],
              description: `Mô tả công việc mẫu 2 - Bảng ${i}`,
            },
          ],
        },
        {
          id: `col-2-board-${i}`,
          name: "Đang thực hiện",
          cards: [
            {
              id: `card-3-board-${i}`,
              title: `Công việc mẫu 3 - Bảng ${i}`,
              labels: ["#eb5a46"],
              description: `Mô tả công việc mẫu 3 - Bảng ${i}`,
            },
          ],
        },
        {
          id: `col-3-board-${i}`,
          name: "Đã hoàn thành",
          cards: [],
        },
      ],
    })
  }
}
