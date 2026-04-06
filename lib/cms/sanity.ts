/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@sanity/client";
import { Post } from "@/types/post";

// ENV
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = "2024-01-01";

// Public client (read)
const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

// Private client (write)
const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_TOKEN, // server only
  useCdn: false,
});

// -------------------------
// GET POSTS
// -------------------------
export async function getPosts(): Promise<Post[]> {
  try {
    const data = await client.fetch(`*[_type == "post"]{
      _id,
      title,
      "slug": slug.current,
      excerpt,
      body,
      "image": mainImage.asset->url
    }`);

    return data.map((item: any) => ({
      id: item._id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt || "",
      body: item.body ? JSON.stringify(item.body) : "",
      image: item.image || "",
    }));
  } catch (error: any) {
    console.error("Sanity fetch error:", error.message);
    return [];
  }
}

// -------------------------
// CREATE POST
// -------------------------
export async function createPost(post: any) {
  if (typeof window !== "undefined") {
    throw new Error("createPost must be server-side only");
  }

  try {
    const doc = {
      _type: "post",
      title: post.title,
      slug: {
        _type: "slug",
        current: post.slug,
      },
      excerpt: post.excerpt || "",
      body: [
        {
          _type: "block",
          children: [
            {
              _type: "span",
              text: post.body || "",
            },
          ],
        },
      ],
    };

    const result = await writeClient.create(doc);

    return result._id;
  } catch (error: any) {
    console.error("Sanity create error:", error);
    throw new Error(error.message);
  }
}

// -------------------------
// UPDATE POST (TITLE ONLY)
// -------------------------
export async function updatePost(id: string, post: any) {
  if (typeof window !== "undefined") {
    throw new Error("updatePost must be server-side only");
  }

  try {
    const result = await writeClient
      .patch(id)
      .set({
        ...(post.title && { title: post.title }),
      })
      .commit();

    return result._id;
  } catch (error: any) {
    console.error("Sanity update error:", error);
    throw new Error(error.message);
  }
}

// -------------------------
// DELETE POST
// -------------------------
export async function deletePost(id: string) {
  if (typeof window !== "undefined") {
    throw new Error("deletePost must be server-side only");
  }

  try {
    await writeClient.delete(id);
    return { success: true };
  } catch (error: any) {
    console.error("Sanity delete error:", error);
    throw new Error(error.message);
  }
}