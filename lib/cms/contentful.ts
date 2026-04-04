/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/cms/contentful.ts
import { GraphQLClient, gql } from "graphql-request";
import { createClient } from 'contentful-management';
import { Post } from "@/types/post";

// ENV - Using NEXT_PUBLIC for the browser-safe variables
const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!;
const ENVIRONMENT = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || "master";
const DELIVERY_TOKEN = process.env.NEXT_PUBLIC_CONTENTFUL_DELIVERY_TOKEN!;

// MANAGEMENT TOKEN - Server only (No NEXT_PUBLIC prefix)
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN!;

/**
 * Helper: Creates a GraphQL Client
 */
const getGqlClient = () => {
  return new GraphQLClient(
    `https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`,
    {
      headers: {
        Authorization: `Bearer ${DELIVERY_TOKEN}`,
      },
    }
  );
};

// -------------------------
// GET POSTS (Delivery API)
// -------------------------
export async function getPosts(): Promise<Post[]> {
  const client = getGqlClient();

  const query = gql`
    query {
      postCollection {
        items {
          sys { id }
          title
          slug
          excerpt
          body { 
            json 
          }
          image { url }
        }
      }
    }
  `;

  try {
    const data = await client.request<{ postCollection: { items: any[] } }>(query);
    
    return data.postCollection.items.map((item) => ({
      id: item.sys.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      body: item.body?.json ? JSON.stringify(item.body.json) : "", 
      image: item.image?.url || "",
    }));
  } catch (error: any) {
    console.error("Contentful GraphQL Error:", error.response?.errors || error.message);
    return [];
  }
}

// -------------------------
// CREATE POST (Management API)
// -------------------------
export async function createPost(post: any) {
  if (typeof window !== 'undefined') {
    throw new Error("createPost must be called from server-side only!");
  }

  console.log("--- CREATING POST ---");
  console.log("Title:", post.title);
  console.log("Slug:", post.slug);

  const client = createClient(
    { accessToken: MANAGEMENT_TOKEN },
    {
      type: 'plain',
      defaults: {
        spaceId: SPACE_ID,
        environmentId: ENVIRONMENT,
      },
    }
  );

  const richTextBody = {
    nodeType: "document",
    data: {},
    content: [{
      nodeType: "paragraph",
      data: {},
      content: [{ 
        nodeType: "text", 
        value: post.body || "", 
        marks: [], 
        data: {} 
      }]
    }]
  };

  try {
    const entry = await client.entry.create(
      { contentTypeId: 'post' },
      {
        fields: {
          title: { "en-US": post.title },
          slug: { "en-US": post.slug },
          excerpt: { "en-US": post.excerpt || "" },
          body: { "en-US": richTextBody },
        },
      }
    );

    console.log("Entry created:", entry.sys.id);
    await client.entry.publish({ entryId: entry.sys.id }, entry);
    console.log("Entry published:", entry.sys.id);

    return entry.sys.id;
  } catch (error: any) {
    console.error("Create post error:", error);
    throw new Error(`Failed to create post: ${error.message}`);
  }
}

// -------------------------
// ✅ UPDATE POST TITLE ONLY (Management API)
// -------------------------
export async function updatePost(id: string, post: any) {
  if (typeof window !== 'undefined') {
    throw new Error("updatePost must be called from server-side only!");
  }

  console.log("--- UPDATING POST TITLE ---");
  console.log("Post ID:", id);
  console.log("New Title:", post.title);
  
  try {
    const client = createClient(
      { accessToken: MANAGEMENT_TOKEN },
      {
        type: 'plain',
        defaults: {
          spaceId: SPACE_ID,
          environmentId: ENVIRONMENT,
        },
      }
    );

    // Get the existing entry
    const entry = await client.entry.get({ entryId: id });
    
    // ✅ ONLY update the title field (ignore other fields)
    if (post.title) {
      entry.fields.title = { "en-US": post.title };
    }

    // Update the entry
    const updatedEntry = await client.entry.update({ entryId: id }, entry);
    
    // Republish if it was published
    if (entry.sys.publishedAt) {
      await client.entry.publish({ entryId: id }, updatedEntry);
    }
    
    console.log("Title updated successfully!");
    return updatedEntry.sys.id;
    
  } catch (error: any) {
    console.error("Update post error:", error);
    throw new Error(`Failed to update post: ${error.message}`);
  }
}

// -------------------------
// DELETE POST (Management API)
// -------------------------
export async function deletePost(id: string) {
  if (typeof window !== 'undefined') {
    throw new Error("deletePost must be called from server-side only!");
  }

  console.log("--- DELETING POST ---");
  console.log("Post ID to delete:", id);
  
  try {
    const client = createClient(
      { accessToken: MANAGEMENT_TOKEN },
      {
        type: 'plain',
        defaults: {
          spaceId: SPACE_ID,
          environmentId: ENVIRONMENT,
        },
      }
    );

    // Get the entry first
    const entry = await client.entry.get({ entryId: id });
    console.log("Entry found, published:", !!entry.sys.publishedAt);

    // Unpublish if published
    if (entry.sys.publishedAt) {
      console.log("Unpublishing entry...");
      await client.entry.unpublish({ entryId: id });
    }

    // Delete the entry
    console.log("Deleting entry...");
    await client.entry.delete({ entryId: id });
    console.log("Entry deleted successfully!");
    
    return { success: true };
    
  } catch (error: any) {
    console.error("Delete post error:", error);
    
    if (error.status === 401) {
      throw new Error("Authentication failed: Invalid or missing Management Token");
    } else if (error.status === 404) {
      throw new Error(`Post with ID ${id} not found`);
    } else {
      throw new Error(`Failed to delete post: ${error.message}`);
    }
  }
}