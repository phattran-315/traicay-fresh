import { NextRequest, NextResponse } from "next/server";
import { COOKIE_USER_PHONE_NUMBER_TOKEN } from "./constants/configs.constant";
import { APP_PARAMS, APP_URL } from "./constants/navigation.constant";
import { ERROR_JWT_CODE, verifyToken } from "./utils/auth.util";
import { refreshUserToken } from "./libs/refresh-token.lib";
import { cookies } from "next/headers";
const publicRoutes = [
  "/login",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/cart",
  "/products",
  "/",
  "/verify-email",
  '/about-us',
  '/contact'
];

export async function middleware(req: NextRequest, res: NextResponse) {
  const path = req.nextUrl.pathname;
  if (path.startsWith("/_next") || path.startsWith("/favicon.ico")) {
    return NextResponse.next();
  }
  // // check if payload token is set no point to login again

  const payloadToken = req.cookies.get("payload-token")?.value || "";

  const userToken = req.cookies.get(COOKIE_USER_PHONE_NUMBER_TOKEN)?.value;
  const isVerifiedToken = userToken && (await verifyToken(userToken));
  // if have code ==> error type

  // refreshing token
  if (
    isVerifiedToken &&
    "code" in isVerifiedToken &&
    isVerifiedToken.code === ERROR_JWT_CODE.ERR_JWT_EXPIRED
  ) {
    const res = await refreshUserToken(req);
    return res;
  }
  // return response
  // if have token on the server but expire generate a new token based on the refresh token
  const isValidToken = isVerifiedToken && !("code" in isVerifiedToken);
  // const validToken=
  const isAuthenticated = payloadToken || isValidToken;
  const isLoginOrSignUpRoute =
    path.startsWith("/login") || path.startsWith("/sign-up");

  // if verified token send to home
  if (isLoginOrSignUpRoute && isAuthenticated) {
    return NextResponse.redirect(new URL(APP_URL.home, req.url));
  }
  // // no token and access login
  if (!isAuthenticated && isLoginOrSignUpRoute) {
    return NextResponse.next();
  }
  // // no token access protected router

  const isPublicRoute = publicRoutes.some((route) => {
    const startsWithRegExp = new RegExp(`^${route}(\/|$)`);
    return startsWithRegExp.test(path);
  });
  // If user is not authenticated and trying to access a non-public route, redirect to login
  // console.log(publicRoutes.includes(req.nextUrl.pah))
  if (!isAuthenticated && !isPublicRoute) {
    const origin = path.slice(1);
    const search=(req.nextUrl.search.slice(1))
    return NextResponse.redirect(
      new URL(
        `${APP_URL.login}?${APP_PARAMS.origin}=${origin}&${search}`,
        req.url
      )
    );
  }
  return NextResponse.next();
}
