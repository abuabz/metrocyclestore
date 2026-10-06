import { NextResponse } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { ProductSKU } from "@/lib/backend/models/productSKU.model";
import { ProductSKUImage } from "@/lib/backend/models/productSKUimage.model";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const sku = await ProductSKU.findById(params.id).lean();

    if (!sku) {
      return NextResponse.json({ success: false, msg: "Product not found", statusCode: 404 }, { status: 404 });
    }

    // Fetch Gallery Images
    const images = await ProductSKUImage.find({ M07_M06_product_sku_id: params.id, M07_deleted_at: null }).sort({ M07_order: 1 }).lean();

    // Parse Specs
    let parsedSpecs = [];
    if (sku.M06_specs) {
      try {
        parsedSpecs = JSON.parse(sku.M06_specs as string);
      } catch (e) {
        console.error("Failed to parse specs", e);
      }
    }

    // Parse Features
    let parsedFeatures = [];
    if (sku.M06_features) {
      try {
        parsedFeatures = JSON.parse(sku.M06_features as string);
      } catch (e) {
        console.error("Failed to parse features", e);
      }
    }

    // Format for frontend
    const productData = {
      ...sku,
      M06_features: parsedFeatures,
      M06_specs: parsedSpecs,
      Images: images.length > 0 ? images : (sku.M06_thumbnail_image ? [{ M07_image_path: sku.M06_thumbnail_image }] : []),
      Variations: [],
      M06_is_out_of_stock: sku.M06_quantity <= 0
    };

    return NextResponse.json({
      success: true,
      msg: "Product fetched successfully",
      data: productData,
      statusCode: 200
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, msg: error.message, statusCode: 500 }, { status: 500 });
  }
}
