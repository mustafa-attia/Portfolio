type AuthResponse = {
  authenticated: boolean;
  error?: string;
};

async function requestAuth(
  action: "session" | "login" | "logout",
  method: "GET" | "POST",
  body?: { email: string; password: string },
): Promise<AuthResponse> {
  const response = await fetch(`/api/auth?action=${action}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "same-origin",
    cache: "no-store",
  });

  const result: unknown = await response.json().catch(() => null);
  const authResult =
    typeof result === "object" && result !== null
      ? (result as AuthResponse)
      : null;

  if (!response.ok) {
    if (response.status === 401 && action === "login") {
      return { authenticated: false };
    }

    throw new Error(
      authResult?.error ?? "The authentication service is unavailable.",
    );
  }

  if (
    !authResult ||
    typeof authResult.authenticated !== "boolean"
  ) {
    throw new Error("The authentication service returned an invalid response.");
  }

  return authResult;
}

export async function checkAuthSession(): Promise<boolean> {
  const result = await requestAuth("session", "GET");
  return result.authenticated;
}

export async function signIn(
  email: string,
  password: string,
): Promise<boolean> {
  const result = await requestAuth("login", "POST", { email, password });
  return result.authenticated;
}

export async function signOut(): Promise<void> {
  await requestAuth("logout", "POST");
}
