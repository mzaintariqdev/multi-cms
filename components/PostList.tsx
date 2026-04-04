/* eslint-disable @typescript-eslint/no-explicit-any */
// components/PostList.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Post } from "@/types/post";
import PostCard from "./PostCard";
import Toast from "./Toast";

interface PostListProps {
  cms: string;
  refreshTrigger?: number; // Add this prop
}

export default function PostList({ cms, refreshTrigger }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [updatingTitle, setUpdatingTitle] = useState(false);

  // Fetch posts - wrapped in useCallback to avoid recreation
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`/api/posts/${cms}?limit=100`);
      const data = await response.json();
      console.log("Fetched posts:", data);
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch posts");
      }
      
      setPosts(data || []);
    } catch (err: any) {
      setError(err.message);
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [cms]);

  // Show toast notification
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  // Delete post
  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    setDeletingId(postId);
    
    try {
      const response = await fetch(`/api/posts/${cms}/${postId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete post");
      }

      // Refetch posts after successful deletion
      await fetchPosts();
      showToast("Post deleted successfully!", "success");
      
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setDeletingId(null);
    }
  };

  // Update post title
  const handleUpdateTitle = async (postId: string, newTitle: string) => {
    setUpdatingTitle(true);
    
    try {
      const response = await fetch(`/api/posts/${cms}/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update title");
      }

      // Refetch posts after successful update
      await fetchPosts();
      showToast("Post title updated successfully!", "success");
      setEditingPost(null);
      
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setUpdatingTitle(false);
    }
  };

  // Edit modal component
  const EditModal = ({ post, onClose }: { post: Post; onClose: () => void }) => {
    const [title, setTitle] = useState(post.title);
    const [localError, setLocalError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim()) {
        setLocalError("Title is required");
        return;
      }
      if (title.trim() === post.title) {
        onClose();
        return;
      }
      await handleUpdateTitle(post.id, title.trim());
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Edit Post Title
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Slug: <span className="font-mono text-xs">{post.slug}</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter new title"
                autoFocus
                disabled={updatingTitle}
              />
            </div>
            
            {localError && (
              <div className="mb-4 text-red-600 dark:text-red-400 text-sm">
                {localError}
              </div>
            )}
            
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updatingTitle}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
              >
                {updatingTitle ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Fetch posts on mount and when cms or refreshTrigger changes
  useEffect(() => {
    console.log("Refresh triggered, fetching posts...");
    fetchPosts();
  }, [cms, refreshTrigger, fetchPosts]); // Added refreshTrigger dependency

  return (
    <div>
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Edit Modal */}
      {editingPost && (
        <EditModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
        />
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 rounded-lg">
          <p className="font-semibold">Error loading posts:</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchPosts}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && posts.length === 0 && !error && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No posts yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Create your first post using the form above!
          </p>
        </div>
      )}

      {/* Posts Grid */}
      {!loading && posts.length > 0 && (
        <>
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              All Posts ({posts.length})
            </h2>
            <button
              onClick={fetchPosts}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors"
            >
              ↻ Refresh
            </button>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={handleDelete}
                onEdit={setEditingPost}
                isDeleting={deletingId === post.id}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}