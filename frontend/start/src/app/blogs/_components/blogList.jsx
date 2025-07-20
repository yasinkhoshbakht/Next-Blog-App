import Link from "next/link";
import React from "react";
import CoverImage from "./coverImage";
import PostIntractions from "app/blogs/_components/PostIntractions";

async function BlogList() {
  const res = await fetch(`http://localhost:5000/api/post/list`);
  const {
    data: { posts },
  } = await res.json();

  return posts.length === 0 ? null : (
    <div className="grid grid-cols-12 gap-4">
      {posts.map((post) => (
        <div
          key={post._id}
          className="col-span-12 sm:col-span-6 lg:col-span-4 border border-secondary-100 p-4"
        >
          <CoverImage post={post}/>
          <div className="post-post">
            <Link href={`/blogs/${post.slug}`}>
              <h2 className="text-lg font-bold text-secondary-700">
                {post.title}
              </h2>
            </Link>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-x-2">
                <img
                  src={post.author.avatarUrl || "/images/avatar.png"}
                  width={24}
                  height={24}
                  className="rounded-full ring-1 ring-secondary-100 ml-2"
                  alt={post.author.name}
                />
                <span className="text-sm text-slate-500">
                  {post.author.name}
                </span>
              </div>
              <div className="flex items-center text-[10px] text-secondary-500 gap-x-1">
                <svg
                  className="w-4 h-4 stroke-secondary-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-xs leading-3">{post.readingTime}</span>
              </div>
            </div>
          </div>
          <PostIntractions post={post} />
        </div>
      ))}
    </div>
  );
}

export default BlogList;
