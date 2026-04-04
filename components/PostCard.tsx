// components/PostCard.tsx
"use client";

import { Post } from "@/types/post";

interface Props {
  post: Post;
  onDelete?: (id: string) => void;
  onEdit?: (post: Post) => void;
  isDeleting?: boolean;
}

export default function PostCard({ post, onDelete, onEdit, isDeleting }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 flex flex-col gap-3 relative">
      
      {/* Delete Loading Overlay */}
      {isDeleting && (
        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}

      {/* Image */}
      {post.image && (
        <div className="w-full h-40 overflow-hidden rounded-lg">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-2 mt-1">
            {post.excerpt}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
          /{post.slug}
        </span>
        <div className="flex gap-3">
          {onEdit && (
            <button
              onClick={() => onEdit(post)}
              disabled={isDeleting}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium transition-colors disabled:opacity-50"
            >
              Edit
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(post.id)}
              disabled={isDeleting}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isDeleting ? "..." : "Delete"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}