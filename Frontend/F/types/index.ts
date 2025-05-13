// Định nghĩa kiểu dữ liệu
export type User = {
  id: string
  name: string
  email?: string
  initials: string
  avatar?: string
  role?: "admin" | "editor" | "viewer"
}

export type Label = {
  id: string
  name?: string
  color: string
}

export type CardMember = {
  id: string
  name: string
  avatar?: string
  initials: string
}

export type Card = {
  id: string
  title: string
  description?: string
  labels: string[] | Label[]
  dueDate?: string
  members?: CardMember[]
  attachments?: number
  comments?: number
  order?: number
  columnId?: string
}

export type Column = {
  id: string
  name: string
  cards: Card[]
  order?: number
  boardId?: string
}

export type Board = {
  id: string
  name: string
  description: string
  totalTasks: number
  color: string
  members?: number
  columns?: Column[]
  createdAt?: string
  updatedAt?: string
}

export type Collection = {
  id: string
  name: string
  description?: string
  boardCount: number
  color: string
  icon?: string
  updatedAt?: string
}

export type Comment = {
  id: string
  user: {
    name: string
    avatar?: string
    initials: string
  }
  text: string
  time: string
  isCurrentUser?: boolean
}

export type Activity = {
  id: string
  user: {
    id?: string
    name: string
    initials: string
    avatar?: string
  }
  action: string
  time: string
  boardId?: string
  boardName?: string
  cardId?: string
  cardName?: string
  columnId?: string
  columnName?: string
  before?: string
  after?: string
  comments?: Comment[]
  liked?: boolean
  timestamp?: number
  type?: "card" | "board" | "comment" | "member" | "other"
  read?: boolean
}

export type ApiResponse<T> = {
  data?: T
  error?: string
  message?: string
  status: number
}

export type Project = {
  id: string
  name: string
  totalTasks: number
  completedTasks: number
  color: string
}
