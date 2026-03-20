import { NextRequest, NextResponse } from "next/server";
import { isDemoMode } from "@/lib/demo";

// Rutas públicas de autenticación.
const AUTH_ROUTES = new Set([
   "/signin",
   "/signup",
   "/reset-password",
   "/verify-email",
   "/change-password",
]);

// Rutas protegidas por rol.
const USER_PROTECTED_PREFIXES = [
   "/dashboard",
   "/expenses",
   "/family-members",
   "/family",
   "/profile",
];

// Rutas protegidas por rol de administrador.
const ADMIN_PROTECTED_PREFIXES = [
   "/admin",
];

interface TokenPayload {
   isAdmin?: boolean;
   role?: string;
   roles?: string[] | string;
   exp?: number;
}

type UserRole = "admin" | "user";

// Función para decodificar el payload del token JWT.
function decodeJwtPayload(token: string): TokenPayload | null {
   const parts = token.split(".");
   if (parts.length < 2) return null;

   try {
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
      const json = atob(padded);
      return JSON.parse(json) as TokenPayload;

   } catch {
      return null;

   }
}

// Normalizamos diferentes formatos de rol que puedan venir en el token.
function extractRoleFromPayload(payload: TokenPayload): UserRole | null {
   // Si el rol está en el payload, lo usamos directamente.
   if (typeof payload.isAdmin === "boolean") return payload.isAdmin ? "admin" : "user";

   // Si el rol está en el payload, lo usamos directamente.
   if (typeof payload.role === "string") {
      const normalizedRole = payload.role.toLowerCase();
      if (normalizedRole === "admin") return "admin";
      if (normalizedRole === "user") return "user";
   }

   // Convertimos a array si es un string.
   const roles = Array.isArray(payload.roles) ? payload.roles : payload.roles ? [payload.roles] : [];
   const normalizedRoles = roles.map((role) => String(role).toLowerCase());
   if (normalizedRoles.includes("admin") || normalizedRoles.includes("role_admin")) return "admin";
   if (normalizedRoles.includes("user") || normalizedRoles.includes("role_user")) return "user";

   return null;
}

// Intentamos inferir rol desde JWT cuando no existe cookie de rol.
function getRoleFromToken(token: string | undefined): UserRole | null {
   if (!token) return null;

   const payload = decodeJwtPayload(token);
   if (!payload) return null;

   return extractRoleFromPayload(payload);
}

// La cookie de rol es la fuente principal para middleware.
function getRoleFromCookie(req: NextRequest): UserRole | null {
   const roleCookie = req.cookies.get("role")?.value;
   if (roleCookie === "admin" || roleCookie === "user") return roleCookie;
   return null;
}

function isTokenExpired(token: string | undefined): boolean {
   if (!token) return true;

   const payload = decodeJwtPayload(token);
   if (!payload?.exp) return false;

   const nowInSeconds = Math.floor(Date.now() / 1000);
   return payload.exp <= nowInSeconds;
}

function clearAuthCookies(response: NextResponse) {
   response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
   });
   response.cookies.set("role", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
   });
   return response;
}

// Función para verificar la autenticidad del token JWT.
export function middleware(req: NextRequest) {
   if (isDemoMode) {
      return NextResponse.next();
   }

   const { pathname, search } = req.nextUrl;
   const token = req.cookies.get("token")?.value;
   const roleFromCookie = getRoleFromCookie(req);
   const isAuthRoute = AUTH_ROUTES.has(pathname);
   const isUserProtectedRoute = USER_PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
   const isAdminProtectedRoute = ADMIN_PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
   const isProtectedRoute = isUserProtectedRoute || isAdminProtectedRoute;
   const hasValidToken = Boolean(token) && !isTokenExpired(token);
   const role = hasValidToken ? roleFromCookie ?? getRoleFromToken(token) : null;

   // Validación de sesión.
   if ((!hasValidToken || !role) && isProtectedRoute) {
      const signInUrl = new URL("/signin", req.url);
      signInUrl.searchParams.set("next", `${pathname}${search}`);
      return clearAuthCookies(NextResponse.redirect(signInUrl));
   }

   // Redirección por rol para evitar navegación no permitida.
   if (hasValidToken && role && isAuthRoute) {
      const destination = role === "admin" ? "/admin/users" : "/dashboard";
      return NextResponse.redirect(new URL(destination, req.url));
   }

   // Si hay cookie de token pero ya no es válida, permitimos entrar en auth y limpiamos estado.
   if (!hasValidToken && token && isAuthRoute) {
      return clearAuthCookies(NextResponse.next());
   }

   // Redirección por rol para evitar navegación no permitida.
   if (hasValidToken && role === "admin" && isUserProtectedRoute) {
      return NextResponse.redirect(new URL("/admin/users", req.url));
   }

   // Redirección por rol para evitar navegación no permitida.
   if (hasValidToken && role === "user" && isAdminProtectedRoute) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
   }

   return NextResponse.next();
}

// Configuración de middleware.
export const config = {
   matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
