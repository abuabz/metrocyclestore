import { NextResponse } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Contact } from "@/lib/backend/models/contact.model";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

// Helper function to save and optimize files
async function saveAndOptimizeFile(file: File): Promise<string | null> {
  if (!file || typeof file === 'string') return null;
  
  const bytes = await file.arrayBuffer();
  let buffer = Buffer.from(bytes);

  try {
    const sharp = (await import("sharp")).default;
    buffer = await sharp(buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
  } catch (err) {
    console.error("Sharp optimization failed, saving original buffer:", err);
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/\s+/g, '_');
  const filename = `${Date.now()}-${baseName}.webp`;
  const filePath = path.join(uploadDir, filename);

  await writeFile(filePath, buffer);
  return `/uploads/${filename}`;
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const formData = await request.formData();

    const M07_name = formData.get("M07_name") as string;
    const M07_place = formData.get("M07_place") as string;
    const M07_district = formData.get("M07_district") as string;
    const M07_pincode = formData.get("M07_pincode") as string;
    const M07_phone_number = formData.get("M07_phone_number") as string;
    const M07_status = (formData.get("M07_status") as string) || "To do";

    // Handle multiple files
    const cycleImagesFiles = formData.getAll("M07_cycle_image") as File[];
    const warrantyImagesFiles = formData.getAll("M07_warranty_card_photo") as File[];

    const M07_cycle_image: string[] = [];
    for (const file of cycleImagesFiles) {
      const url = await saveAndOptimizeFile(file);
      if (url) M07_cycle_image.push(url);
    }

    const M07_warranty_card_photo: string[] = [];
    for (const file of warrantyImagesFiles) {
      const url = await saveAndOptimizeFile(file);
      if (url) M07_warranty_card_photo.push(url);
    }

    // Generate unique contactId
    const contactId = `SRV-${Date.now()}`;

    const newContact = await Contact.create({
      contactId,
      M07_name,
      M07_place,
      M07_district,
      M07_pincode,
      M07_phone_number,
      M07_status,
      M07_cycle_image,
      M07_warranty_card_photo,
    });

    return NextResponse.json({ 
      success: true, 
      msg: "Contact request created successfully", 
      data: { contactId: newContact.contactId } 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Contact API error:", error);
    return NextResponse.json({ success: false, msg: error.message || "Failed to submit request." }, { status: 500 });
  }
}
