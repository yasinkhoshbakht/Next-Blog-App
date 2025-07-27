import setCookieOnReq from "@/utils/setCookieOnReq";
import { cookies } from "next/headers";
import { getAllUsersApi } from "./authService";
import { getAllCommentsApi } from "./commentService";
import { getPosts } from "./postServices";

export async function fetchCardData() {
  const cookieStore = await cookies()
  const options = setCookieOnReq(cookieStore);

  // ARTIFICIALLY DELAY A REPONSE FOR DEMO PURPOSES
  await new Promise((resolve) => setTimeout(resolve, 3000));

  try {
    const data = await Promise.all([
      getAllUsersApi(options),
      getAllCommentsApi(options),
      getPosts(),
    ]);

    const numberOfUsers = Number(data[0].users.length ?? "0");
    const numberOfPosts = Number(data[2].posts.length ?? "0");
    const numberOfComments = Number(data[1].commentsCount ?? "0");

    return {
      numberOfComments,
      numberOfPosts,
      numberOfUsers,
    };
  } catch (error) {
    console.log(error.resoonse.data.message);
    throw new Error("خطا در بارگذاری اطلاعات");
  }
}

export async function fetchLatestPosts() {
  try {
    const posts = await getPosts("sort=latest&limit=5");
    return posts;
  } catch (error) {
    throw new Error(error?.reponse?.data?.message);
  }
}
