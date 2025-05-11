const { CommentController } = require("../http/controllers/comment.controller");

async function transformPost(post, user) {
  post.likesCount = post.likes.length;
  post.isLiked = false;
  post.isBookmarked = false;

  const acceptedCommnets = await CommentController.findAcceptedComments(
    post._id
  );
  if (post.author?.avatar) {
    post.author.avatarUrl = `${process.env.SERVER_URL}/${post.author.avatar}`;
  }

  if (post.related.length) {
    post.related = post.related.map((item) => {
      return {
        ...item,
        coverImageUrl: `${process.env.SERVER_URL}/${item.coverImage}`,
        author: {
          ...item.author,
          avatarUrl: `${process.env.SERVER_URL}/${item.author.avatar}`,
        },
      };
    });
  }
  post.comments = acceptedCommnets;
  post.commentsCount =
    acceptedCommnets.length +
    acceptedCommnets.reduce((a, c) => a + c.answers.length, 0);

  if (!user) {
    post.isLiked = false;
    post.isBookmarked = false;

    delete post.likes;
    delete post.bookmarks;
    return post;
  }
  if (post.likes.includes(user._id.toString())) {
    post.isLiked = true;
  }
  if (post.bookmarks.includes(user._id.toString())) {
    post.isBookmarked = true;
  }

  delete post.bookmarks;
  delete post.likes;
  return post;
}

module.exports = {
  transformPost,
};
