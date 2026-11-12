import { z } from "zod";

export const createUserSchema = z.object({
  email: z.email(),
  displayName: z.string().trim().min(1, "displayName is required"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
