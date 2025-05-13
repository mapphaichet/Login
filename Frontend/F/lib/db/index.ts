import type { Board, Card, Collection, Column, User, Activity } from "@/types"
import { boards as boardsData } from "./boards"
import { collections as collectionsData } from "./collections"
import { activities as activitiesData } from "./activities"
import { users as usersData } from "./users"

// Mô phỏng database trong memory
let boards: Board[] = [...boardsData]
let collections: Collection[] = [...collectionsData]
let activities: Activity[] = [...activitiesData]
let users: User[] = [...usersData]

export const db = {
  // Các hàm liên quan đến bảng
  boards: {
    getAll: () => [...boards],
    getById: (id: string) => boards.find((board) => board.id === id),
    create: (board: Omit<Board, "id">) => {
      const newBoard = { ...board, id: `board-${Date.now()}` }
      boards.push(newBoard as Board)
      return newBoard
    },
    update: (id: string, data: Partial<Board>) => {
      boards = boards.map((board) => (board.id === id ? { ...board, ...data } : board))
      return boards.find((board) => board.id === id)
    },
    delete: (id: string) => {
      const board = boards.find((board) => board.id === id)
      boards = boards.filter((board) => board.id !== id)
      return board
    },
  },

  // Các hàm liên quan đến cột
  columns: {
    getByBoardId: (boardId: string) => {
      const board = boards.find((board) => board.id === boardId)
      return board?.columns || []
    },
    create: (boardId: string, column: Omit<Column, "id">) => {
      const board = boards.find((board) => board.id === boardId)
      if (!board || !board.columns) return null

      const newColumn = {
        ...column,
        id: `column-${Date.now()}`,
        cards: column.cards || [],
        boardId,
      }

      board.columns.push(newColumn as Column)
      return newColumn
    },
    update: (boardId: string, columnId: string, data: Partial<Column>) => {
      const board = boards.find((board) => board.id === boardId)
      if (!board || !board.columns) return null

      board.columns = board.columns.map((column) => (column.id === columnId ? { ...column, ...data } : column))

      return board.columns.find((column) => column.id === columnId)
    },
    delete: (boardId: string, columnId: string) => {
      const board = boards.find((board) => board.id === boardId)
      if (!board || !board.columns) return null

      const column = board.columns.find((column) => column.id === columnId)
      board.columns = board.columns.filter((column) => column.id !== columnId)

      return column
    },
  },

  // Các hàm liên quan đến thẻ
  cards: {
    getByColumnId: (columnId: string, boardId: string) => {
      const board = boards.find((board) => board.id === boardId)
      if (!board || !board.columns) return []

      const column = board.columns.find((column) => column.id === columnId)
      return column?.cards || []
    },
    create: (columnId: string, boardId: string, card: Omit<Card, "id">) => {
      const board = boards.find((board) => board.id === boardId)
      if (!board || !board.columns) return null

      const column = board.columns.find((column) => column.id === columnId)
      if (!column) return null

      const newCard = {
        ...card,
        id: `card-${Date.now()}`,
        columnId,
      }

      column.cards.push(newCard as Card)
      return newCard
    },
    update: (cardId: string, columnId: string, boardId: string, data: Partial<Card>) => {
      const board = boards.find((board) => board.id === boardId)
      if (!board || !board.columns) return null

      const column = board.columns.find((column) => column.id === columnId)
      if (!column) return null

      column.cards = column.cards.map((card) => (card.id === cardId ? { ...card, ...data } : card))

      return column.cards.find((card) => card.id === cardId)
    },
    delete: (cardId: string, columnId: string, boardId: string) => {
      const board = boards.find((board) => board.id === boardId)
      if (!board || !board.columns) return null

      const column = board.columns.find((column) => column.id === columnId)
      if (!column) return null

      const card = column.cards.find((card) => card.id === cardId)
      column.cards = column.cards.filter((card) => card.id !== cardId)

      return card
    },
    move: (cardId: string, sourceColumnId: string, destinationColumnId: string, boardId: string) => {
      const board = boards.find((board) => board.id === boardId)
      if (!board || !board.columns) return null

      const sourceColumn = board.columns.find((column) => column.id === sourceColumnId)
      const destinationColumn = board.columns.find((column) => column.id === destinationColumnId)

      if (!sourceColumn || !destinationColumn) return null

      const card = sourceColumn.cards.find((card) => card.id === cardId)
      if (!card) return null

      // Xóa card từ cột nguồn
      sourceColumn.cards = sourceColumn.cards.filter((card) => card.id !== cardId)

      // Thêm card vào cột đích
      destinationColumn.cards.push({ ...card, columnId: destinationColumnId })

      return card
    },
  },

  // Các hàm liên quan đến bộ sưu tập
  collections: {
    getAll: () => [...collections],
    getById: (id: string) => collections.find((collection) => collection.id === id),
    create: (collection: Omit<Collection, "id">) => {
      const newCollection = { ...collection, id: `collection-${Date.now()}` }
      collections.push(newCollection as Collection)
      return newCollection
    },
    update: (id: string, data: Partial<Collection>) => {
      collections = collections.map((collection) => (collection.id === id ? { ...collection, ...data } : collection))
      return collections.find((collection) => collection.id === id)
    },
    delete: (id: string) => {
      const collection = collections.find((collection) => collection.id === id)
      collections = collections.filter((collection) => collection.id !== id)
      return collection
    },
    getBoardsByCollectionId: (collectionId: string) => {
      // Giả định rằng có một trường collectionId trong boards
      return boards.filter((board) => (board as any).collectionId === collectionId)
    },
  },

  // Các hàm liên quan đến hoạt động
  activities: {
    getAll: () => [...activities],
    getByBoardId: (boardId: string) => activities.filter((activity) => activity.boardId === boardId),
    create: (activity: Omit<Activity, "id">) => {
      const newActivity = {
        ...activity,
        id: `activity-${Date.now()}`,
        timestamp: Date.now(),
      }
      activities.unshift(newActivity as Activity)
      return newActivity
    },
    update: (id: string, data: Partial<Activity>) => {
      activities = activities.map((activity) => (activity.id === id ? { ...activity, ...data } : activity))
      return activities.find((activity) => activity.id === id)
    },
    delete: (id: string) => {
      const activity = activities.find((activity) => activity.id === id)
      activities = activities.filter((activity) => activity.id !== id)
      return activity
    },
  },

  // Các hàm liên quan đến người dùng
  users: {
    getAll: () => [...users],
    getById: (id: string) => users.find((user) => user.id === id),
    create: (user: Omit<User, "id">) => {
      const newUser = { ...user, id: `user-${Date.now()}` }
      users.push(newUser as User)
      return newUser
    },
    update: (id: string, data: Partial<User>) => {
      users = users.map((user) => (user.id === id ? { ...user, ...data } : user))
      return users.find((user) => user.id === id)
    },
    delete: (id: string) => {
      const user = users.find((user) => user.id === id)
      users = users.filter((user) => user.id !== id)
      return user
    },
  },
}
