/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/posts/[cms]/route.ts
import { getCMS } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

// GET - Used by usePosts hook
export async function GET(req: NextRequest, { params }: { params: Promise<{ cms: string }> }) {
  try {
    const { cms } = await params;
    const data = await getCMS(cms).getPosts();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Used by PostForm
export async function POST(req: NextRequest, { params }: { params: Promise<{ cms: string }> }) {
  try {
    const { cms } = await params;
    const body = await req.json();
    console.log("Creating post:", body);
    const id = await getCMS(cms).createPost(body);
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✅ FIXED DELETE - Get id from URL query parameter instead of body
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ cms: string }> }) {
  try {
    const { cms } = await params;
    // Get id from URL search params
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, error: "Post ID is required" }, { status: 400 });
    }
    
    console.log("Deleting post with ID:", id);
    await getCMS(cms).deletePost(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
