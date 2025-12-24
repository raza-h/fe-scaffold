import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const DUMMY_USER = {
  id: "1",
  email: "john@example.com",
  name: "John Doe",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  role: "user",
  createdAt: "2024-01-01T00:00:00.000Z",
};

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");

  if (!token?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!token.value.startsWith("dummy_access_token_") && !token.value.startsWith("refreshed_access_token_")) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  return NextResponse.json(DUMMY_USER);
}
