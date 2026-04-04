"use client";

import { useState } from "react";

export default function PostForm({ cms, onCreated }: any) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

const handleSubmit = async (e: any) => {
  e.preventDefault();

  try {
    const response = await fetch(`/api/posts/${cms}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // MUST HAVE THIS
      },
      body: JSON.stringify({
        title,
        slug: title.toLowerCase().replace(/\s+/g, "-"),
        excerpt: "New post excerpt",
        body: "Post content here", // For Contentful, this gets converted to Rich Text in the CMS file
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create post");
    }

    setTitle("");
    onCreated();
  } catch (err: any) {
    setError(err.message);
  }
};

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
        className="border px-2 py-1 flex-1"
      />
      <button className="bg-blue-600 text-white px-4">Add</button>
      {error && <span className="text-red-500">{error}</span>}
    </form>
  );
}