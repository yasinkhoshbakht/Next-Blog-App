const users = require("./data/db.users.json");
const posts = require("./data/db.posts.json");
const categories = require("./data/db.category.json");
const comments = require("./data/db.comments.json");
const { UserModel } = require("./app/models/user");
const { PostModel } = require("./app/models/post");
const { CommentModel } = require("./app/models/comment");
const { CategoryModel } = require("./app/models/category");
const Application = require("./app/server");

(async () => {
  new Application();
  await UserModel.insertMany(users);
  await PostModel.insertMany(posts);
  await CommentModel.insertMany(comments);
  await CategoryModel.insertMany(categories);
})()
  .then(() => {
    console.log("DATA INSERTED SUCCESSFULLY.");
    console.log("NOW RUN npm run dev AND TEST THE APIs");
  })
  .catch((err) => console.log("DATA INSERTION FAILED: ", err));
