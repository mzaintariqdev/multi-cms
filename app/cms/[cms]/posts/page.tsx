"use client";

import { useParams } from "next/navigation";
import Layout from "@/components/Layout";
import PostList from "@/components/PostList";
import PostForm from "@/components/PostForm";
import { usePosts } from "@/hooks/usePosts";

export default function Page() {
  const params = useParams();
  const cms = params.cms as string;

  const { refetch } = usePosts(cms);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4 capitalize">{cms} Posts</h1>

      <PostForm cms={cms} onCreated={refetch} />
      <PostList cms={cms} />
    </Layout>
  );
}