import * as z from "zod";
import { createInsertSchema } from "drizzle-zod";
import { groups, users } from "./schema";

export const SignupFormSchema = createInsertSchema(users, {
  displayName: (schema) =>
    schema.trim().min(2, { error: "Name must be at least 2 characters long." }),
  username: (schema) =>
    schema
      .trim()
      .min(2, { error: "Username must be at least 2 characters long." }),
})
  .pick({
    displayName: true,
    username: true,
  })
  .extend({
    password: z
      .string()
      .min(8, { error: "Be at least 8 characters long" })
      .regex(/[a-zA-Z]/, {
        error: "Contain at least one letter.",
      })
      .regex(/[0-9]/, {
        error: "Contain at least one number.",
      })
      .regex(/[^a-zA-Z0-9]/, {
        error: "Contain at least one special character.",
      }),
  });

export type SignupInput = z.infer<typeof SignupFormSchema>;

export const CreateGroupFormSchema = createInsertSchema(groups, {
  name: (schema) =>
    schema.trim().min(2, { error: "Name must be at least 2 characters long." }),
  description: (schema) =>
    schema
      .trim()
      .min(3, { error: "Description must be at least 3 characters long." }),
  submissionWindowDays: z.coerce
    .number()
    .int()
    .positive({ error: "Submission window must be at least 1 day." }),
  votingWindowDays: z.coerce
    .number()
    .int()
    .positive({ error: "Voting window must be at least 1 day." }),
}).pick({
  name: true,
  description: true,
  submissionWindowDays: true,
  votingWindowDays: true,
});

export type CreateGroupInput = z.infer<typeof CreateGroupFormSchema>;

export type FormState =
  | {
      errors?: {
        displayName?: string[];
        username?: string[];
        password?: string[];
        name?: string[];
        description?: string[];
        submissionWindowDays?: string[];
        votingWindowDays?: string[];
        submissionDeadline?: string[];
        votingDeadline?: string[];
        groupId?: string[];
      };
      message?: string;
    }
  | undefined;

export const LoginFormSchema = SignupFormSchema.pick({ username: true }).extend(
  {
    password: z.string().min(1, { error: "Enter your password." }),
  },
);

export type LoginInput = z.infer<typeof LoginFormSchema>;

export const CreateRoundFormSchema = z
  .object({
    groupId: z.uuid({ error: "A valid group is required." }),
    name: z
      .string()
      .trim()
      .min(2, { error: "Name must be at least 2 characters long." }),
    description: z
      .string()
      .trim()
      .min(3, { error: "Description must be at least 3 characters long." }),
    submissionDeadline: z.iso
      .date()
      .refine((date) => date > new Date().toISOString().slice(0, 10), {
        error: "Submission deadline must be after today (UTC).",
      }),
    votingDeadline: z.iso
      .date()
      .refine((date) => date > new Date().toISOString().slice(0, 10), {
        error: "Voting deadline must be after today (UTC).",
      }),
  })
  .refine((data) => data.votingDeadline > data.submissionDeadline, {
    path: ["votingDeadline"],
    error: "Voting deadline must be after the submission deadline.",
  });

export type CreateRoundInput = z.infer<typeof CreateRoundFormSchema>;
