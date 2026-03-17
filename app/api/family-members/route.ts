import { backendFetch } from "@/services/backend";
import { ErrorCode } from "@/services/errors/ErrorCode";
import { buildFamilyMembersSearchPath } from "@/services/familyMembersService";
import { NextResponse } from "next/server";

// Función que devuelve la URL de la API de búsqueda de miembros de la familia.
export async function GET(req: Request) {
   try {
      // Obtenemos los parámetros de búsqueda de los miembros de la familia.
      const { searchParams } = new URL(req.url);
      // const page = Number(searchParams.get("page") ?? "0");
      // const size = Number(searchParams.get("size") ?? "10");

      // Construimos la URL de la API de búsqueda de miembros de la familia.
      const path = buildFamilyMembersSearchPath({
         familyId: searchParams.get("familyId") ?? "",
         // page: Number.isFinite(page) && page >= 0 ? Math.floor(page) : 0,
         // size: Number.isFinite(size) && size > 0 ? Math.floor(size) : 10,
      }).replace("/api", "");

      const data = await backendFetch(path);
      return NextResponse.json(data);

   } catch (e) {
      if (e instanceof ErrorCode) {
         return NextResponse.json({ message: e.message }, { status: e.status });
      }
      return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
   }
}

// Función que crea un familiar nuevo.
export async function POST(req: Request) {
   try {
      const body = await req.json();
      const data = await backendFetch("/family-members", {
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
