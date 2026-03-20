import { NextResponse } from "next/server";
import { DEMO_AUTH_TOKEN, isDemoMode } from "@/lib/demo";

export async function POST(req: Request) {
   const body = await req.json();

   if (isDemoMode) {
      const response = NextResponse.json({
         isAdmin: false,
         token: DEMO_AUTH_TOKEN,
         message: "Demo mode login successful.",
      });

      response.cookies.set("token", DEMO_AUTH_TOKEN, {
         httpOnly: true,
         sameSite: "lax",
         secure: process.env.NODE_ENV === "production",
         path: "/",
      });
      response.cookies.set("role", "user", {
         httpOnly: true,
         sameSite: "lax",
         secure: process.env.NODE_ENV === "production",
         path: "/",
      });

      return response;
   }

   try{
      if (!process.env.SPRING_API_URL) {
         return NextResponse.json(
            {
               error: "SPRING_API_URL is not configured",
               status: 500,
            },
            { status: 500 }
         );
      }

      // Realizar la solicitud al backend de Spring Boot
      const res = await fetch(`${process.env.SPRING_API_URL}/auth/login`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(body)
      });

      // Obtener el tipo de contenido de la respuesta
      const contentType = res.headers.get("content-type");

      // Verificar si el tipo de contenido es JSON
      const isJson = contentType?.includes("application/json");

      // Extraer el payload de la respuesta
      const payload = isJson ? await res.json() : null;

      // Verificar si la respuesta es exitosa
      if (!res.ok) {
         return NextResponse.json(
            {
               error: payload?.message ?? "Authentication failed",
               status: res.status,
            },
            { status: res.status }
         );
      }

      // Guardar JWT en cookie httpOnly
      const response = NextResponse.json(payload);
      response.cookies.set("token", payload.token, {
         httpOnly: true,
         sameSite: "lax",
         secure: process.env.NODE_ENV === "production",
         path: "/",
      });

      // Guardar rol en cookie para que middleware pueda decidir redirecciones sin depender del claim JWT.
      if (typeof payload?.isAdmin === "boolean") {
         response.cookies.set("role", payload.isAdmin ? "admin" : "user", {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
         });
      }

      return response;

   } catch (error) {
      console.error("Login API error:", error);

      return NextResponse.json(
         {
            error: "Service unavailable",
            status: 503,
         },
         { status: 503 }
      );
   }
}
