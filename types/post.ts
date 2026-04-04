export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  image?: string;
  createdAt?: string;
}