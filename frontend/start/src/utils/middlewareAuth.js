import { NextResponse } from "next/server";

export async function validateUser(req, accessToken, refreshToken) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/user/profile`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
        },
      }
    );

    if (!res.ok) {
      return NextResponse.redirect(
        new URL("/signin?error=sessionExpired", req.url)
      );
    }

    const { data } = await res.json();
    if (!data?.user) {
      return NextResponse.redirect(
        new URL("/signin?error=unauthorized", req.url)
      );
    }

    return NextResponse.next(); 
  } catch (error) {
    return NextResponse.redirect(new URL("/signin?error=serverError", req.url));
  }
}
