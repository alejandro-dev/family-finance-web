import { backendFetch } from "@/services/backend";
import { ErrorCode } from "@/services/errors/ErrorCode";
import { buildExpensesSearchPath } from "@/services/expensesService";
import { NextResponse } from "next/server";

// Función que devuelve la URL de la API de búsqueda de gastos.
export async function GET(req: Request) {
   try {
      const { searchParams } = new URL(req.url);
      // Sanitizamos paginación para no propagar valores inválidos al backend.
      const page = Number(searchParams.get("page") ?? "0");
      const size = Number(searchParams.get("size") ?? "10");

      // Reutilizamos el mismo builder que usa el cliente y adaptamos a backend real.
      const path = buildExpensesSearchPath({
         userId: searchParams.get("userId") ?? "",
         familyId: searchParams.get("familyId") ?? "",
         startDate: searchParams.get("startDate") ?? "",
         endDate: searchParams.get("endDate") ?? "",
         categoryId: searchParams.get("categoryId") ?? "",
         familyMemberId: searchParams.get("familyMemberId") ?? "",
         page: Number.isFinite(page) && page >= 0 ? Math.floor(page) : 0,
         size: Number.isFinite(size) && size > 0 ? Math.floor(size) : 10,
      }).replace("/api", "");

      const data = await backendFetch(path);
      return NextResponse.json(data);
      
   } catch (e) {
      // Normalizamos errores del backend para mantener contrato consistente en frontend.
      if (e instanceof ErrorCode) {
         return NextResponse.json({ message: e.message }, { status: e.status });
      }
      return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
   }
}

// Función que crea un gasto
export async function POST(req: Request) {
   try {
      const body = await req.json();
      const data = await backendFetch("/expenses", {
         method: "POST",
         body: JSON.stringify(body),
      });

      return NextResponse.json(data);

   } catch (e) {
      if (e instanceof ErrorCode) {
         return NextResponse.json({ message: e.message }, { status: e.status });
      }
      return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
   }
}
