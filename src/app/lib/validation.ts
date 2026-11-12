import { z } from "zod";

export const createUserSchema = z.object({
  username: z.string().trim().min(1, "username is required"),
  displayName: z.string().trim().min(1, "displayName is required"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
