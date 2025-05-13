"use client"

import { useState, useEffect } from "react"
import type { Board, ApiResponse } from "@/types"

export function useBoards() {
  const [boards, setBoards] = useState<Board[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/boards")

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch boards")
        }

        const data = await response.json()
        setBoards(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBoards()
  }, [])

  const createBoard = async (boardData: Omit<Board, "id">): Promise<ApiResponse<Board>> => {
    try {
      const response = await fetch("/api/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(boardData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          error: data.error || "Failed to create board",
          status: response.status,
        }
      }

      // Cập nhật state
      setBoards((prev) => [...prev, data])

      return {
        data,
        status: response.status,
        message: "Board created successfully",
      }
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "An unexpected error occurred",
        status: 500,
      }
    }
  }

  const updateBoard = async (id: string, boardData: Partial<Board>): Promise<ApiResponse<Board>> => {
    try {
      const response = await fetch(`/api/boards/${id}`, {
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
      setBoards((prev) => prev.map((board) => (board.id === id ? data : board)))

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

  const deleteBoard = async (id: string): Promise<ApiResponse<Board>> => {
    try {
      const response = await fetch(`/api/boards/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          error: data.error || "Failed to delete board",
          status: response.status,
        }
      }

      // Cập nhật state
      setBoards((prev) => prev.filter((board) => board.id !== id))

      return {
        data,
        status: response.status,
        message: "Board deleted successfully",
      }
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "An unexpected error occurred",
        status: 500,
      }
    }
  }

  return {
    boards,
    isLoading,
    error,
    createBoard,
    updateBoard,
    deleteBoard,
  }
}
