import Image from "next/image";
import Link from "next/link";
import React from "react";

function CoverImage({ post }) {
  return (
    <div className="relative overflow-hidden rounded-lg mb-6">
      <Link href={`/blogs/${post.slug}`}>
        <Image
          src={post.coverImageUrl}
          alt={post.text}
          width={800}
          height={800}
          className="object-cover object-center hover:scale-110 transition-all duration-300 aspect-video"
        />
      </Link>
    </div>
  );
}

export default CoverImage;
