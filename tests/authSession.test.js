import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiGet } from '../src/services/api.js';
import {
  clearSession,
  getSessionRefreshToken,
  getSessionToken,
  getSessionTokenExpiry,
  getSessionUserId,
  saveSession
} from '../src/services/authSession.js';

const createToken = exp => `header.${btoa(JSON.stringify({ exp }))}.signature`;

describe('auth session', () => {
  let storage;

  beforeEach(() => {
    const values = new Map();
    storage = {
      getItem: key => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, String(value)),
      removeItem: key => values.delete(key)
    };
    vi.stubGlobal('sessionStorage', storage);
    vi.stubGlobal('window', { dispatchEvent: vi.fn() });
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => vi.unstubAllGlobals());

  it('stores the token and user id for the current browser tab', () => {
    const token = createToken(Math.floor(Date.now() / 1000) + 60);
    const refreshToken = createToken(Math.floor(Date.now() / 1000) + 3600);
    saveSession(token, 12, refreshToken);

    expect(getSessionToken()).toBe(token);
    expect(getSessionRefreshToken()).toBe(refreshToken);
    expect(getSessionUserId()).toBe('12');
  });

  it('exposes an expired access token for refresh while its refresh token remains valid', () => {
    const token = createToken(Math.floor(Date.now() / 1000) - 60);
    saveSession(token, 12, createToken(Math.floor(Date.now() / 1000) + 3600));

    expect(getSessionToken()).toBe(token);
    expect(getSessionTokenExpiry()).toBeLessThan(Date.now());
    expect(getSessionRefreshToken()).not.toBeNull();
  });

  it('clears all session data when logging out', () => {
    saveSession(
      createToken(Math.floor(Date.now() / 1000) + 60),
      12,
      createToken(Math.floor(Date.now() / 1000) + 3600)
    );

    clearSession();

    expect(getSessionToken()).toBeNull();
    expect(getSessionRefreshToken()).toBeNull();
    expect(getSessionUserId()).toBeNull();
  });

  it('renews an expired access token before making the API request', async () => {
    const refreshToken = createToken(Math.floor(Date.now() / 1000) + 3600);
    saveSession(createToken(Math.floor(Date.now() / 1000) - 60), 12, refreshToken);
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          token: createToken(Math.floor(Date.now() / 1000) + 900),
          refreshToken: createToken(Math.floor(Date.now() / 1000) + 3600),
          idUsuario: 12
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => '{"id":12}'
      });

    await expect(apiGet('/users/12')).resolves.toEqual({ id: 12 });

    expect(fetch).toHaveBeenNthCalledWith(
      1,
      '/api/v1/auth/refresh',
      expect.objectContaining({ method: 'POST' })
    );
    expect(fetch.mock.calls[1][1].headers.Authorization).toBe(
      `Bearer ${getSessionToken()}`
    );
  });
});
