import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  username: string;
  isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
  username: "",
  isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
  // A getter, so the value is read per request: `next build` collects page
  // data without needing the secret, and a request without it still throws.
  get password() {
    return process.env.SESSION_PASSWORD ?? "";
  },
  cookieName: "music-masters-login-session",
  cookieOptions: {
    // `secure: true` is the default and stays on in development: `pnpm dev`
    // serves the examples over real https through portless.
    secure: true,
  },
};

export async function getSession() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  );

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
    session.username = defaultSession.username;
  }

  return session;
}
