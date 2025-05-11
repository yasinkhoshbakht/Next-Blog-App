const createHttpError = require("http-errors");
const path = require("path");
const { CategoryModel } = require("../../models/category");
const { PostModel } = require("../../models/post");
const {
  copyObject,
  deleteInvalidPropertyInObject,
} = require("../../utils/functions");
const { validateAddNewPost } = require("../validators/post/post.schema");
const { CommentController } = require("./comment.controller");
const Controller = require("./controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { UserModel } = require("../../models/user");
const { transformPost } = require("../../utils/transformPost");
const { default: mongoose } = require("mongoose");

class PostController extends Controller {
  constructor() {
    super();
  }
  async getAllPosts(req, res) {
    let dbQuery = {};
    const user = req.user;
    let { search, categorySlug, sort, page, limit } = req.query;
    page = Number(page) || 1;
    limit = Number(limit) || 6;
    const skip = (page - 1) * limit;

    if (search) {
      const searchTerm = new RegExp(search, "ig");
      dbQuery["$or"] = [
        { title: searchTerm },
        { slug: searchTerm },
        { briefText: searchTerm },
        { text: searchTerm },
      ];
    }

    // if (search) dbQuery["$text"] = { $search: search }; // -> OLD METHOD TO SEARCH BASED ON INDEX

    if (categorySlug) {
      const categories = [categorySlug].flat(2);
      const categoryIds = [];
      for (const item of categories) {
        const { _id } = await CategoryModel.findOne({ slug: item });
        categoryIds.push(_id);
      }
      dbQuery["category"] = {
        $in: categoryIds,
      };
    }

    const sortQuery = {};
    if (!sort) sortQuery["createdAt"] = -1;
    if (sort) {
      if (sort === "latest") sortQuery["createdAt"] = -1;
      if (sort === "earliest") sortQuery["createdAt"] = 1;
      if (sort === "popular") sortQuery["likesCount"] = -1;
      if (sort === "time_desc") sortQuery["readingTime"] = -1;
      if (sort === "time_asc") sortQuery["readingTime"] = 1;
    }
    const posts = await PostModel.find(dbQuery, {
      comments: 0,
    })
      .populate([
        { path: "category", select: { title: 1, slug: 1 } },
        { path: "author", select: { name: 1, biography: 1, avatar: 1 } },
        {
          path: "related",
          model: "Post",
          select: {
            title: 1,
            slug: 1,
            bfireText: 1,
            coverImage: 1,
            author: 1,
          },
          populate: [
            {
              path: "author",
              model: "User",
              select: { name: 1, biography: 1, avatar: 1 },
            },
            {
              path: "category",
              model: "Category",
              select: { title: 1, slug: 1 },
            },
          ],
        },
      ])
      .limit(limit)
      .skip(skip)
      .sort(sortQuery);

    const totalPages = Math.ceil(
      Number((await PostModel.find(dbQuery)).length) / limit
    );

    const transformedPosts = copyObject(posts);

    for (const post of transformedPosts) {
      await transformPost(post, user);
    }

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "پست های مدنظر شما",
        posts: transformedPosts,
        totalPages,
      },
    });
  }
  async getPostBySlug(req, res) {
    const { slug } = req.params;
    const user = req.user;
    const post = await PostModel.findOne({ slug }).populate([
      {
        path: "author",
        model: "User",
        select: { name: 1, biography: 1, avatar: 1 },
      },
      { path: "category", model: "Category", select: { title: 1, slug: 1 } },
      {
        path: "related",
        model: "Post",
        select: {
          title: 1,
          slug: 1,
          bfireText: 1,
          coverImage: 1,
          author: 1,
        },
        populate: [
          {
            path: "author",
            model: "User",
            select: { name: 1, biography: 1, avatar: 1 },
          },
          {
            path: "category",
            model: "Category",
            select: { title: 1, slug: 1 },
          },
        ],
      },
    ]);

    if (!post) throw createHttpError.NotFound("پستی با این مشخصات یافت نشد");
    const { id: postId } = post;
    const acceptedCommnets = await CommentController.findAcceptedComments(
      postId
    );

    const transformedPost = copyObject(post);

    transformedPost.comments = acceptedCommnets;
    transformedPost.commentsCount =
      acceptedCommnets.length +
      acceptedCommnets.reduce((a, c) => a + c.answers.length, 0);

    await transformPost(transformedPost, user);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        post: transformedPost,
      },
    });
  }
  async addNewPost(req, res) {
    const { filename, fileUploadPath, ...rest } = req.body;
    await validateAddNewPost(rest);
    const {
      title,
      briefText,
      slug,
      type = "free",
      category,
      tags = [],
      text,
      readingTime,
      related = [],
    } = rest;

    const author = req.user._id;
    // const { fileUploadPath, filename } = req.body;

    if (!fileUploadPath || !filename)
      throw createHttpError.InternalServerError("کاور پست را اپلود کنید");
    const fileAddress = path.join(fileUploadPath, filename);
    const coverImage = fileAddress.replace(/\\/g, "/");

    const post = await PostModel.create({
      title,
      briefText,
      slug,
      type,
      category,
      tags,
      text,
      readingTime,
      related,
      author,
      coverImage,
    });

    if (!post?._id) throw createHttpError.InternalServerError("پست ثبت نشد");

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: {
        message: "پست با موفقیت ایجاد شد",
        post,
      },
    });
  }
  async updatePost(req, res) {
    const { id } = req.params;
    const { filename, fileUploadPath, ...rest } = req.body;

    const post = await this.findPostById(id);
    const data = copyObject(rest);
    let blackListFields = ["time", "likes", "comments", "bookmarks", "author"];
    deleteInvalidPropertyInObject(data, blackListFields);

    let coverImage = post.coverImage;

    if (fileUploadPath && filename) {
      const fileAddress = path.join(fileUploadPath, filename);
      coverImage = fileAddress.replace(/\\/g, "/");
    }

    const updatePostResult = await PostModel.updateOne(
      { _id: id },
      {
        $set: { ...data, coverImage },
      }
    );

    if (!updatePostResult.modifiedCount)
      throw new createHttpError.InternalServerError(
        "به روزرسانی پست انجام نشد"
      );

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "به روزرسانی پست با موفقیت انجام شد",
      },
    });
  }
  async removePost(req, res) {
    const { id } = req.params;
    await this.findPostById(id);
    const post = await PostModel.findByIdAndDelete(id);
    if (!post._id) throw createHttpError.InternalServerError(" پست حذف نشد");
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "پست با موفقیت حذف شد",
      },
    });
  }
  async getPostById(req, res) {
    const { id } = req.params;
    const post = await this.findPostById(id);
    req.params.slug = post.slug;
    await this.getPostBySlug(req, res);
  }
  async findPostById(id) {
    if (!mongoose.isValidObjectId(id))
      throw createHttpError.BadRequest("شناسه پست نامعتبر است");

    const post = await PostModel.findById(id);
    if (!post) throw createHttpError.BadRequest("پست با این مشخصات یافت نشد");
    return copyObject(post);
  }
  async likePost(req, res) {
    const { id: postId } = req.params;
    const user = req.user;
    const post = await this.findPostById(postId);
    const likedPost = await PostModel.findOne({
      _id: postId,
      likes: user._id,
    });
    const updatePostQuery = likedPost
      ? { $pull: { likes: user._id } }
      : { $push: { likes: user._id } };

    const updateUserQuery = likedPost
      ? { $pull: { likedPosts: post._id } }
      : { $push: { likedPosts: post._id } };

    const postUpdate = await PostModel.updateOne(
      { _id: postId },
      updatePostQuery
    );
    const userUpdate = await UserModel.updateOne(
      { _id: user._id },
      updateUserQuery
    );

    if (postUpdate.modifiedCount === 0 || userUpdate.modifiedCount === 0)
      throw createHttpError.BadRequest("عملیات ناموفق بود.");

    let message;
    if (!likedPost) {
      message = "مرسی بابت لایک تون";
    } else message = "لایک شما برداشته شد";

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message,
      },
    });
  }
  async bookmarkPost(req, res) {
    const { id: postId } = req.params;
    const user = req.user;
    const post = await this.findPostById(postId);
    const likedPost = await PostModel.findOne({
      _id: postId,
      bookmarks: user._id,
    });
    const updatePostQuery = likedPost
      ? { $pull: { bookmarks: user._id } }
      : { $push: { bookmarks: user._id } };

    const updateUserQuery = likedPost
      ? { $pull: { bookmarkedPosts: post._id } }
      : { $push: { bookmarkedPosts: post._id } };

    const postUpdate = await PostModel.updateOne(
      { _id: postId },
      updatePostQuery
    );
    const userUpdate = await UserModel.updateOne(
      { _id: user._id },
      updateUserQuery
    );

    if (postUpdate.modifiedCount === 0 || userUpdate.modifiedCount === 0)
      throw createHttpError.BadRequest("عملیات ناموفق بود.");

    let message;
    if (!likedPost) {
      message = "پست بوکمارک شد";
    } else message = "پست از بوکمارک برداشته شد";

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message,
      },
    });
  }
}

module.exports = {
  PostController: new PostController(),
};
