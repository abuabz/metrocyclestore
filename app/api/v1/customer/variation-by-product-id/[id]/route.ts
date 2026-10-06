import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Return empty variations array for now since we haven't implemented variations fully
  return NextResponse.json({
    success: true,
    msg: "Variations fetched successfully",
    data: [],
    statusCode: 200
  });
}
