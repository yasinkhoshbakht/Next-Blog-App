const Joi = require("joi");
const createHttpError = require("http-errors");

async function validateSignupSchema(data) {
  const signupSchema = Joi.object({
    name: Joi.string()
      .required()
      .min(5)
      .max(50)
      .error(createHttpError.BadRequest("نام کاربری وارد شده صحیح نمی باشد")),
    email: Joi.string()
      .required()
      .email()
      .error(createHttpError.BadRequest("ایمیل وارد شده صحیح نمی باشد")),
    password: Joi.string()
      .min(8)
      .required()
      .error(createHttpError.BadRequest("رمز عبور باید حداقل 8 کاراکتر باشد")),
  });
  return await signupSchema.validateAsync(data);
}
async function validateSigninSchema(data) {
  const signupSchema = Joi.object({
    email: Joi.string()
      .required()
      .email()
      .error(createHttpError.BadRequest("ایمیل وارد شده صحیح نمی باشد")),
    password: Joi.string()
      .min(8)
      .required()
      .error(createHttpError.BadRequest("رمز عبور باید حداقل 8 کاراکتر باشد")),
  });
  return await signupSchema.validateAsync(data);
}

async function validateUpdateProfileSchema(data) {
  const updateProfileSchema = Joi.object({
    name: Joi.string()
      .min(5)
      .max(50)
      .required()
      .error(createHttpError.BadRequest("نام کاربری وارد شده صحیح نمی باشد")),
    email: Joi.string()
      .required()
      .email()
      .error(createHttpError.BadRequest("ایمیل وارد شده صحیح نمی باشد")),
    biography: Joi.string()
      .max(30)
      .allow("")
      .error(createHttpError.BadRequest("حوزه تخصصی صحیح نمی باشد.")),
  });
  return updateProfileSchema.validateAsync(data);
}

module.exports = {
  validateUpdateProfileSchema,
  validateSignupSchema,
  validateSigninSchema,
};
