import React from "react";
import CoverImage from "../_components/coverImage";
import { getPosts } from "@/services/postServices";

export const dynamicParams = false;

export async function generateStaticParams() {
  const { posts } = await getPosts();
  return posts.map((post) => ({ PostSlug: post.slug }));
}

export async function generateMetadata({ params }) {
  const res = await fetch(
    `http://localhost:5000/api/post/slug/${params.PostSlug}`,
    { next: { revalidate: 60 } }
  );
  const { data } = await res.json();
  const post = data.post;

  return {
    title: post.title,
    description: post.briefText,
  };
}

export default async function PostSlug({ params }) {
  const res = await fetch(
    `http://localhost:5000/api/post/slug/${params.PostSlug}`,
    { next: { revalidate: 60 } }
  );
  const { data } = await res.json();
  const post = data.post;

  return (
    <div className="max-w-screen-md mx-auto p-6 text-secondary-600">
      <h1 className="text-2xl font-bold text-secondary-700 mb-4 text-center">
        {post.title}
      </h1>

      <div className="relative aspect-video overflow-hidden rounded-lg">
        <CoverImage post={post} />
      </div>

      <p className="text-lg mb-4 mt-7">{post.briefText}</p>
      <p className="whitespace-pre-line leading-relaxed mb-10">{post.text}</p>

      <div className="flex items-center gap-3 mt-8">
        <img
          src={post.author.avatarUrl || "/images/avatar.png"}
          width={24}
          height={24}
          className="rounded-full ring-1 ring-secondary-100 ml-2"
          alt={post.author.name}
        />
        <div>
          <p className="text-sm font-medium text-secondary-700">
            {post.author.name}
          </p>
          <p className="text-xs text-secondary-500">
            زمان مطالعه: {post.readingTime} دقیقه
          </p>
        </div>
      </div>
    </div>
  );
}
