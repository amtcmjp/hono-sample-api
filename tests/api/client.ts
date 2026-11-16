const baseUrl = process.env.BASE_URL;

if (!baseUrl) {
  throw new Error("BASE_URL is required.");
}

type ApiResult<TResponse> = {
  status: number;
  body: TResponse;
};

export async function getApi<TResponse = unknown>(
  path: string,
  params?: Record<string, string | number | boolean>,
): Promise<ApiResult<TResponse>> {
  const full_url = `${baseUrl}${path}`;

  const url = new URL(full_url);
  console.log(url);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const body = (await response.json()) as TResponse;

  return {
    status: response.status,
    body,
  };
}

export async function callApi<TResponse = unknown>(
  path: string,
  payload: Record<string, unknown>,
): Promise<ApiResult<TResponse>> {
  const url = `${baseUrl}${path}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = (await response.json()) as TResponse;

  return {
    status: response.status,
    body,
  };
}

export async function postApiStream(
  path: string,
  payload: Record<string, unknown>,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal,
): Promise<number> {
  const url = new URL(`${baseUrl}${path}`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/plain",
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  if (!response.body) {
    throw new Error("Response body is empty.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value, {
        stream: true,
      });

      onChunk(chunk);
    }

    const remaining = decoder.decode();

    if (remaining) {
      onChunk(remaining);
    }
  } finally {
    reader.releaseLock();
  }

  return response.status;
}

export function printResponse(label: string, result: ApiResult<unknown>): void {
  console.log(`=== ${label} ===`);
  console.log(`status: ${result.status}`);
  console.log(JSON.stringify(result.body, null, 2));
}
