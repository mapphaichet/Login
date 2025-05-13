import { NextResponse } from "next/server"
import { boardService } from "@/lib/services/board-service"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const response = await boardService.getBoardById(id)

  if (response.error) {
    return NextResponse.json({ error: response.error }, { status: response.status })
  }

  return NextResponse.json(response.data)
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()
    const response = await boardService.updateBoard(id, data)

    if (response.error) {
      return NextResponse.json({ error: response.error }, { status: response.status })
    }

    return NextResponse.json(response.data)
  } catch (error) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const response = await boardService.deleteBoard(id)

  if (response.error) {
    return NextResponse.json({ error: response.error }, { status: response.status })
  }

  return NextResponse.json(response.data)
}
