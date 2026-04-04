/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/posts/[cms]/[id]/route.ts
import { getCMS } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

// PUT - Update a post
export async function PUT(
  req: NextRequest, 
  { params }: { params: Promise<{ cms: string; id: string }> }
) {
  try {
    const { cms, id } = await params;
    const body = await req.json();
    
    console.log("Updating post ID:", id);
    console.log("Update data:", body);
    
    // Call the update function from your CMS
    const result = await getCMS(cms).updatePost(id, body);
    
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Update error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE - Alternative way to delete (using URL parameter)
export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ cms: string; id: string }> }
) {
  try {
    const { cms, id } = await params;
    
    console.log("Deleting post ID:", id);
    await getCMS(cms).deletePost(id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}