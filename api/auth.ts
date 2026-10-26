import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";

const cookieName = "portfolio_admin_session";
const sessionDurationSeconds = 60 * 60 * 12;

type AuthRequest = IncomingMessage & { body?: unknown };

function sendJson(
  response: ServerResponse,
  status: number,
  body: Record<string, unknown>,
) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.statusCode = status;
  response.end(JSON.stringify(body));
}

function constantTimeEqual(left: string, right: string): boolean {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function createSession(secret: string): string {
  const payload = Buffer.from(
    JSON.stringify({
      expiresAt: Math.floor(Date.now() / 1000) + sessionDurationSeconds,
      nonce: randomBytes(16).toString("base64url"),
    }),
  ).toString("base64url");

  return `${payload}.${sign(payload, secret)}`;
}

function getCookie(request: IncomingMessage, name: string): string | undefined {
  const cookieHeader = request.headers.cookie;
  if (!cookieHeader) return undefined;

  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  return cookie?.slice(name.length + 1);
}

function isSameOriginRequest(request: IncomingMessage): boolean {
  const origin = request.headers.origin;
  const host = request.headers.host;
  if (!origin || !host) return false;

  try {
    return new URL(origin).host.toLowerCase() === host.toLowerCase();
  } catch {
    return false;
  }
}

function hasValidSession(request: IncomingMessage, secret: string): boolean {
  const token = getCookie(request, cookieName);
  if (!token) return false;

  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return false;

  const expectedSignature = sign(payload, secret);
  if (!constantTimeEqual(signature, expectedSignature)) return false;

  try {
    const session: unknown = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );

    return (
      typeof session === "object" &&
      session !== null &&
      "expiresAt" in session &&
      typeof session.expiresAt === "number" &&
      session.expiresAt > Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}

function setSessionCookie(
  request: IncomingMessage,
  response: ServerResponse,
  value: string,
) {
  const secure =
    request.headers["x-forwarded-proto"] === "https" ||
    process.env.NODE_ENV === "production";
  const secureAttribute = secure ? "; Secure" : "";

  response.setHeader(
    "Set-Cookie",
    `${cookieName}=${value}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${sessionDurationSeconds}${secureAttribute}`,
  );
}

export default function handler(
  request: AuthRequest,
  response: ServerResponse,
) {
  const secret = process.env.AUTH_SESSION_SECRET;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (
    !secret ||
    secret.length < 32 ||
    !adminEmail ||
    !adminPassword
  ) {
    sendJson(response, 500, {
      error: "Server authentication is not configured.",
    });
    return;
  }

  const action = new URL(
    request.url ?? "/api/auth",
    `https://${request.headers.host ?? "localhost"}`,
  ).searchParams.get("action");

  if (
    request.method === "POST" &&
    (action === "login" || action === "logout") &&
    !isSameOriginRequest(request)
  ) {
    sendJson(response, 403, { error: "Cross-origin request rejected." });
    return;
  }

  if (request.method === "GET" && action === "session") {
    sendJson(response, 200, {
      authenticated: hasValidSession(request, secret),
    });
    return;
  }

  if (request.method === "POST" && action === "login") {
    const body = request.body;
    if (
      typeof body !== "object" ||
      body === null ||
      !("email" in body) ||
      !("password" in body) ||
      typeof body.email !== "string" ||
      typeof body.password !== "string"
    ) {
      sendJson(response, 400, { error: "Invalid login request." });
      return;
    }

    const emailMatches = constantTimeEqual(
      body.email.trim().toLowerCase(),
      adminEmail.trim().toLowerCase(),
    );
    const passwordMatches = constantTimeEqual(
      body.password,
      adminPassword,
    );

    if (!emailMatches || !passwordMatches) {
      sendJson(response, 401, {
        error: "The email or password you entered is incorrect.",
      });
      return;
    }

    setSessionCookie(request, response, createSession(secret));
    sendJson(response, 200, { authenticated: true });
    return;
  }

  if (request.method === "POST" && action === "logout") {
    const secure =
      request.headers["x-forwarded-proto"] === "https" ||
      process.env.NODE_ENV === "production";
    const secureAttribute = secure ? "; Secure" : "";
    response.setHeader(
      "Set-Cookie",
      `${cookieName}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${secureAttribute}`,
    );
    sendJson(response, 200, { authenticated: false });
    return;
  }

  sendJson(response, 404, { error: "Authentication endpoint not found." });
}
