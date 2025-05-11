const cookieParser = require("cookie-parser");
const createHttpError = require("http-errors");
const JWT = require("jsonwebtoken");
const axios = require("axios");
const { UserModel } = require("../../models/user");
async function isAuthWithCookie(req, res, next) {
  try {
    const userToken = req.signedCookies["userToken"];
    if (!userToken) {
      throw createHttpError.Unauthorized("لطفا وارد حساب کاربری خود شوید.");
    }
    const token = cookieParser.signedCookie(
      userToken,
      process.env.COOKIE_PARSER_SECRET_KEY
    );
    JWT.verify(token, process.env.TOKEN_SECRET_KEY, async (err, payload) => {
      if (err) throw createHttpError.Unauthorized("توکن نامعتبر است");
      const { _id } = payload;
      const user = await UserModel.findById(_id, {
        password: 0,
        resetLink: 0,
      });
      if (!user) throw createHttpError.Unauthorized("حساب کاربری یافت نشد");
      req.user = user;
      return next();
    });
  } catch (error) {
    next(error);
  }
}

async function verifyAccessToken(req, res, next) {
  try {
    const accessToken = req.signedCookies["accessToken"];
    if (!accessToken) {
      throw createHttpError.Unauthorized("لطفا وارد حساب کاربری خود شوید.");
    }
    const token = cookieParser.signedCookie(
      accessToken,
      process.env.COOKIE_PARSER_SECRET_KEY
    );
    JWT.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET_KEY,
      async (err, payload) => {
        try {
          if (err) throw createHttpError.Unauthorized("توکن نامعتبر است");
          const { _id } = payload;
          const user = await UserModel.findById(_id, {
            password: 0,
            otp: 0,
          });
          if (!user) throw createHttpError.Unauthorized("حساب کاربری یافت نشد");
          req.user = user;
          return next();
        } catch (error) {
          next(error);
        }
      }
    );
  } catch (error) {
    next(error);
  }
}

async function verifyRecaptcha(req, res, next) {
  try {
    const recaptchaToken = req.body.recaptchaToken;
    if (!recaptchaToken)
      throw createHttpError.Unauthorized("تیک گزینه «من ربات نیستم» را بزنید");

    const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
    const { data } = await axios.post(googleVerifyUrl);
    const { success } = data;
    if (success) {
      next();
    } else {
      throw createHttpError.Forbidden("توکن نامعتبر است");
    }
  } catch (error) {
    next(error);
  }
}

function decideAuthMiddleware(req, res, next) {
  const accessToken = req.signedCookies["accessToken"];
  if (accessToken) {
    return verifyAccessToken(req, res, next);
  }
  // skip this middleware
  next();
}

module.exports = {
  isAuthWithCookie,
  verifyRecaptcha,
  verifyAccessToken,
  decideAuthMiddleware,
};
