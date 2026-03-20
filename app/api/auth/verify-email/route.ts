import { ErrorCode } from "@/services/errors/ErrorCode";
import { isDemoMode } from "@/lib/demo";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
   const token = req.nextUrl.searchParams.get("token");

   if (isDemoMode) {
      return NextResponse.json({
         ok: true,
         token,
         message: "Demo mode: email verification simulated successfully.",
      });
   }

   try{
      if (!process.env.SPRING_API_URL) {
         return NextResponse.json({ message: "SPRING_API_URL is not configured" }, { status: 500 });
      }

      // Realizar la solicitud al backend de Spring Boot
      const response = await fetch(`${process.env.SPRING_API_URL}/auth/verify-email?token=${token}`, {
         method: "GET",
         headers: { "Content-Type": "application/json" },
      });
      
      // Extraer el payload de la respuesta y manejar errores según el status code
      const body = await response.json();
      if (!response.ok) return NextResponse.json(body, { status: response.status });

      return NextResponse.json(body);

   } catch (e) {
      if (e instanceof ErrorCode) {
         return NextResponse.json({ message: e.message }, { status: e.status });
      }

      return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
   }
}
