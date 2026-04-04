/* eslint-disable @typescript-eslint/no-explicit-any */
// components/PostForm.tsx
"use client";

import { useState } from "react";

interface PostFormProps {
  cms: string;
  onCreated: () => void;
  currentPostsCount: number;
}

export default function PostForm({ cms, onCreated, currentPostsCount }: PostFormProps) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError("Title is required");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    // Generate slug: title-currentPostsCount
    const cleanTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    
    const slug = `${cleanTitle}-${currentPostsCount}`;

    try {
      const response = await fetch(`/api/posts/${cms}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug,
          excerpt: `${title.trim()} - New post`,
          content: "Post content here",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create post");
      }

      setTitle("");
      setSuccess(`Post "${title}" created successfully!`);
      onCreated(); // Refresh the post list
      
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Create New Post
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            disabled={loading}
            autoFocus
          />
          <button 
            type="submit"
            disabled={loading || !title.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition-colors font-medium"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating...
              </span>
            ) : (
              "Create Post"
            )}
          </button>
        </div>
        
        {/* Slug preview */}
        {title && !loading && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Slug will be: <span className="font-mono">{title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-{currentPostsCount}</span>
          </div>
        )}
        
        {error && (
          <div className="mt-3 p-2 bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 rounded text-sm">
            ❌ {error}
          </div>
        )}
        
        {success && (
          <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 border border-green-400 text-green-700 dark:text-green-300 rounded text-sm">
            ✅ {success}
          </div>
        )}
      </form>
    </div>
  );
}