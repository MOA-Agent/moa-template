# 외부 API 연동 파일 템플릿

## lib/api/client.ts

```typescript
const BASE_URL = process.env.EXTERNAL_API_BASE_URL ?? ''
const API_KEY = process.env.EXTERNAL_API_KEY ?? ''

type RequestOptions = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}
```

## lib/api/types.ts

```typescript
export type ApiResponse<T> = {
  data: T
  message?: string
}

export type ApiError = {
  status: number
  message: string
}
```
