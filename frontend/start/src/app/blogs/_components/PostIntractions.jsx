import ButtonIcon from "@/ui/ButtonIcon";
import { toPersianDigits } from "@/utils/numberFormatter";
import { BookmarkIcon, ChatBubbleOvalLeftEllipsisIcon, HeartIcon } from "@heroicons/react/24/outline";
import React from "react";

function PostIntraction({post}) {
  return (
    <div className="flex items-center gap-x-4 pt-4">
      <ButtonIcon variant="secondary">
        <ChatBubbleOvalLeftEllipsisIcon />
        {toPersianDigits(post.commentsCount)}
      </ButtonIcon>
      <ButtonIcon variant="red">
        <HeartIcon/>
        {toPersianDigits(post.likesCount)}
      </ButtonIcon>
      <ButtonIcon variant="primary">
        <BookmarkIcon/>
      </ButtonIcon>
    </div>
  );
}

export default PostIntraction;
