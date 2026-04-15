import { NextRequest } from "next/server";

export function getBackend(): string {
  return (process.env.BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");
}

export function forwardCookies(req: NextRequest, init: RequestInit): RequestInit {
  const cookie = req.headers.get("cookie") || "";
  const existing = init.headers as Record<string, string> | undefined;
  return {
    ...init,
    headers: { ...existing, ...(cookie ? { cookie } : {}) },
  };
}
