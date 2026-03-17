import { backendFetch } from "@/services/backend";
import { ErrorCode } from "@/services/errors/ErrorCode";
import { buildTotalExpensesPath } from "@/services/expensesService";
import { NextResponse } from "next/server";

// Función para consultar el total de gastos.
export async function GET(req: Request) {
   try {
      const { searchParams } = new URL(req.url);

      // Reutilizamos el mismo builder que usa el cliente y adaptamos a backend real.
      const path = buildTotalExpensesPath({
         userId: searchParams.get("userId") ?? "",
         familyId: searchParams.get("familyId") ?? "",
         startDate: searchParams.get("startDate") ?? "",
         endDate: searchParams.get("endDate") ?? "",
         categoryId: searchParams.get("categoryId") ?? "",
         familyMemberId: searchParams.get("familyMemberId") ?? "",
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
