import { NextResponse } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { ProductCategory } from "@/lib/backend/models/productCategory.model";

export async function GET() {
  try {
    await connectDB();
    const categories = await ProductCategory.find({ M04_deleted_at: null }).lean();
    
    // Import Product dynamically or at the top if needed. Let's just import it at the top.
    // Wait, to avoid import issues here, I will just require it:
    const { Product } = await import("@/lib/backend/models/product.model");
    
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ M05_M04_product_category: cat._id, M05_deleted_at: null });
        return {
          ...cat,
          productCount: count
        };
      })
    );

    return NextResponse.json({
      success: true,
      msg: "Categories fetched successfully",
      data: {
        productCategories: categoriesWithCounts,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: categories.length,
          limit: 100
        }
      },
      statusCode: 200
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, msg: error.message }, { status: 500 });
  }
}
