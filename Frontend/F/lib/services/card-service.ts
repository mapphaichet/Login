import { db } from "@/lib/db"
import type { ApiResponse, Card } from "@/types"

const A200 = 200

export const cardService = {
  getCardsByColumn: async (boardId: string, columnId: string): Promise<ApiResponse<Card[]>> => {
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

      return {
        data: column.cards || [],
        status: 200,
      }
    } catch (error) {
      return {
        error: "Failed to fetch cards",
        status: 500,
      }
    }
  },

  getCardById: async (boardId: string, columnId: string, cardId: string): Promise<ApiResponse<Card>> => {
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

      const card = column.cards.find((card) => card.id === cardId)

      if (!card) {
        return {
          error: "Card not found",
          status: 404,
        }
      }

      return {
        data: card,
        status: 200,
      }
    } catch (error) {
      return {
        error: "Failed to fetch card",
        status: 500,
      }
    }
  },

  addCard: async (boardId: string, columnId: string, cardData: Omit<Card, "id">): Promise<ApiResponse<Card>> => {
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

      const newCard = db.cards.create(columnId, boardId, cardData)

      // Thêm hoạt động
      db.activities.create({
        user: {
          name: "Người dùng hiện tại",
          initials: "ND",
        },
        action: `đã thêm thẻ "${newCard.title}" vào cột "${column.name}" trong bảng "${board.name}"`,
        time: "Vừa xong",
        boardId: board.id,
        boardName: board.name,
        columnId: column.id,
        columnName: column.name,
        cardId: newCard.id,
        cardName: newCard.title,
        type: "card",
      })

      return {
        data: newCard,
        status: 201,
        message: "Card added successfully",
      }
    } catch (error) {
      return {
        error: "Failed to add card",
        status: 500,
      }
    }
  },

  updateCard: async (
    boardId: string,
    columnId: string,
    cardId: string,
    data: Partial<Card>,
  ): Promise<ApiResponse<Card>> => {
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

      const card = column.cards.find((c) => c.id === cardId)

      if (!card) {
        return {
          error: "Card not found",
          status: 404,
        }
      }

      const updatedCard = db.cards.update(cardId, columnId, boardId, data)

      // Thêm hoạt động nếu tiêu đề thẻ thay đổi
      if (data.title && data.title !== card.title) {
        db.activities.create({
          user: {
            name: "Người dùng hiện tại",
            initials: "ND",
          },
          action: `đã đổi tên thẻ từ "${card.title}" thành "${data.title}" trong bảng "${board.name}"`,
          time: "Vừa xong",
          boardId: board.id,
          boardName: board.name,
          columnId: column.id,
          columnName: column.name,
          cardId: cardId,
          cardName: data.title,
          before: card.title,
          after: data.title,
          type: "card",
        })
      }

      return {
        data: updatedCard,
        status: 200,
        message: "Card updated successfully",
      }
    } catch (error) {
      return {
        error: "Failed to update card",
        status: 500,
      }
    }
  },

  deleteCard: async (boardId: string, columnId: string, cardId: string): Promise<ApiResponse<Card>> => {
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

      const card = column.cards.find((c) => c.id === cardId)

      if (!card) {
        return {
          error: "Card not found",
          status: 404,
        }
      }

      const deletedCard = db.cards.delete(cardId, columnId, boardId)

      // Thêm hoạt động
      db.activities.create({
        user: {
          name: "Người dùng hiện tại",
          initials: "ND",
        },
        action: `đã xóa thẻ "${deletedCard.title}" khỏi bảng "${board.name}"`,
        time: "Vừa xong",
        boardId: board.id,
        boardName: board.name,
        columnId: column.id,
        columnName: column.name,
        type: "card",
      })

      return {
        data: deletedCard,
        status: 200,
        message: "Card deleted successfully",
      }
    } catch (error) {
      return {
        error: "Failed to delete card",
        status: 500,
      }
    }
  },

  moveCard: async (
    boardId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    cardId: string,
  ): Promise<ApiResponse<Card>> => {
    try {
      const board = db.boards.getById(boardId)

      if (!board) {
        return {
          error: "Board not found",
          status: 404,
        }
      }

      const sourceColumn = board.columns?.find((col) => col.id === sourceColumnId)
      const destinationColumn = board.columns?.find((col) => col.id === destinationColumnId)

      if (!sourceColumn || !destinationColumn) {
        return {
          error: "Column not found",
          status: 404,
        }
      }

      const card = sourceColumn.cards.find((c) => c.id === cardId)

      if (!card) {
        return {
          error: "Card not found",
          status: 404,
        }
      }

      const movedCard = db.cards.move(cardId, sourceColumnId, destinationColumnId, boardId)

      // Thêm hoạt động
      db.activities.create({
        user: {
          name: "Người dùng hiện tại",
          initials: "ND",
        },
        action: `đã di chuyển thẻ "${card.title}" từ cột "${sourceColumn.name}" sang cột "${destinationColumn.name}"`,
        time: "Vừa xong",
        boardId: board.id,
        boardName: board.name,
        columnId: destinationColumnId,
        columnName: destinationColumn.name,
        cardId: cardId,
        cardName: card.title,
        before: sourceColumn.name,
        after: destinationColumn.name,
        type: "card",
      })

      return {
        data: movedCard,
        status: A200,
        message: "Card moved successfully",
      }
    } catch (error) {
      return {
        error: "Failed to move card",
        status: 500,
      }
    }
  },
}
