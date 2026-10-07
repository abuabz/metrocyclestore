import { NextResponse } from "next/server";
import { connectDB } from "@/lib/backend/db";
import { Contact } from "@/lib/backend/models/contact.model";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { M07_status } = await request.json();

    const updated = await Contact.findByIdAndUpdate(
      params.id,
      { M07_status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Status updated successfully", data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    
    const deleted = await Contact.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Request deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
