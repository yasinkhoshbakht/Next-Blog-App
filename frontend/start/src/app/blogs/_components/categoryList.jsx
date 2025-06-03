import React from "react";

async function CategoryList() {
  let categories = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/category/list`
    );
    const data = await res.json();
    categories = data.data.categories;
  } catch (error) {
    console.error(error);
  }
  return (
    <ul className="space-y-2">
      {categories.map((category) => (
        <li key={category._id}>{category.title}</li>
      ))}
    </ul>
  );
}

export default CategoryList;
