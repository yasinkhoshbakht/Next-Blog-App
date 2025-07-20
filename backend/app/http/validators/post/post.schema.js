const Joi = require("joi");
const createHttpError = require("http-errors");
const { MongoIDPattern } = require("../../../utils/constants");

async function validateAddNewPost(data) {
  const addNewPostSchema = Joi.object({
    title: Joi.string()
      .min(5)
      .max(100)
      .required()
      .error(createHttpError.BadRequest("عنوان پست را به درستی وارد کنید")),
    slug: Joi.string()
      .required()
      .error(createHttpError.BadRequest(" اسلاگ پست را به درستی وارد کنید")),
    category: Joi.string()
      .required()
      .pattern(MongoIDPattern)
      .error(
        createHttpError.BadRequest(" شناسه دسته بندی را به درستی وارد کنید")
      ),
    text: Joi.string()
      .required()
      .error(createHttpError.BadRequest(" متن پست را به درستی وارد کنید")),
    briefText: Joi.string()
      .required()
      .error(createHttpError.BadRequest(" خلاصه پست را به درستی وارد کنید")),
    readingTime: Joi.number()
      .required()
      .error(
        createHttpError.BadRequest("زمان مطالعه پست را به درستی وارد کنید")
      ),
    type: Joi.string()
      .regex(/(free|premium)/i)
      .error(createHttpError.BadRequest("نوع پست صحیح نمی باشد")),
    related: Joi.array()
      .items(Joi.string().pattern(MongoIDPattern))
      .error(createHttpError.BadRequest(" پست های مرتبط صحیح نمی باشد")),
    tags: Joi.array()
      .items(Joi.string())
      .error(createHttpError.BadRequest("تگ های پست صحیح نمی باشد")),
  });
  return addNewPostSchema.validateAsync(data);
}

module.exports = {
  validateAddNewPost,
};
