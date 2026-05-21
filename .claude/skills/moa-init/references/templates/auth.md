# 인증 파일 템플릿

## middleware.ts (관리자 인증만)

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    // TODO: 관리자 세션 확인 로직 추가
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

## middleware.ts (사용자 인증만)

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const protectedRoutes = ['/dashboard', '/profile']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute) {
    // TODO: 사용자 세션 확인 로직 추가
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|auth).*)'],
}
```

## middleware.ts (관리자 + 사용자 인증 모두)

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    // TODO: 관리자 세션 확인 로직 추가
  }

  const protectedRoutes = ['/dashboard', '/profile']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute) {
    // TODO: 사용자 세션 확인 로직 추가
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

---

## lib/auth.ts (사용자 인증 + Supabase)

```typescript
import { supabase } from './supabase'

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
```

## lib/auth.ts (사용자 인증, Supabase 없음)

```typescript
// TODO: 인증 방식에 맞게 구현 필요

export async function signIn(email: string, password: string) {
  throw new Error('Not implemented')
}

export async function signOut() {
  throw new Error('Not implemented')
}

export async function getSession() {
  return null
}
```

---

## app/admin/layout.tsx

```typescript
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {/* TODO: 관리자 레이아웃 구성 */}
      {children}
    </div>
  )
}
```

## app/admin/page.tsx

```typescript
export default function AdminPage() {
  return (
    <div>
      <h1>관리자 대시보드</h1>
      {/* TODO: 관리자 페이지 구성 */}
    </div>
  )
}
```

## app/(auth)/login/page.tsx

```typescript
export default function LoginPage() {
  return (
    <div>
      <h1>로그인</h1>
      {/* TODO: 로그인 폼 구성 */}
    </div>
  )
}
```

## app/(auth)/signup/page.tsx

```typescript
export default function SignupPage() {
  return (
    <div>
      <h1>회원가입</h1>
      {/* TODO: 회원가입 폼 구성 */}
    </div>
  )
}
```
