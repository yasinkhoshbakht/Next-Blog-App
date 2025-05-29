"use client";
import Button from "@/ui/Button";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import Comment from "./Comment";
import Modal from "@/ui/Modal";
import { useState } from "react";
import CommentForm from "./CommentForm";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

function PostComment({ post: { comments, _id: postId } }) {
  const [open, setOpen] = useState(false);
  const [parent, setParent] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  const addNewCommentHandler = (parent) => {
    if (!user) {
      router.push("/signin");
      return;
    }
    setParent(parent);
    setOpen(true);
  };

  return (
    <div className="mb-10">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={parent ? "پاسخ به نظر" : "نظر جدید"}
        description={parent ? parent.user.name : "نظر خود را وارد کنید"}
      >
        <CommentForm
          onClose={() => setOpen(false)}
          parentId={parent ? parent._id : null}
          postId={postId}
        />
      </Modal>
      <div className="flex flex-col items-center lg:flex-row justify-between gap-y-3 mb-8">
        <h2 className="text-2xl font-bold text-secondary-800">نظرات</h2>
        <Button
          onClick={() => addNewCommentHandler(null)}
          variant="outline"
          className="flex items-center py-2"
        >
          <QuestionMarkCircleIcon className="w-4 ml-2" />
          <span>ثبت نظر جدید</span>
        </Button>
      </div>
      <div className="space-y-8 post-comments bg-secondary-0 rounded-xl py-6 px-3 lg:px-6 ">
        {comments.length > 0 ? (
          comments.map((comment) => {
            return (
              <div key={comment._id}>
                <div className="border border-secondary-200 rounded-xl p-2 sm:p-4 mb-3">
                  <Comment
                    comment={comment}
                    onAddComment={() => addNewCommentHandler(comment)}
                  />
                </div>
                <div className="post-comments__answer mr-2 sm:mr-8 space-y-3">
                  {comment.answers.map((item, index) => {
                    return (
                      <div key={item._id} className="relative">
                        <div
                          className={classNames(
                            "answer-item border border-secondary-100 bg-secondary-50/80 rounded-xl p-2 sm:p-4",
                            {
                              "last-item": index + 1 === comment.answers.length,
                            }
                          )}
                        >
                          <Comment comment={item} key={item._id} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-secondary-500">برای این پست نظری ثبت نشده است</p>
        )}
      </div>
    </div>
  );
}
export default PostComment;
