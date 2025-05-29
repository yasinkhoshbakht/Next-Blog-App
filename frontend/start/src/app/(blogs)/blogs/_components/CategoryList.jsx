import Link from "next/link";

async function CategoryList() {
  let categories = [];
  
  try {
    const response = await fetch("http://localhost:5000/api/category/list");
    const data = await response.json();
    categories = data.categories; 
  } catch (error) {
    console.error("خطا در دریافت داده‌ها:", error);
  }

  console.log(categories);

  return (
    <ul className="space-y-4">
      <Link href="/blogs">همه</Link>
      {categories.map((category) => {
        return (
          <li key={category._id}>
            <Link href={`/blogs/category/${category.slug}`}>
              {category.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default CategoryList;
