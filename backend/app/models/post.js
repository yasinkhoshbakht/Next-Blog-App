const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // page link in front-end : jsx-in-react.js
    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
    type: {
      type: String,
      default: "free",
      required: true,
      enum: ["free", "premium"],
    },
    briefText: { type: String, required: true },
    text: { type: String, required: true },
    coverImage: { type: String, required: true, unique: true },
    likes: [{ type: ObjectId, ref: "User" }],
    bookmarks: [{ type: ObjectId, ref: "User" }],
    readingTime: { type: Number, required: true },
    tags: [{ type: String }],
    author: { type: ObjectId, ref: "User" },
    related: [{ type: ObjectId, ref: "Post" }],
    // a Post can have multiple comments, so it should be in a array.
    // all comments info should be kept in this array of this Post.
    comments: [{ type: ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

PostSchema.virtual("coverImageUrl").get(function () {
  if (this.coverImage) return `${process.env.SERVER_URL}/${this.coverImage}`;
  return null;
});

module.exports = {
  PostModel: mongoose.model("Post", PostSchema),
};
