const Joi = require("joi");
const createHttpError = require("http-errors");
const { MongoIDPattern } = require("../../../utils/constants");

const contentSchema = Joi.object().keys({
  text: Joi.string()
    .min(10)
    .max(2000)
    .required()
    .error(createHttpError.BadRequest("متن نظر را به درستی وارد کنید")),
});

const addNewCommentSchema = Joi.object({
  content: contentSchema,
  postId: Joi.string()
    .allow()
    .pattern(MongoIDPattern)
    .error(createHttpError.BadRequest("شناسه پست را به درستی وارد کنید")),
});

module.exports = {
  addNewCommentSchema,
};
