import { NextResponse } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Contact } from "@/lib/backend/models/contact.model";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: contacts }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
