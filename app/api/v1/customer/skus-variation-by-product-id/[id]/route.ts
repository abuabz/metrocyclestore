import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Return empty sku variations array for now
  return NextResponse.json({
    success: true,
    msg: "SKU Variations fetched successfully",
    data: [],
    statusCode: 200
  });
}
