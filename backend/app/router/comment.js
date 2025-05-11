const expressAsyncHandler = require("express-async-handler");
const { CommentController } = require("../http/controllers/comment.controller");
const { verifyAccessToken } = require("../http/middlewares/auth.middleware");
const router = require("express").Router();

router.post(
  "/add",
  verifyAccessToken,
  expressAsyncHandler(CommentController.addNewComment)
);

router.patch(
  "/update/:id",
  verifyAccessToken,
  expressAsyncHandler(CommentController.updateComment)
);
router.get("/list", expressAsyncHandler(CommentController.getAllComments));
router.delete(
  "/remove/:id",
  verifyAccessToken,
  expressAsyncHandler(CommentController.removeComment)
);

router.get(
  "/:id",
  verifyAccessToken,
  expressAsyncHandler(CommentController.getOneComment)
);

module.exports = {
  commentRoutes: router,
};
