import { NextResponse } from "next/server"
import { cardService } from "@/lib/services/card-service"

export async function GET(request: Request, { params }: { params: { id: string; columnId: string; cardId: string } }) {
  const { id: boardId, columnId, cardId } = params
  const response = await cardService.getCardById(boardId, columnId, cardId)

  if (response.error) {
    return NextResponse.json({ error: response.error }, { status: response.status })
  }

  return NextResponse.json(response.data)
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; columnId: string; cardId: string } },
) {
  try {
    const { id: boardId, columnId, cardId } = params
    const data = await request.json()
    const response = await cardService.updateCard(boardId, columnId, cardId, data)

    if (response.error) {
      return NextResponse.json({ error: response.error }, { status: response.status })
    }

    return NextResponse.json(response.data)
  } catch (error) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; columnId: string; cardId: string } },
) {
  const { id: boardId, columnId, cardId } = params
  const response = await cardService.deleteCard(boardId, columnId, cardId)

  if (response.error) {
    return NextResponse.json({ error: response.error }, { status: response.status })
  }

  return NextResponse.json(response.data)
}
