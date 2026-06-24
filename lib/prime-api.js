const API_BASE =
  process.env.NEXT_PUBLIC_PRIME_API_URL || 'http://localhost:4000/v1';

async function request(path, options) {
  const response = await fetch(`${API_BASE}${path}`, options);
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.message || `Prime API request failed (${response.status}).`,
    );
  }

  return payload;
}

export const primeApi = {
  panel: {
    sales: (plant = '1201') =>
      request(`/prime/panel/sales/summary/stats?plant=${plant}`),
    production: (plant = '1201') =>
      request(`/prime/panel/production/get_data?plant=${plant}`),
  },
};
