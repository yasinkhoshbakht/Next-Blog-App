"use client";

import React from "react";
import toast from "react-hot-toast";
import {
  BookmarkIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import {
  BookmarkIcon as SolidBookmarkIcon,
  HeartIcon as SolidHeartIcon,
} from "@heroicons/react/24/solid";

import { likePostApi, bookmarkPostApi } from "@/services/postServices";
import ButtonIcon from "@/ui/ButtonIcon";
import { toPersianDigits } from "@/utils/numberFormatter";

function PostInteraction({ post }) {
  const [isLiked, setIsLiked] = React.useState(post.isLiked);
  const [isBookmarked, setIsBookmarked] = React.useState(post.isBookmarked);
  const [likesCount, setLikesCount] = React.useState(post.likesCount);

  const handleLike = async () => {
    try {
      setIsLiked((prev) => !prev);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
      const { message } = await likePostApi(post._id);
      toast.success(message);
    } catch (error) {
      setIsLiked(post.isLiked);
      setLikesCount(post.likesCount);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleBookmark = async () => {
    try {
      setIsBookmarked((prev) => !prev);
      const { message } = await bookmarkPostApi(post._id);
      toast.success(message);
    } catch (error) {
      setIsBookmarked(post.isBookmarked);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="flex items-center gap-4 pt-4">
      <ButtonIcon variant="secondary" className="flex items-center gap-1">
        <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
        <span className="text-sm">{toPersianDigits(post.commentsCount)}</span>
      </ButtonIcon>
      <ButtonIcon
        variant="red"
        onClick={handleLike}
        className="flex items-center gap-1"
      >
        {isLiked ? (
          <SolidHeartIcon className="w-5 h-5 text-red-500" />
        ) : (
          <HeartIcon className="w-5 h-5" />
        )}
        <span className="text-sm">{toPersianDigits(likesCount)}</span>
      </ButtonIcon>
      <ButtonIcon
        variant="primary"
        onClick={handleBookmark}
        className="flex items-center gap-1"
      >
        {isBookmarked ? (
          <SolidBookmarkIcon className="w-5 h-5 text-blue-500" />
        ) : (
          <BookmarkIcon className="w-5 h-5" />
        )}
      </ButtonIcon>
    </div>
  );
}

export default PostInteraction;
