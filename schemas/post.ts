/* eslint-disable import/no-anonymous-default-export */
// schemas/post.ts
export default {
  name: "post",
  type: "document",
  title: "Post",
  fields: [
    { name: "title", type: "string" },
    {
      name: "slug",
      type: "slug",
      options: { source: "title" },
    },
    { name: "excerpt", type: "text" },
    { name: "body", type: "array", of: [{ type: "block" }] },
    {
      name: "mainImage",
      type: "image",
      options: { hotspot: true },
    },
  ],
};