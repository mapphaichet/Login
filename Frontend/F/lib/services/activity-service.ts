import { db } from "@/lib/db"
import type { Activity, ApiResponse, Comment } from "@/types"

export const activityService = {
  getAllActivities: async (): Promise<ApiResponse<Activity[]>> => {
    try {
      const activities = db.activities.getAll()
      return {
        data: activities,
        status: 200,
      }
    } catch (error) {
      return {
        error: "Failed to fetch activities",
        status: 500,
      }
    }
  },

  getActivityById: async (id: string): Promise<ApiResponse<Activity>> => {
    try {
      const activity = db.activities.getAll().find((activity) => activity.id === id)

      if (!activity) {
        return {
          error: "Activity not found",
          status: 404,
        }
      }

      return {
        data: activity,
        status: 200,
      }
    } catch (error) {
      return {
        error: "Failed to fetch activity",
        status: 500,
      }
    }
  },

  getActivitiesByBoardId: async (boardId: string): Promise<ApiResponse<Activity[]>> => {
    try {
      const activities = db.activities.getByBoardId(boardId)
      return {
        data: activities,
        status: 200,
      }
    } catch (error) {
      return {
        error: "Failed to fetch activities for board",
        status: 500,
      }
    }
  },

  createActivity: async (activityData: Omit<Activity, "id">): Promise<ApiResponse<Activity>> => {
    try {
      const newActivity = db.activities.create(activityData)
      return {
        data: newActivity,
        status: 201,
        message: "Activity created successfully",
      }
    } catch (error) {
      return {
        error: "Failed to create activity",
        status: 500,
      }
    }
  },

  updateActivity: async (id: string, data: Partial<Activity>): Promise<ApiResponse<Activity>> => {
    try {
      const activity = db.activities.getAll().find((activity) => activity.id === id)

      if (!activity) {
        return {
          error: "Activity not found",
          status: 404,
        }
      }

      const updatedActivity = db.activities.update(id, data)
      return {
        data: updatedActivity,
        status: 200,
        message: "Activity updated successfully",
      }
    } catch (error) {
      return {
        error: "Failed to update activity",
        status: 500,
      }
    }
  },

  addComment: async (activityId: string, comment: Omit<Comment, "id">): Promise<ApiResponse<Activity>> => {
    try {
      const activity = db.activities.getAll().find((activity) => activity.id === activityId)

      if (!activity) {
        return {
          error: "Activity not found",
          status: 404,
        }
      }

      const newComment: Comment = {
        ...comment,
        id: `comment-${Date.now()}`,
      }

      const updatedActivity = db.activities.update(activityId, {
        comments: [...(activity.comments || []), newComment],
      })

      return {
        data: updatedActivity,
        status: 200,
        message: "Comment added successfully",
      }
    } catch (error) {
      return {
        error: "Failed to add comment",
        status: 500,
      }
    }
  },

  toggleLike: async (activityId: string): Promise<ApiResponse<Activity>> => {
    try {
      const activity = db.activities.getAll().find((activity) => activity.id === activityId)

      if (!activity) {
        return {
          error: "Activity not found",
          status: 404,
        }
      }

      const updatedActivity = db.activities.update(activityId, {
        liked: !activity.liked,
      })

      return {
        data: updatedActivity,
        status: 200,
        message: `Activity ${updatedActivity.liked ? "liked" : "unliked"} successfully`,
      }
    } catch (error) {
      return {
        error: "Failed to toggle like",
        status: 500,
      }
    }
  },

  markAsRead: async (activityId: string): Promise<ApiResponse<Activity>> => {
    try {
      const activity = db.activities.getAll().find((activity) => activity.id === activityId)

      if (!activity) {
        return {
          error: "Activity not found",
          status: 404,
        }
      }

      const updatedActivity = db.activities.update(activityId, {
        read: true,
      })

      return {
        data: updatedActivity,
        status: 200,
        message: "Activity marked as read",
      }
    } catch (error) {
      return {
        error: "Failed to mark activity as read",
        status: 500,
      }
    }
  },

  markAllAsRead: async (): Promise<ApiResponse<Activity[]>> => {
    try {
      const activities = db.activities.getAll()

      // Cập nhật tất cả activities thành đã đọc
      const updatedActivities = activities.map((activity) => {
        if (!activity.read) {
          return db.activities.update(activity.id, { read: true })
        }
        return activity
      })

      return {
        data: updatedActivities,
        status: 200,
        message: "All activities marked as read",
      }
    } catch (error) {
      return {
        error: "Failed to mark all activities as read",
        status: 500,
      }
    }
  },
}
