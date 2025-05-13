import { NextResponse } from "next/server"
import { boardService } from "@/lib/services/board-service"
import type { Board } from "@/types"

export async function GET() {
  const response = await boardService.getAllBoards()

  if (response.error) {
    return NextResponse.json({ error: response.error }, { status: response.status })
  }

  return NextResponse.json(response.data)
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as Omit<Board, "id">
    const response = await boardService.createBoard(data)

    if (response.error) {
      return NextResponse.json({ error: response.error }, { status: response.status })
    }

    return NextResponse.json(response.data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}
