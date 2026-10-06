import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file received." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    let buffer = Buffer.from(bytes);

    // Optimize image using sharp (convert to WebP for high quality & low size)
    try {
      const sharp = (await import("sharp")).default;
      buffer = await sharp(buffer)
        .resize({ width: 1200, withoutEnlargement: true }) // Resize if larger than 1200px wide
        .webp({ quality: 80 }) // 80% quality webp preserves visual quality but slashes file size
        .toBuffer();
    } catch (err) {
      console.error("Sharp optimization failed, saving original buffer:", err);
    }

    // Save to public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename with .webp extension
    const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/\s+/g, '_');
    const filename = `${Date.now()}-${baseName}.webp`;
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    // Return the public URL path
    return NextResponse.json({ success: true, url: `/uploads/${filename}` });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, message: "Failed to upload file." }, { status: 500 });
  }
}
