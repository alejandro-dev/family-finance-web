import { requireAdminApi } from "@/lib/authorize";
import { backendFetch } from "@/services/backend";
import { ErrorCode } from "@/services/errors/ErrorCode";
import { NextResponse } from "next/server";

// Función actualiza una categoría.
export async function PUT(req: Request, context: RouteContext<"/api/categories/[id]">) {
   try {
      const authError = await requireAdminApi();
      if (authError) return authError;

      const { id } = await context.params;
      const body = await req.json();

      const data = await backendFetch(`/categories/${id}`, {
         method: "PUT",
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

// Función que elimina una categoría.
export async function DELETE(_: Request, context: RouteContext<"/api/categories/[id]">) {
   try {
      const authError = await requireAdminApi();
      if (authError) return authError;
      
      const { id } = await context.params;
      const data = await backendFetch(`/categories/${id}`, {
         method: "DELETE",
      });

      return NextResponse.json(data ?? { success: true });
   } catch (e) {
      if (e instanceof ErrorCode) {
         return NextResponse.json({ message: e.message }, { status: e.status });
      }

      return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
   }
}
