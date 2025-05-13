import { NextResponse } from "next/server"
import { boardService } from "@/lib/services/board-service"
import type { Column } from "@/types"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const boardId = params.id
  const response = await boardService.getColumns(boardId)

  if (response.error) {
    return NextResponse.json({ error: response.error }, { status: response.status })
  }

  return NextResponse.json(response.data)
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const boardId = params.id
    const data = (await request.json()) as Omit<Column, "id">
    const response = await boardService.addColumn(boardId, data)

    if (response.error) {
      return NextResponse.json({ error: response.error }, { status: response.status })
    }

    return NextResponse.json(response.data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}
