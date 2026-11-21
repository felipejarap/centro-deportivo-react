const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_ID_KEY = 'kronofit_user_id';

function readExpiration(token) {
  if (!token) return null;
  try {
    const encodedPayload = token.split('.')[1];
    if (!encodedPayload) return null;
    const payload = JSON.parse(atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/')));
    return Number.isFinite(payload.exp) ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function getSessionToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getSessionRefreshToken() {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getSessionTokenExpiry() {
  return readExpiration(getSessionToken());
}

export function getSessionRefreshTokenExpiry() {
  return readExpiration(getSessionRefreshToken());
}

export function saveSession(token, userId, refreshToken) {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_ID_KEY, String(userId));
  if (refreshToken) {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } else {
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export function getSessionUserId() {
  return sessionStorage.getItem(USER_ID_KEY);
}

export function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(USER_ID_KEY);
}
