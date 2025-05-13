"use client"

import { useState, useEffect } from "react"
import type { Collection, Board, ApiResponse } from "@/types"

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/collections")

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch collections")
        }

        const data = await response.json()
        setCollections(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCollections()
  }, [])

  const getCollectionById = async (id: string): Promise<ApiResponse<Collection>> => {
    try {
      const response = await fetch(`/api/collections/${id}`)

      if (!response.ok) {
        const errorData = await response.json()
        return {
          error: errorData.error || "Failed to fetch collection",
          status: response.status,
        }
      }

      const data = await response.json()

      return {
        data,
        status: response.status,
      }
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "An unexpected error occurred",
        status: 500,
      }
    }
  }

  const getBoardsByCollectionId = async (id: string): Promise<ApiResponse<Board[]>> => {
    try {
      const response = await fetch(`/api/collections/${id}/boards`)

      if (!response.ok) {
        const errorData = await response.json()
        return {
          error: errorData.error || "Failed to fetch boards for collection",
          status: response.status,
        }
      }

      const data = await response.json()

      return {
        data,
        status: response.status,
      }
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "An unexpected error occurred",
        status: 500,
      }
    }
  }

  const createCollection = async (collectionData: Omit<Collection, "id">): Promise<ApiResponse<Collection>> => {
    try {
      const response = await fetch("/api/collections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(collectionData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          error: data.error || "Failed to create collection",
          status: response.status,
        }
      }

      // Cập nhật state
      setCollections((prev) => [...prev, data])

      return {
        data,
        status: response.status,
        message: "Collection created successfully",
      }
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "An unexpected error occurred",
        status: 500,
      }
    }
  }

  const updateCollection = async (
    id: string,
    collectionData: Partial<Collection>,
  ): Promise<ApiResponse<Collection>> => {
    try {
      const response = await fetch(`/api/collections/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(collectionData),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          error: data.error || "Failed to update collection",
          status: response.status,
        }
      }

      // Cập nhật state
      setCollections((prev) => prev.map((collection) => (collection.id === id ? data : collection)))

      return {
        data,
        status: response.status,
        message: "Collection updated successfully",
      }
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "An unexpected error occurred",
        status: 500,
      }
    }
  }

  const deleteCollection = async (id: string): Promise<ApiResponse<Collection>> => {
    try {
      const response = await fetch(`/api/collections/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          error: data.error || "Failed to delete collection",
          status: response.status,
        }
      }

      // Cập nhật state
      setCollections((prev) => prev.filter((collection) => collection.id !== id))

      return {
        data,
        status: response.status,
        message: "Collection deleted successfully",
      }
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "An unexpected error occurred",
        status: 500,
      }
    }
  }

  const addBoardToCollection = async (collectionId: string, boardId: string): Promise<ApiResponse<Board>> => {
    try {
      const response = await fetch(`/api/collections/${collectionId}/boards/${boardId}`, {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          error: data.error || "Failed to add board to collection",
          status: response.status,
        }
      }

      // Cập nhật state - tăng số lượng bảng trong bộ sưu tập
      setCollections((prev) =>
        prev.map((collection) => {
          if (collection.id === collectionId) {
            return { ...collection, boardCount: collection.boardCount + 1 }
          }
          return collection
        }),
      )

      return {
        data,
        status: response.status,
        message: "Board added to collection successfully",
      }
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "An unexpected error occurred",
        status: 500,
      }
    }
  }

  const removeBoardFromCollection = async (collectionId: string, boardId: string): Promise<ApiResponse<Board>> => {
    try {
      const response = await fetch(`/api/collections/${collectionId}/boards/${boardId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          error: data.error || "Failed to remove board from collection",
          status: response.status,
        }
      }

      // Cập nhật state - giảm số lượng bảng trong bộ sưu tập
      setCollections((prev) =>
        prev.map((collection) => {
          if (collection.id === collectionId && collection.boardCount > 0) {
            return { ...collection, boardCount: collection.boardCount - 1 }
          }
          return collection
        }),
      )

      return {
        data,
        status: response.status,
        message: "Board removed from collection successfully",
      }
    } catch (err) {
      return {
        error: err instanceof Error ? err.message : "An unexpected error occurred",
        status: 500,
      }
    }
  }

  return {
    collections,
    isLoading,
    error,
    getCollectionById,
    getBoardsByCollectionId,
    createCollection,
    updateCollection,
    deleteCollection,
    addBoardToCollection,
    removeBoardFromCollection,
  }
}
