/**
 * Unified API Client for The Indian Wings Company
 * 
 * Directs traffic seamlessly between:
 * - Local / Monolith mode (relative /api routes)
 * - Standalone Backend mode on Render (via NEXT_PUBLIC_BACKEND_URL)
 * 
 * Automatically includes credentials ('include') for cross-origin admin sessions.
 */

const BACKEND_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/+$/, '');

export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (!BACKEND_BASE) {
    return cleanPath;
  }
  return `${BACKEND_BASE}${cleanPath}`;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string; [key: string]: unknown }> {
  const url = getApiUrl(path);
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: options.credentials ?? 'include',
  });

  const contentType = response.headers.get('content-type');
  let data: Record<string, unknown> = {};

  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = {};
    }
  }

  if (!response.ok) {
    return {
      success: false,
      error: (data.error as string) || `Request failed with status ${response.status}`,
      status: response.status,
      ...data,
    };
  }

  return {
    success: true,
    ...data,
  };
}

export const apiClient = {
  get: <T = unknown>(path: string, options?: RequestInit) =>
    apiFetch<T>(path, { ...options, method: 'GET' }),

  post: <T = unknown>(path: string, body?: unknown, options?: RequestInit) =>
    apiFetch<T>(path, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  put: <T = unknown>(path: string, body?: unknown, options?: RequestInit) =>
    apiFetch<T>(path, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  delete: <T = unknown>(path: string, options?: RequestInit) =>
    apiFetch<T>(path, { ...options, method: 'DELETE' }),
};
