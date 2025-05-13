import { db } from "@/lib/db"
import type { ApiResponse, Board, Column } from "@/types"

export const boardService = {
  getAllBoards: async (): Promise<ApiResponse<Board[]>> => {
    try {
      const boards = db.boards.getAll()
      return {
        data: boards,
        status: 200,
      }
    } catch (error) {
      return {
        error: "Failed to fetch boards",
        status: 500,
      }
    }
  },

  getBoardById: async (id: string): Promise<ApiResponse<Board>> => {
    try {
      const board = db.boards.getById(id)

      if (!board) {
        return {
          error: "Board not found",
          status: 404,
        }
      }

      return {
        data: board,
        status: 200,
      }
    } catch (error) {
      return {
        error: "Failed to fetch board",
        status: 500,
      }
    }
  },

  createBoard: async (boardData: Omit<Board, "id">): Promise<ApiResponse<Board>> => {
    try {
      const newBoard = db.boards.create(boardData)

      // Thêm hoạt động
      db.activities.create({
        user: {
          name: "Người dùng hiện tại",
          initials: "ND",
        },
        action: `đã tạo bảng mới "${newBoard.name}"`,
        time: "Vừa xong",
        boardId: newBoard.id,
        boardName: newBoard.name,
        type: "board",
      })

      return {
        data: newBoard,
        status: 201,
        message: "Board created successfully",
      }
    } catch (error) {
      return {
        error: "Failed to create board",
        status: 500,
      }
    }
  },

  updateBoard: async (id: string, data: Partial<Board>): Promise<ApiResponse<Board>> => {
    try {
      const board = db.boards.getById(id)

      if (!board) {
        return {
          error: "Board not found",
          status: 404,
        }
      }

      const updatedBoard = db.boards.update(id, data)

      // Thêm hoạt động
      db.activities.create({
        user: {
          name: "Người dùng hiện tại",
          initials: "ND",
        },
        action: `đã cập nhật bảng "${updatedBoard.name}"`,
        time: "Vừa xong",
        boardId: updatedBoard.id,
        boardName: updatedBoard.name,
        type: "board",
      })

      return {
        data: updatedBoard,
        status: 200,
        message: "Board updated successfully",
      }
    } catch (error) {
      return {
        error: "Failed to update board",
        status: 500,
      }
    }
  },

  deleteBoard: async (id: string): Promise<ApiResponse<Board>> => {
    try {
      const board = db.boards.getById(id)

      if (!board) {
        return {
          error: "Board not found",
          status: 404,
        }
      }

      const deletedBoard = db.boards.delete(id)

      // Thêm hoạt động
      db.activities.create({
        user: {
          name: "Người dùng hiện tại",
          initials: "ND",
        },
        action: `đã xóa bảng "${deletedBoard.name}"`,
        time: "Vừa xong",
        type: "board",
      })

      return {
        data: deletedBoard,
        status: 200,
        message: "Board deleted successfully",
      }
    } catch (error) {
      return {
        error: "Failed to delete board",
        status: 500,
      }
    }
  },

  // Các hàm liên quan đến cột
  getColumns: async (boardId: string): Promise<ApiResponse<Column[]>> => {
    try {
      const board = db.boards.getById(boardId)

      if (!board) {
        return {
          error: "Board not found",
          status: 404,
        }
      }

      return {
        data: board.columns || [],
        status: 200,
      }
    } catch (error) {
      return {
        error: "Failed to fetch columns",
        status: 500,
      }
    }
  },

  addColumn: async (boardId: string, columnData: Omit<Column, "id">): Promise<ApiResponse<Column>> => {
    try {
      const board = db.boards.getById(boardId)

      if (!board) {
        return {
          error: "Board not found",
          status: 404,
        }
      }

      const newColumn = db.columns.create(boardId, columnData)

      // Thêm hoạt động
      db.activities.create({
        user: {
          name: "Người dùng hiện tại",
          initials: "ND",
        },
        action: `đã thêm cột "${newColumn.name}" vào bảng "${board.name}"`,
        time: "Vừa xong",
        boardId: board.id,
        boardName: board.name,
        columnId: newColumn.id,
        columnName: newColumn.name,
        type: "board",
      })

      return {
        data: newColumn,
        status: 201,
        message: "Column added successfully",
      }
    } catch (error) {
      return {
        error: "Failed to add column",
        status: 500,
      }
    }
  },

  updateColumn: async (boardId: string, columnId: string, data: Partial<Column>): Promise<ApiResponse<Column>> => {
    try {
      const board = db.boards.getById(boardId)

      if (!board) {
        return {
          error: "Board not found",
          status: 404,
        }
      }

      const column = board.columns?.find((col) => col.id === columnId)

      if (!column) {
        return {
          error: "Column not found",
          status: 404,
        }
      }

      const updatedColumn = db.columns.update(boardId, columnId, data)

      // Thêm hoạt động nếu tên cột thay đổi
      if (data.name && data.name !== column.name) {
        db.activities.create({
          user: {
            name: "Người dùng hiện tại",
            initials: "ND",
          },
          action: `đã đổi tên cột từ "${column.name}" thành "${data.name}" trong bảng "${board.name}"`,
          time: "Vừa xong",
          boardId: board.id,
          boardName: board.name,
          columnId: columnId,
          columnName: data.name,
          before: column.name,
          after: data.name,
          type: "board",
        })
      }

      return {
        data: updatedColumn,
        status: 200,
        message: "Column updated successfully",
      }
    } catch (error) {
      return {
        error: "Failed to update column",
        status: 500,
      }
    }
  },

  deleteColumn: async (boardId: string, columnId: string): Promise<ApiResponse<Column>> => {
    try {
      const board = db.boards.getById(boardId)

      if (!board) {
        return {
          error: "Board not found",
          status: 404,
        }
      }

      const column = board.columns?.find((col) => col.id === columnId)

      if (!column) {
        return {
          error: "Column not found",
          status: 404,
        }
      }

      const deletedColumn = db.columns.delete(boardId, columnId)

      // Thêm hoạt động
      db.activities.create({
        user: {
          name: "Người dùng hiện tại",
          initials: "ND",
        },
        action: `đã xóa cột "${deletedColumn.name}" khỏi bảng "${board.name}"`,
        time: "Vừa xong",
        boardId: board.id,
        boardName: board.name,
        columnId: columnId,
        columnName: deletedColumn.name,
        type: "board",
      })

      return {
        data: deletedColumn,
        status: 200,
        message: "Column deleted successfully",
      }
    } catch (error) {
      return {
        error: "Failed to delete column",
        status: 500,
      }
    }
  },
}
