"use client"

import { useState, useEffect } from "react"
import type { Board, Column, Card, ApiResponse } from "@/types"

export function useBoardDetail(boardId: string) {
  const [board, setBoard] = useState<Board | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/boards/${boardId}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch board")
        }

        const data = await response.json()
        setBoard(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    if (boardId) {
      fetchBoard()
    }
  }, [boardId])

  const updateBoard = async (boardData: Partial<Board>): Promise<ApiResponse<Board>> => {
    try {
      const response = await fetch(`/api/boards/${boardId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(boardData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          error: data.error || "Failed to update board",
          status: response.status,
        }
      }

      // Cập nhật state
      setBoard(data)

      return {
        data,
        status: response.status,
        message: "Board updated successfully",
      }
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "An unexpected error occurred",
        status: 500,
      }
    }
  }

  const addColumn = async (columnData: Omit<Column, "id">): Promise<ApiResponse<Column>> => {
    try {
      const response = await fetch(`/api/boards/${boardId}/columns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(columnData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          error: data.error || "Failed to add column",
          status: response.status,
        }
      }

      // Cập nhật state
      setBoard((prev) => {
        if (!prev) return null

        const updatedColumns = [...(prev.columns || []), data]
        return { ...prev, columns: updatedColumns }
      })

      return {
        data,
        status: response.status,
        message: "Column added successfully",
      }
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "An unexpected error occurred",
        status: 500,
      }
    }
  }

  const updateColumn = async (columnId: string, columnData: Partial<Column>): Promise<ApiResponse<Column>> => {
    try {
      const response = await fetch(`/api/boards/${boardId}/columns/${columnId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(columnData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          error: data.error || "Failed to update column",
          status: response.status,
        }
      }

      // Cập nhật state
      setBoard((prev) => {
        if (!prev || !prev.columns) return prev

        const updatedColumns = prev.columns.map((column) => (column.id === columnId ? { ...column, ...data } : column))

        return { ...prev, columns: updatedColumns }
      })

      return {
        data,
        status: response.status,
        message: "Column updated successfully",
      }
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "An unexpected error occurred",
        status: 500,
      }
    }
  }

  const deleteColumn = async (columnId: string): Promise<ApiResponse<Column>> => {
    try {
      const response = await fetch(`/api/boards/${boardId}/columns/${columnId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          error: data.error || "Failed to delete column",
          status: response.status,
        }
      }

      // Cập nhật state
      setBoard((prev) => {
        if (!prev || !prev.columns) return prev

        const updatedColumns = prev.columns.filter((column) => column.id !== columnId)
        return { ...prev, columns: updatedColumns }
      })

      return {
        data,
        status: response.status,
        message: "Column deleted successfully",
      }
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "An unexpected error occurred",
        status: 500,
      }
    }
  }

  const addCard = async (columnId: string, cardData: Omit<Card, "id">): Promise<ApiResponse<Card>> => {
    try {
      const response = await fetch(`/api/boards/${boardId}/columns/${columnId}/cards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cardData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          error: data.error || "Failed to add card",
          status: response.status,
        }
      }

      // Cập nhật state
      setBoard((prev) => {
        if (!prev || !prev.columns) return prev

        const updatedColumns = prev.columns.map((column) => {
          if (column.id === columnId) {
            return {
              ...column,
              cards: [...column.cards, data],
            }
          }
          return column
        })

        return { ...prev, columns: updatedColumns }
      })

      return {
        data,
        status: response.status,
        message: "Card added successfully",
      }
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "An unexpected error occurred",
        status: 500,
      }
    }
  }

  const updateCard = async (columnId: string, cardId: string, cardData: Partial<Card>): Promise<ApiResponse<Card>> => {
    try {
      const response = await fetch(`/api/boards/${boardId}/columns/${columnId}/cards/${cardId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cardData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          error: data.error || "Failed to update card",
          status: response.status,
        }
      }

      // Cập nhật state
      setBoard((prev) => {
        if (!prev || !prev.columns) return prev

        const updatedColumns = prev.columns.map((column) => {
          if (column.id === columnId) {
            const updatedCards = column.cards.map((card) => (card.id === cardId ? { ...card, ...data } : card))
            return { ...column, cards: updatedCards }
          }
          return column
        })

        return { ...prev, columns: updatedColumns }
      })

      return {
        data,
        status: response.status,
        message: "Card updated successfully",
      }
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "An unexpected error occurred",
        status: 500,
      }
    }
  }

  const deleteCard = async (columnId: string, cardId: string): Promise<ApiResponse<Card>> => {
    try {
      const response = await fetch(`/api/boards/${boardId}/columns/${columnId}/cards/${cardId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          error: data.error || "Failed to delete card",
          status: response.status,
        }
      }

      // Cập nhật state
      setBoard((prev) => {
        if (!prev || !prev.columns) return prev

        const updatedColumns = prev.columns.map((column) => {
          if (column.id === columnId) {
            const updatedCards = column.cards.filter((card) => card.id !== cardId)
            return { ...column, cards: updatedCards }
          }
          return column
        })

        return { ...prev, columns: updatedColumns }
      })

      return {
        data,
        status: response.status,
        message: "Card deleted successfully",
      }
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "An unexpected error occurred",
        status: 500,
      }
    }
  }

  const moveCard = async (
    sourceColumnId: string,
    destinationColumnId: string,
    cardId: string,
  ): Promise<ApiResponse<Card>> => {
    try {
      const response = await fetch(`/api/boards/${boardId}/columns/${sourceColumnId}/cards/${cardId}/move`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ destinationColumnId }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          error: data.error || "Failed to move card",
          status: response.status,
        }
      }

      // Cập nhật state
      setBoard((prev) => {
        if (!prev || !prev.columns) return prev

        const updatedColumns = prev.columns.map((column) => {
          // Xóa card khỏi cột nguồn
          if (column.id === sourceColumnId) {
            return {
              ...column,
              cards: column.cards.filter((card) => card.id !== cardId),
            }
          }

          // Thêm card vào cột đích
          if (column.id === destinationColumnId) {
            return {
              ...column,
              cards: [...column.cards, data],
            }
          }

          return column
        })

        return { ...prev, columns: updatedColumns }
      })

      return {
        data,
        status: response.status,
        message: "Card moved successfully",
      }
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "An unexpected error occurred",
        status: 500,
      }
    }
  }

  return {
    board,
    isLoading,
    error,
    updateBoard,
    addColumn,
    updateColumn,
    deleteColumn,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
  }
}
