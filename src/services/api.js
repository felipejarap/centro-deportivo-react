import {
  clearSession,
  getSessionRefreshToken,
  getSessionRefreshTokenExpiry,
  getSessionToken,
  getSessionTokenExpiry,
  getSessionUserId,
  saveSession
} from './authSession.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';
let refreshInProgress;

export function refreshSession() {
  if (refreshInProgress) return refreshInProgress;

  refreshInProgress = (async () => {
    const refreshToken = getSessionRefreshToken();
    const refreshExpiresAt = getSessionRefreshTokenExpiry();
    if (!refreshToken || !refreshExpiresAt || refreshExpiresAt <= Date.now()) {
      clearSession();
      window.dispatchEvent(new Event('kronofit:unauthorized'));
      throw new Error('La sesión expiró. Inicia sesión nuevamente.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `******`
        }
      });
      if (!response.ok) {
        throw new Error(`No se pudo renovar la sesión (${response.status}).`);
      }

      const renewed = await response.json();
      if (!renewed?.token || !renewed?.refreshToken) {
        throw new Error('El servidor no entregó tokens renovados válidos.');
      }
      saveSession(renewed.token, renewed.idUsuario || getSessionUserId(), renewed.refreshToken);
      return renewed.token;
    } catch (error) {
      clearSession();
      window.dispatchEvent(new Event('kronofit:unauthorized'));
      throw error;
    } finally {
      refreshInProgress = null;
    }
  })();

  return refreshInProgress;
}

async function getValidSessionToken() {
  const token = getSessionToken();
  const expiresAt = getSessionTokenExpiry();
  if (!token) {
    return getSessionRefreshToken() ? refreshSession() : null;
  }
  if (!expiresAt) {
    clearSession();
    window.dispatchEvent(new Event('kronofit:unauthorized'));
    return null;
  }
  if (expiresAt - Date.now() <= 60_000) {
    return refreshSession();
  }
  return token;
}

export async function apiRequest(path, { method = 'GET', body } = {}) {
  const headers = { Accept: 'application/json' };
  const token = path === '/auth/refresh' ? getSessionRefreshToken() : await getValidSessionToken();

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  if (response.status === 401 && token) {
    clearSession();
    localStorage.removeItem('kronofit_current_user');
    window.dispatchEvent(new Event('kronofit:unauthorized'));
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `La solicitud falló (${response.status}).`);
  }

  if (response.status === 204) {
    return null;
  }

  const responseText = await response.text();
  return responseText ? JSON.parse(responseText) : null;
}

export const apiGet = path => apiRequest(path);
export const apiPost = (path, body) => apiRequest(path, { method: 'POST', body });
export const apiPut = (path, body) => apiRequest(path, { method: 'PUT', body });
export const apiDelete = path => apiRequest(path, { method: 'DELETE' });
