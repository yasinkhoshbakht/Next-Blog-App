const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const AnswerSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: "User", required: true },
    post: { type: ObjectId, ref: "Post", required: true },
    content: {
      text: { type: String, required: true },
    },
    status: { type: Number, required: true, default: 1, enum: [0, 1, 2] },
    openToComment: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: true },
  }
);

const CommentSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: "User", required: true },
    post: { type: ObjectId, ref: "Post" },
    content: {
      text: { type: String, required: true },
    },
    status: { type: Number, required: true, default: 1, enum: [0, 1, 2] },
    openToComment: { type: Boolean, default: true },
    answers: { type: [AnswerSchema], default: [] },
  },
  {
    timestamps: { createdAt: true },
  }
);

module.exports = {
  CommentModel: mongoose.model("Comment", CommentSchema),
};
