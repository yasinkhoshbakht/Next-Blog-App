import Image from "next/image";
import Link from "next/link";
import React from "react";

function CoverImage({ post }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-lg mb-6">
      <Link href={`/blogs/${post.slug}`}>
        <Image
          src={post.coverImageUrl}
          alt={post.text}
          width={400}
          height={400}
          className="object-cover object-center hover:scale-110 transition-all duration-300"
        />
      </Link>
    </div>
  );
}

export default CoverImage;
