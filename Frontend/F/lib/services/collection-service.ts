import { db } from "@/lib/db"
import type { ApiResponse, Collection, Board } from "@/types"

export const collectionService = {
  getAllCollections: async (): Promise<ApiResponse<Collection[]>> => {
    try {
      const collections = db.collections.getAll()
      return {
        data: collections,
        status: 200,
      }
    } catch (error) {
      return {
        error: "Failed to fetch collections",
        status: 500,
      }
    }
  },

  getCollectionById: async (id: string): Promise<ApiResponse<Collection>> => {
    try {
      const collection = db.collections.getById(id)

      if (!collection) {
        return {
          error: "Collection not found",
          status: 404,
        }
      }

      return {
        data: collection,
        status: 200,
      }
    } catch (error) {
      return {
        error: "Failed to fetch collection",
        status: 500,
      }
    }
  },

  getBoardsByCollectionId: async (collectionId: string): Promise<ApiResponse<Board[]>> => {
    try {
      const collection = db.collections.getById(collectionId)

      if (!collection) {
        return {
          error: "Collection not found",
          status: 404,
        }
      }

      // Lấy các bảng cho bộ sưu tập này
      // Cho mục đích demo, chúng ta sẽ lấy một số bảng đầu tiên từ danh sách bảng
      const boards = db.boards
        .getAll()
        .slice(0, collection.boardCount)
        .map((board) => ({
          ...board,
          collectionId, // Thêm trường collectionId vào mỗi bảng
        }))

      return {
        data: boards,
        status: 200,
      }
    } catch (error) {
      return {
        error: "Failed to fetch boards for collection",
        status: 500,
      }
    }
  },

  createCollection: async (collectionData: Omit<Collection, "id">): Promise<ApiResponse<Collection>> => {
    try {
      const newCollection = db.collections.create(collectionData)

      // Thêm hoạt động
      db.activities.create({
        user: {
          name: "Người dùng hiện tại",
          initials: "ND",
        },
        action: `đã tạo bộ sưu tập mới "${newCollection.name}"`,
        time: "Vừa xong",
        type: "other",
      })

      return {
        data: newCollection,
        status: 201,
        message: "Collection created successfully",
      }
    } catch (error) {
      return {
        error: "Failed to create collection",
        status: 500,
      }
    }
  },

  updateCollection: async (id: string, data: Partial<Collection>): Promise<ApiResponse<Collection>> => {
    try {
      const collection = db.collections.getById(id)

      if (!collection) {
        return {
          error: "Collection not found",
          status: 404,
        }
      }

      const updatedCollection = db.collections.update(id, data)

      // Thêm hoạt động nếu tên bộ sưu tập thay đổi
      if (data.name && data.name !== collection.name) {
        db.activities.create({
          user: {
            name: "Người dùng hiện tại",
            initials: "ND",
          },
          action: `đã đổi tên bộ sưu tập từ "${collection.name}" thành "${data.name}"`,
          time: "Vừa xong",
          before: collection.name,
          after: data.name,
          type: "other",
        })
      }

      return {
        data: updatedCollection,
        status: 200,
        message: "Collection updated successfully",
      }
    } catch (error) {
      return {
        error: "Failed to update collection",
        status: 500,
      }
    }
  },

  deleteCollection: async (id: string): Promise<ApiResponse<Collection>> => {
    try {
      const collection = db.collections.getById(id)

      if (!collection) {
        return {
          error: "Collection not found",
          status: 404,
        }
      }

      const deletedCollection = db.collections.delete(id)

      // Thêm hoạt động
      db.activities.create({
        user: {
          name: "Người dùng hiện tại",
          initials: "ND",
        },
        action: `đã xóa bộ sưu tập "${deletedCollection.name}"`,
        time: "Vừa xong",
        type: "other",
      })

      return {
        data: deletedCollection,
        status: 200,
        message: "Collection deleted successfully",
      }
    } catch (error) {
      return {
        error: "Failed to delete collection",
        status: 500,
      }
    }
  },

  addBoardToCollection: async (collectionId: string, boardId: string): Promise<ApiResponse<Board>> => {
    try {
      const collection = db.collections.getById(collectionId)
      if (!collection) {
        return {
          error: "Collection not found",
          status: 404,
        }
      }

      const board = db.boards.getById(boardId)
      if (!board) {
        return {
          error: "Board not found",
          status: 404,
        }
      }

      // Giả lập thêm bảng vào bộ sưu tập
      // Trong ứng dụng thực tế, bạn sẽ cần cập nhật database

      // Thêm hoạt động
      db.activities.create({
        user: {
          name: "Người dùng hiện tại",
          initials: "ND",
        },
        action: `đã thêm bảng "${board.name}" vào bộ sưu tập "${collection.name}"`,
        time: "Vừa xong",
        boardId: board.id,
        boardName: board.name,
        type: "board",
      })

      // Tăng số lượng bảng trong bộ sưu tập
      db.collections.update(collectionId, { boardCount: collection.boardCount + 1 })

      return {
        data: { ...board, collectionId },
        status: 200,
        message: "Board added to collection successfully",
      }
    } catch (error) {
      return {
        error: "Failed to add board to collection",
        status: 500,
      }
    }
  },

  removeBoardFromCollection: async (collectionId: string, boardId: string): Promise<ApiResponse<Board>> => {
    try {
      const collection = db.collections.getById(collectionId)
      if (!collection) {
        return {
          error: "Collection not found",
          status: 404,
        }
      }

      const board = db.boards.getById(boardId)
      if (!board) {
        return {
          error: "Board not found",
          status: 404,
        }
      }

      // Giả lập xóa bảng khỏi bộ sưu tập
      // Trong ứng dụng thực tế, bạn sẽ cần cập nhật database

      // Thêm hoạt động
      db.activities.create({
        user: {
          name: "Người dùng hiện tại",
          initials: "ND",
        },
        action: `đã xóa bảng "${board.name}" khỏi bộ sưu tập "${collection.name}"`,
        time: "Vừa xong",
        boardId: board.id,
        boardName: board.name,
        type: "board",
      })

      // Giảm số lượng bảng trong bộ sưu tập nếu > 0
      if (collection.boardCount > 0) {
        db.collections.update(collectionId, { boardCount: collection.boardCount - 1 })
      }

      return {
        data: board,
        status: 200,
        message: "Board removed from collection successfully",
      }
    } catch (error) {
      return {
        error: "Failed to remove board from collection",
        status: 500,
      }
    }
  },
}
