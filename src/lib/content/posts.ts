// import * as fs from "fs/promises";
import { promises as fs } from "fs";
import matter from "gray-matter";
import path from "path";

// const fs = require("fs/promises");

const postsDir = path.join(process.cwd(), "");
// const postsDir = path.join("../../../content/posts");

export interface IPost {
  id: string;
  title: string;
  draft: boolean;
  publishedAt: string;
  content: string;
  path: string;
  incomplete: boolean;
  description: string | null;
  hasMath: boolean;
  banner: {
    alt: string;
    width: number;
    height: number;
    src: string;
  } | null;
  tags: readonly string[];
}

export const getAllPosts = async (): Promise<readonly IPost[]> => {
  console.log(postsDir);
  const posts = await fs.readdir(postsDir);
  return await Promise.all(
    posts.map(async (post) => {
      const postID = post.split(".").slice(0, -1).join(".");
      return await getPostByID(postID);
    })
  );
};

export const getPostByID = async (postID: string): Promise<IPost> => {
  const source = await fs.readFile(`${postsDir}/${postID}.md`);
  const { content, data: dataUnknown } = matter(source.toString());
  const data = dataUnknown as IPost;
  const publishedAt = new Date(postID.split("-").slice(0, 3).join("-"));
  return {
    id: postID,
    title: data.title,
    draft: data.draft === true,
    publishedAt: publishedAt.toISOString(),
    content,
    path: `/posts/${postID}`,
    incomplete: data.incomplete === true,
    description: data.description ?? null,
    hasMath: data.hasMath === true,
    banner: data.banner ?? null,
    tags: data.tags ?? [],
  };
};
