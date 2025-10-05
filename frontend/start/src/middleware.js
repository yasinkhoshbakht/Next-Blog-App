import { NextResponse } from "next/server";
import { validateUser } from "./utils/middlewareAuth";

export function middleware(req) {
  const accessToken = req.cookies.get("accessToken");
  const refreshToken = req.cookies.get("refreshToken");

  if (!accessToken?.value || !refreshToken?.value) {
    return NextResponse.redirect(
      new URL("/signin?error=unauthorized", req.url)
    );
  }

  return validateUser(req, accessToken.value, refreshToken.value);
}

export const config = {
  matcher: ["/profile"],
};
