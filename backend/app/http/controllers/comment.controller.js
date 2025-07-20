const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const { addNewCommentSchema } = require("../validators/comment/comment.schema");
const Controller = require("./controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");

const { CommentModel } = require("../../models/comment");
const { checkPostExist, copyObject } = require("../../utils/functions");
const ObjectId = mongoose.Types.ObjectId;

class CommentController extends Controller {
  async addNewComment(req, res) {
    const user = req.user;
    // const status = user.role === "ADMIN" ? 2 : 0;
    // ! JUST FOR EDUCATIONAL PURPOSES => STATUS: 2
    const status = 2;
    // const status = 2;
    const { text, parentId, postId } = req.body;
    const content = { text };
    await addNewCommentSchema.validateAsync({
      content,
      postId,
    });
    await checkPostExist(postId);
    if (parentId && mongoose.isValidObjectId(parentId)) {
      const parentComment = await this.findCommentById(parentId);
      if (parentComment && !parentComment?.openToComment)
        throw createHttpError.BadRequest("ثبت پاسخ برای این کامنت مجاز نیست");

      const createAnswerResult = await CommentModel.updateOne(
        { _id: parentId },
        {
          $push: {
            answers: {
              content,
              post: postId,
              user: user._id,
              status,
              openToComment: false,
            },
          },
        }
      );
      if (!createAnswerResult.matchedCount && !createAnswerResult.modifiedCount)
        throw createHttpError.InternalServerError("ثبت پاسخ انجام نشد");

      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        data: {
          message: "پاسخ شما با موفقیت ثبت شد، پس از تایید قابل مشاهده است",
        },
      });
    } else {
      const newComment = await CommentModel.create({
        content,
        post: postId,
        user: user._id,
        status,
        openToComment: true,
      });
      if (!newComment)
        throw createHttpError.InternalServerError("ثبت نطر انجام نشد");
      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        data: {
          message: "نظر شما با موفقیت ثبت شد، پس از تایید قابل مشاهده است",
        },
      });
    }
  }
  async updateComment(req, res) {
    //? only comment status will be updated:

    const { id } = req.params;
    const { status } = req.body;
    const comment = await this.findCommentById(id);
    if (comment && comment.openToComment) {
      const updateResult = await CommentModel.updateOne(
        { _id: id },
        {
          $set: { status },
        }
      );
      if (updateResult.modifiedCount == 0)
        throw new createHttpError.InternalServerError("آپدیت کامنت انجام نشد");
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          message: "کامنت با موفقیت آپدیت شد",
        },
      });
    } else {
      const updateResult = await CommentModel.updateOne(
        { "answers._id": id },
        {
          $set: {
            "answers.$.status": status,
          },
        }
      );
      if (updateResult.modifiedCount == 0)
        throw new createHttpError.InternalServerError("آپدیت کامنت انجام نشد");
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          message: "کامنت با موفقیت آپدیت شد",
        },
      });
    }
  }
  async removeComment(req, res) {
    const { id } = req.params;
    const comment = await this.findCommentById(id);
    if (comment && comment.openToComment) {
      const commentToDelete = await CommentModel.findOneAndDelete({ _id: id });
      if (!commentToDelete)
        throw new createHttpError.InternalServerError("کامنت حذف نشد");
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          message: "کامنت با موفقیت حذف شد",
        },
      });
    } else {
      const updateResult = await CommentModel.updateOne(
        { "answers._id": id },
        {
          $pull: { answers: { _id: id } },
        }
      );
      if (updateResult.modifiedCount === 0)
        throw new createHttpError.InternalServerError("کامنت حذف نشد");
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          message: "کامنت با موفقیت حذف شد",
        },
      });
    }
  }
  async getAllComments(req, res) {
    // const { commentsType = "course" } = req.body; // course or post
    const comments = await CommentModel.find({})
      .populate([
        {
          path: "user",
          model: "User",
          select: { name: 1 },
        },
        {
          path: "answers.user",
          model: "User",
          select: { name: 1 },
        },
      ])
      .sort({ createdAt: -1 });
    const commentsCount =
      comments.length + comments.reduce((a, c) => a + c.answers.length, 0);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        comments: comments,
        commentsCount,
      },
    });
  }
  async getOneComment(req, res) {
    const { id } = req.params;
    await this.findCommentById(id);
    const comment = await CommentModel.findById(id)
      .populate([
        {
          path: "user",
          model: "User",
          select: { name: 1 },
        },
        {
          path: "answers.user",
          model: "User",
          select: { name: 1 },
        },
      ])
      .sort({ createdAt: -1 });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        comment,
      },
    });
  }
  async findCommentById(id) {
    const commentFindResult = await CommentModel.aggregate([
      {
        $project: {
          answers: {
            $concatArrays: [
              "$answers",
              [
                {
                  _id: "$_id",
                  openToComment: "$openToComment",
                  content: "$content",
                  status: "$status",
                },
              ],
            ],
          },
        },
      },
      {
        $unwind: {
          path: "$answers",
        },
      },
      {
        $replaceRoot: {
          newRoot: "$answers",
        },
      },
      {
        $match: {
          _id: ObjectId(id),
        },
      },
    ]);
    const comment = copyObject(commentFindResult);
    if (!comment?.[0])
      throw createHttpError.NotFound("کامنتی با این مشخصات یافت نشد");
    return comment?.[0];
  }
  async findAcceptedComments(id, status = 2) {
    const {
      copyObject,
      calculateDateDuration,
    } = require("../../utils/functions");
    const acceptedComments = await CommentModel.aggregate([
      {
        $match: {
          post: ObjectId(id),
          status,
        },
      },
      {
        $project: {
          status: 1,
          _id: 1,
          openToComment: 1,
          content: 1,
          user: 1,
          createdAt: 1,
          answers: {
            $filter: {
              input: "$answers",
              as: "answer",
              cond: {
                $eq: ["$$answer.status", status],
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
          pipeline: [
            {
              $project: { name: 1, biography: 1, avatar: 1 },
            },
          ],
        },
      },
      {
        $addFields: {
          user: {
            $map: {
              input: "$user",
              as: "item",
              in: {
                $mergeObjects: [
                  "$$item",
                  {
                    avatarUrl: {
                      $concat: [process.env.SERVER_URL, "/", "$$item.avatar"],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $unwind: {
          path: "$user",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "answers.user",
          foreignField: "_id",
          as: "answerWriter",
          pipeline: [
            {
              $project: { name: 1, biography: 1, avatar: 1 },
            },
          ],
        },
      },
      {
        $addFields: {
          answerWriter: {
            $map: {
              input: "$answerWriter",
              as: "item",
              in: {
                $mergeObjects: [
                  "$$item",
                  {
                    avatarUrl: {
                      $concat: [process.env.SERVER_URL, "/", "$$item.avatar"],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          content: 1,
          user: 1,
          status: 1,
          openToComment: 1,
          createdAt: 1,
          _id: 1,
          answers: {
            $map: {
              input: "$answers",
              as: "item",
              in: {
                content: "$$item.content",
                status: "$$item.status",
                openToComment: "$$item.openToComment",
                createdAt: "$$item.createdAt",
                _id: "$$item._id",
                user: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$answerWriter",
                        as: "writer",
                        cond: {
                          $eq: ["$$writer._id", "$$item.user"],
                        },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
    const transformed = acceptedComments.map((c) => {
      return {
        ...c,
        createdAt: calculateDateDuration(c.createdAt),
        answers: c.answers.map((c) => {
          return { ...c, createdAt: calculateDateDuration(c.createdAt) };
        }),
      };
    });
    return copyObject(transformed);
  }
}

module.exports = {
  CommentController: new CommentController(),
};
