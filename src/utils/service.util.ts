const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL!;

export async function callApi<T>(
  config: RequestInit & {
    url: string;
    params?: Record<string, string>;
    data?: any;
  }
): Promise<{ ok: boolean; result?: T }> {
  try {
    const response = await fetch(`${BASE_URL}${config.url}`, {
      credentials: config.credentials || "include",
      method: config.method || "GET",
      headers: config.headers,
      body: config.data ? JSON.stringify(config.data) : undefined,
    });
    if (!response.ok) {
      return { ok: false };
    }
    const result = await response.json();
    return { ok: true, result };
  } catch (error) {
    console.log(error);
    return { ok: false };
  }
}
