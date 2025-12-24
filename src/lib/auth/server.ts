import { cookies, headers } from "next/headers";
import { User } from "./types";

export async function getServerAuth(): Promise<User | null> {
  const cookieStore = await cookies();
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  const token = cookieStore.get("access_token");

  if (!token?.value) {
    return null;
  }

  try {
    const response = await fetch(`${protocol}://${host}/api/auth/current`, {
      headers: {
        cookie: `access_token=${token.value}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}
