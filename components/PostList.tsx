"use client";

import { usePosts } from "@/hooks/usePosts";
import { getCMS } from "@/lib/api";
import PostCard from "./PostCard";

export default function PostList({ cms }: { cms: string }) {
  const { data, refetch } = usePosts(cms);

// Inside your Client Component (PostList.tsx or PostCard.tsx)
const handleDelete = async (postId: string) => {
  try {
    // WRONG: await deletePost(postId); 
    // This calls the local function in the browser and causes the error.

    // RIGHT: Call your Next.js API Route
    const response = await fetch(`/api/posts/${cms}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: postId }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to delete");
    }

    // Refresh your list after successful deletion
    refetch(); 
  } catch (err: any) {
    alert(err.message);
  }
};

  if (!data?.length) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
        No posts yet. Create one 👇
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((post) => (
        <PostCard key={post.id} post={post} onDelete={handleDelete} />
      ))}
    </div>
  );
}