// app/[cms]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Layout from "@/components/Layout";
import PostList from "@/components/PostList";
import PostForm from "@/components/PostForm";
import { usePosts } from "@/hooks/usePosts";
import { useState, useCallback } from "react";

export default function Page() {
  const params = useParams();
  const cms = params.cms as string;
  const { refetch, data } = usePosts(cms);
  const [refreshKey, setRefreshKey] = useState(0);

  // Function to handle refresh after any CRUD operation
  const handleRefresh = useCallback(async () => {
    console.log("Refreshing data...");
    await refetch();
    setRefreshKey(prev => prev + 1); // This will force PostList to re-render and refetch
  }, [refetch]);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 capitalize text-gray-800 dark:text-gray-200">
          {cms} Posts
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-3">
            ({data?.length || 0} posts)
          </span>
        </h1>

        <PostForm 
          cms={cms} 
          onCreated={handleRefresh}
          currentPostsCount={data?.length || 0}
        />
        
        <PostList 
          cms={cms} 
          refreshTrigger={refreshKey} // Pass refresh trigger to PostList
        />
      </div>
    </Layout>
  );
}