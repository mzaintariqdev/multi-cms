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
    console.log(body)
    const id = await getCMS(cms).createPost(body);
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE - Used by PostList
export async function DELETE(req: Request, { params }: { params: Promise<{ cms: string }> }) {
  try {
    const { cms } = await params;
    const { id } = await req.json();
    await getCMS(cms).deletePost(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}