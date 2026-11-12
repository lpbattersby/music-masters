import { z } from "zod";

/**
 * Request validation schemas (Zod) — the runtime equivalent of a Pydantic
 * model. Parse untrusted input with `.safeParse()` to get both validation and
 * a fully-typed result. Kept separate from the DB schema; use `drizzle-zod` if
 * you'd rather derive these from the table definitions in `@/lib/schema`.
 */

export const createUserSchema = z.object({
  email: z.email(),
  displayName: z.string().trim().min(1, "displayName is required"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
