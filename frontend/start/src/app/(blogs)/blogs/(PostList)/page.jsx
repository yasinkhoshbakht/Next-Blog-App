import PostList from "../_components/PostList";
import { cookies } from "next/headers";
import setCookieOnReq from "@/utils/setCookieOnReq";
// import { getPosts } from "@/services/postServices";
import queryString from "query-string";
import Pagination from "@/ui/Pagination";

// export const experimental_ppr = true; // STATIC + DYNAMIC => PPR

async function BlogPage({ searchParams }) {
  const cookieStore = await cookies();

  const { search } = await searchParams;

  return (
    <>
      {search ? (
        <p className="mb-4 text-secondary-700">
          {posts.length === 0
            ? " هیچ پستی با این مشخصات پیدا نشد "
            : `نشان دادن ${posts.length} نتیجه برای`}
          <span className="font-bold">&quot;{search}&quot;</span>
        </p>
      ) : null}
      {/* <PostList posts={posts} /> */}
      <div className="flex w-full justify-center my-8">
        {/* <Pagination totalPages={totalPages} /> */}
      </div>
    </>
  );
}
export default BlogPage;
