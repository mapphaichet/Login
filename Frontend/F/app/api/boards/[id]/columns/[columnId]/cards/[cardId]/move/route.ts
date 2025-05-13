import { NextResponse } from "next/server"
import { cardService } from "@/lib/services/card-service"

export async function POST(request: Request, { params }: { params: { id: string; columnId: string; cardId: string } }) {
  try {
    const { id: boardId, columnId: sourceColumnId, cardId } = params
    const { destinationColumnId } = await request.json()

    if (!destinationColumnId) {
      return NextResponse.json({ error: "Destination column ID is required" }, { status: 400 })
    }

    const response = await cardService.moveCard(boardId, sourceColumnId, destinationColumnId, cardId)

    if (response.error) {
      return NextResponse.json({ error: response.error }, { status: response.status })
    }

    return NextResponse.json(response.data)
  } catch (error) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}
