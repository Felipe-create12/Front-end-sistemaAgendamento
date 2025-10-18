import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token") || request.headers.get("Authorization")

  // Rotas protegidas
  if (!token && request.nextUrl.pathname.startsWith("/agendamentos")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}
