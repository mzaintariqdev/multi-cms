import { useQuery } from "@tanstack/react-query";

// @/hooks/usePosts.ts
export function usePosts(cms: string) {
  return useQuery({
    queryKey: ["posts", cms],
    queryFn: async () => {
      const res = await fetch(`/api/posts/${cms}`); // Use the API route!
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });
}