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

    // Optimize image using sharp
    try {
      const sharp = (await import("sharp")).default;
      buffer = await sharp(buffer)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
    } catch (err) {
      console.error("Sharp optimization failed:", err);
    }

    // Save to public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/\s+/g, '_');
    const filename = `${Date.now()}-${baseName}.webp`;
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    // Use absolute URL from environment variable
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const absoluteUrl = `${baseUrl}/uploads/${filename}`;

    return NextResponse.json({ success: true, url: absoluteUrl });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, message: "Failed to upload file." }, { status: 500 });
  }
}
