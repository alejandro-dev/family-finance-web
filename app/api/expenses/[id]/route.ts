import { backendFetch } from "@/services/backend";
import { ErrorCode } from "@/services/errors/ErrorCode";
import { NextResponse } from "next/server";

// Función actualiza un gasto.
export async function PUT(req: Request, context: RouteContext<"/api/expenses/[id]">) {
   try {
      const { id } = await context.params;
      const body = await req.json();

      const data = await backendFetch(`/expenses/${id}`, {
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

// Función que elimina un gasto.
export async function DELETE(_: Request, context: RouteContext<"/api/expenses/[id]">) {
   try {
      const { id } = await context.params;
      const data = await backendFetch(`/expenses/${id}`, {
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
