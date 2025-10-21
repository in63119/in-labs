import { NextRequest, NextResponse } from "next/server";

const REALM = "InLabsAdmin";

const unauthorizedResponse = (message?: string) =>
  new Response(message ?? "Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
    },
  });

const decodeBase64 = (value: string) => {
  if (typeof atob === "function") {
    return atob(value);
  }

  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "base64").toString("utf-8");
  }

  throw new Error("Base64 decoding is not supported in this environment.");
};

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const username = process.env.ADMIN_USERNAME ?? "admin";
  const privateKey = process.env.ADMIN_PRIVATE_KEY;

  if (!privateKey) {
    return new Response("Admin credentials are not configured.", {
      status: 500,
    });
  }

  const authorization = request.headers.get("authorization");
  if (!authorization || !authorization.startsWith("Basic ")) {
    return unauthorizedResponse();
  }

  const base64Credentials = authorization.replace("Basic ", "");

  let decoded = "";
  try {
    decoded = decodeBase64(base64Credentials);
  } catch {
    return unauthorizedResponse("Invalid authorization header.");
  }

  if (!decoded.includes(":")) {
    return unauthorizedResponse("Invalid authorization header.");
  }

  const [incomingUser, ...rest] = decoded.split(":");
  const incomingSecret = rest.join(":");

  const isAuthorized =
    incomingUser === username && incomingSecret === privateKey;

  if (!isAuthorized) {
    return unauthorizedResponse("Invalid credentials.");
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
