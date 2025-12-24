import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { protectedRoutes, authRoutes } from "@/config/routes";

async function validateAuth(request: NextRequest): Promise<{ isAuthenticated: boolean; response: NextResponse }> {
  const token = request.cookies.get("access_token")?.value;
  let nextResponse = NextResponse.next();

  if (!token) {
    return { isAuthenticated: false, response: nextResponse };
  }

  const cookie = request.headers.get("cookie") || "";

  let response = await fetch(new URL("/api/auth/current", request.url), {
    headers: { cookie },
  });

  if (response.status === 401) {
    const refreshResponse = await fetch(new URL("/api/auth/refresh", request.url), {
      method: "POST",
      headers: { cookie },
    });

    if (refreshResponse.ok) {
      const setCookie = refreshResponse.headers.get("set-cookie");
      if (setCookie) {
        nextResponse = NextResponse.next();
        nextResponse.headers.set("set-cookie", setCookie);

        const newCookies = cookie.replace(/access_token=[^;]*/, `access_token=${setCookie.match(/access_token=([^;]*)/)?.[1] || ""}`);
        response = await fetch(new URL("/api/auth/current", request.url), {
          headers: { cookie: newCookies },
        });
      }
    }
  }

  return { isAuthenticated: response.ok, response: nextResponse };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  const { isAuthenticated, response } = await validateAuth(request);

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isAuthenticated) {
    const redirectResponse = NextResponse.redirect(new URL("/dashboard", request.url));
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      redirectResponse.headers.set("set-cookie", setCookie);
    }
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
