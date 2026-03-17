import { requireAdminApi } from "@/lib/authorize";
import { backendFetch } from "@/services/backend";
import { buildCategoriesSearchPath } from "@/services/categoriesService";
import { ErrorCode } from "@/services/errors/ErrorCode";
import { NextResponse } from "next/server";

// Función que devuelve la URL de la API de búsqueda de categorías.
export async function GET(req: Request) {
   try {
      const authError = await requireAdminApi();
      if (authError) return authError;

      // Obtenemos los parámetros de búsqueda de categorías.
      const { searchParams } = new URL(req.url);

      // Construimos la URL de la API de búsqueda de categorías.
      const path = buildCategoriesSearchPath({
         search: searchParams.get("search") ?? "",
         page: searchParams.get("page") ? Number(searchParams.get("page")) : 0,
         size: searchParams.get("size") ? Number(searchParams.get("size")) : 10,
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

// Función que realiza la creación de una categoría.
export async function POST(req: Request) {
   try {
      const authError = await requireAdminApi();
      if (authError) return authError;
      
      const body = await req.json();
      const data = await backendFetch("/categories", {
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
