import React from "react";

async function BlogList() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/post/list`);
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const {
    data: { posts },
  } = await res.json();

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {post.title}
          </h2>
        </div>
      ))}
    </div>
  );
}

export default BlogList;
