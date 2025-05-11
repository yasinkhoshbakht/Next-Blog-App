const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, uniqure: true },
    englishTitle: { type: String, required: true, uniqure: true },
    description: { type: String, required: true },
    slug: { type: String, required: true, uniqure: true },
    icon: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  CategoryModel: mongoose.model("Category", CategorySchema),
};
