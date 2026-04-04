"use client";

import { Post } from "@/types/post";

interface Props {
  post: Post;
  onDelete?: (id: string) => void;
  onEdit?: (post: Post) => void;
}

export default function PostCard({ post, onDelete, onEdit }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition p-4 flex flex-col gap-3">
      
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
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-400 dark:text-gray-400">{post.slug}</span>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(post)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium"
            >
              Edit
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(post.id)}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 text-sm font-medium"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}