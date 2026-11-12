import { NextResponse } from "next/server";

import { createUser, listUsers } from "@/lib/users";
import { createUserSchema } from "@/lib/validation";

// GET /api/users — list all users.
export async function GET() {
  const users = await listUsers();
  return NextResponse.json({ users });
}

// POST /api/users — create a user. Body: { email, displayName }.
export async function POST(request: Request) {
  const json = await request.json().catch(() => null);

  const parsed = createUserSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid request body.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const user = await createUser(parsed.data);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        { error: "A user with that email already exists." },
        { status: 409 },
      );
    }
    throw error;
  }
}

/**
 * Drizzle wraps driver errors, so the SQLite constraint code lives on the
 * nested `cause` chain rather than the top-level message. Walk the chain.
 */
function isUniqueConstraintError(error: unknown): boolean {
  let current: unknown = error;
  while (current instanceof Error) {
    const code = (current as { code?: unknown }).code;
    if (code === "SQLITE_CONSTRAINT_UNIQUE" || code === "SQLITE_CONSTRAINT") {
      return true;
    }
    if (current.message.includes("UNIQUE constraint failed")) {
      return true;
    }
    current = current.cause;
  }
  return false;
}
