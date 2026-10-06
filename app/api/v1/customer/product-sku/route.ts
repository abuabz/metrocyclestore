import { NextResponse } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { ProductSKU } from "@/lib/backend/models/productSKU.model";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    const query: any = { M06_deleted_at: null };
    // If we wanted to filter by category, we'd need to populate the product or filter by M04_category_id
    // For simplicity, we just fetch all SKUs for now since the schema connects them through M05_product_id
    
    const products = await ProductSKU.find(query).populate("M06_M05_product_id");

    return NextResponse.json({
      success: true,
      msg: "Products fetched successfully",
      data: {
        products_skus: products,
        pagination: {
          page: 1,
          limit: 32,
          totalItems: products.length,
          totalPages: 1
        }
      },
      statusCode: 200
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, msg: error.message }, { status: 500 });
  }
}
