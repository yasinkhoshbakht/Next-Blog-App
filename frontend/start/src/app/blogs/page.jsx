import Spinner from "@/ui/Spinner";
import React, { Suspense } from "react";
import BlogList from "./_components/blogList";

export const metadata = {
  title: "بلاگ ها  - وب اپلیکیشن مدیریت بلاگ",
};

export const experimental_ppr = true;

function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-500 pb-2">
        لیست بلاگ ها
      </h1>
      <Suspense fallback={<Spinner />}>
        <BlogList />
      </Suspense>
    </div>
  );
}

export default BlogPage;
