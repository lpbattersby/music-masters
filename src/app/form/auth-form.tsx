"use client";

import { login, signup } from "@/app/actions/auth";
import GeneratedForm, {
  type FormAction,
  type GeneratedField,
} from "@/app/form/generated-form";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

type AuthMode = "login" | "signup";

export default function AuthForm({ mode }: { mode: AuthMode }) {
  return mode === "signup" ? (
    <AuthFormContent mode={mode} action={signup} />
  ) : (
    <AuthFormContent mode={mode} action={login} />
  );
}

function AuthFormContent({
  mode,
  action,
}: {
  mode: AuthMode;
  action: FormAction;
}) {
  const isSignup = mode === "signup";
  const fields: GeneratedField[] = [
    { name: "username", label: "Username", autoComplete: "username" },
    ...(isSignup
      ? [
          {
            name: "displayName" as const,
            label: "Display Name",
            autoComplete: "nickname",
          },
        ]
      : []),
    {
      name: "password",
      label: "Password",
      type: "password",
      autoComplete: isSignup ? "new-password" : "current-password",
      helperTextComponent: "div",
      helperText: (errors) =>
        errors.length > 0 && (
          <>
            Password must:
            <ul>
              {errors.map((error) => (
                <li key={error}>- {error}</li>
              ))}
            </ul>
          </>
        ),
    },
  ];

  return (
    <GeneratedForm
      action={action}
      ariaLabel={isSignup ? "Sign up" : "Login"}
      fields={fields}
      title={isSignup ? "Sign Up" : "Login"}
      buttonFullWidth
      footer={
        <Typography variant="body2">
          {isSignup ? (
            <>
              Already have an account? <Link href="/login">Log in</Link>
            </>
          ) : (
            <>
              {"Don't have an account?"} <Link href="/signup">Sign up</Link>
            </>
          )}
        </Typography>
      }
    />
  );
}
