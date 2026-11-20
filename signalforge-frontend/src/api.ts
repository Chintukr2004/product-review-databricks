export type HealthStatus = 'healthy' | 'needs_attention' | 'critical' | 'insufficient_data';
export type Product = {
  productId: string; name: string; category: string;
  metrics: { reviewCount: number; avgRating: number | null; negativePct: number | null };
  health: { status: HealthStatus; label: string }; topComplaint: string | null; flagged: boolean;
};
export type ProductDetail = Product & {
  summary: string; nextStep: string;
  highlightReview: { text: string; rating: number; sentiment: string } | null;
  topCategories: { category: string; count: number }[];
  sentimentBreakdown: { sentiment: string; count: number }[];
};

const base = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
export function apiUrl(path: string) { return `${base}${path.startsWith('/') ? path : `/${path}`}`; }
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try { response = await fetch(apiUrl(path), { ...init, headers: { Accept: 'application/json', ...(init?.body ? { 'Content-Type': 'application/json' } : {}), ...init?.headers } }); }
  catch { throw new Error('Could not reach the API. Check the Render service URL and whether the backend is awake.'); }
  const body = await response.text();
  let data: any = {};
  try { data = body ? JSON.parse(body) : {}; } catch { /* non-JSON response */ }
  if (!response.ok) throw new Error(data.error || data.message || `API request failed (${response.status})`);
  return data as T;
}
export const api = {
  products: () => request<{ products: Product[] }>('/api/products'),
  product: (id: string) => request<ProductDetail>(`/api/products/${encodeURIComponent(id)}`),
  health: () => request<{ ok: boolean; services: { databricks: boolean; lakebase: boolean } }>('/api/health'),
  setFlag: (id: string, flagged: boolean) => request<{ productId: string; flagged: boolean }>(`/api/products/${encodeURIComponent(id)}/flag`, { method: 'PUT', body: JSON.stringify({ flagged }) }),
};
