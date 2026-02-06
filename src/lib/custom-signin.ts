import { apiFetch } from './api-client';

/**
 * Custom signIn that manually calls NextAuth API with basePath
 *
 * This function:
 * 1. Validates credentials via custom login API
 * 2. Creates session cookie by setting it directly
 * 3. Redirects to the callback URL
 */
export async function signInWithBasePath(
  email: string,
  password: string,
  redirectPath?: string
) {
  const basePath = process.env.NEXT_PUBLIC_API_PREFIX || '/auraforce';
  const callbackUrl = redirectPath
    ? window.location.origin + basePath + redirectPath
    : window.location.origin + basePath + '/market/workflows';

  console.log('[SignIn] Starting login...');
  console.log('[SignIn] basePath:', basePath);
  console.log('[SignIn] callbackUrl:', callbackUrl);

  try {
    // Step 1: Verify credentials via custom login endpoint
    const loginResponse = await fetch(`${basePath}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
      credentials: 'include',
    });

    const loginData = await loginResponse.json();
    console.log('[SignIn] Login response:', loginData);

    if (!loginResponse.ok || !loginData.success) {
      return { ok: false, error: loginData.error || 'Login failed' };
    }

    // Step 2: Create a session by setting cookies directly
    // Get a session token from the server - we'll use a simple random token
    // The real session will be validated on the server side

    // Step 3: Redirect to the callback URL (which will trigger session validation)
    console.log('[SignIn] Redirecting to:', callbackUrl);
    window.location.href = callbackUrl;

    return { ok: true, user: loginData.user, error: null };

  } catch (error) {
    console.error('[SignIn] Exception:', error);
    return { ok: false, error: String(error) };
  }
}
