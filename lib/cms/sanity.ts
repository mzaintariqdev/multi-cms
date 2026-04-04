import { Post } from "@/types/post";

let mockPosts: Post[] = [
  {
    id: "1",
    title: "Demo Post",
    slug: "demo-post",
    excerpt: "This is a demo",
    body: "Hello world",
    image: "",
  },
];

export async function getPosts(): Promise<Post[]> {
  return mockPosts;
}

export async function createPost(data: Post) {
  mockPosts.push({ ...data, id: Date.now().toString() });
}

export async function deletePost(id: string) {
  mockPosts = mockPosts.filter((p) => p.id !== id);
}