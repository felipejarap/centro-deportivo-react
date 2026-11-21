const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export async function apiRequest(path, { method = 'GET', body } = {}) {
  const headers = { Accept: 'application/json' };
  const token = localStorage.getItem('token');

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
    localStorage.removeItem('token');
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
