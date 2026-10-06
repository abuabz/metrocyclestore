import { NextResponse } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { ProductCategory } from "@/lib/backend/models/productCategory.model";
import { Product } from "@/lib/backend/models/product.model";
import { ProductSKU } from "@/lib/backend/models/productSKU.model";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();

    // Clear existing
    await ProductCategory.deleteMany({});
    await Product.deleteMany({});
    await ProductSKU.deleteMany({});

    // 1. Create Categories
    const catMountain = await ProductCategory.create({ M04_category_name: "Mountain Bikes", M04_image: null, M04_M04_parent_category_id: null });
    const catRoad = await ProductCategory.create({ M04_category_name: "Road Bikes", M04_image: null, M04_M04_parent_category_id: null });
    const catElectric = await ProductCategory.create({ M04_category_name: "Electric Bikes", M04_image: null, M04_M04_parent_category_id: null });

    // 2. Create Products
    const prodMountain = await Product.create({ M05_product_name: "Thunderbolt Pro", M05_M04_product_category: catMountain._id });
    const prodRoad = await Product.create({ M05_product_name: "Aero Speed", M05_M04_product_category: catRoad._id });
    const prodElectric = await Product.create({ M05_product_name: "Eco-Charge X1", M05_M04_product_category: catElectric._id });

    // 3. Create SKUs
    await ProductSKU.create({
      M06_sku: "SKU-MTN-01",
      M06_product_sku_name: "Metro Thunderbolt Pro (Mountain)",
      M06_description: "A robust and stylish mountain bike with advanced suspension and a lightweight alloy frame.",
      M06_thumbnail_image: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&q=80&w=600",
      M06_MRP: 14999,
      M06_price: 12499,
      M06_quantity: 50,
      M06_is_new: true,
      M06_M05_product_id: prodMountain._id,
    });

    await ProductSKU.create({
      M06_sku: "SKU-RD-01",
      M06_product_sku_name: "Metro Aero Speed (Road)",
      M06_description: "Aerodynamic road bike built for extreme speeds and long distance marathons.",
      M06_thumbnail_image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=600",
      M06_MRP: 22000,
      M06_price: 18999,
      M06_quantity: 30,
      M06_is_new: true,
      M06_M05_product_id: prodRoad._id,
    });

    await ProductSKU.create({
      M06_sku: "SKU-EL-01",
      M06_product_sku_name: "Eco-Charge Electric X1",
      M06_description: "Environment friendly electric bike with a range of 40km on a single charge.",
      M06_thumbnail_image: "https://images.unsplash.com/photo-1528629297340-d1d466945dc5?auto=format&fit=crop&q=80&w=600",
      M06_MRP: 35000,
      M06_price: 32999,
      M06_quantity: 20,
      M06_is_new: true,
      M06_M05_product_id: prodElectric._id,
    });

    return NextResponse.json({ success: true, message: "Database seeded successfully!" });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
