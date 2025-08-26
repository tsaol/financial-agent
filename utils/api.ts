import { CONFIG } from '@/config';

export const API_BASE_URL = `${CONFIG.API.BASE_URL}/api`;

export async function apiRequest(path: string, options = {}) {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  console.log(`API Request to: ${url}`);
  return fetch(url, options);
}