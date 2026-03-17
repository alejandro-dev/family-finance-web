import { backendFetch } from "@/services/backend";
import { ErrorCode } from "@/services/errors/ErrorCode";
import { NextResponse } from "next/server";

// Función que obtiene la información de un familiar por su ID.
export async function GET(_req: Request, context: RouteContext<"/api/family-members/[id]">) {
   try {
      const { id } = await context.params;

      const data = await backendFetch(`/family-members/${id}`, {
         method: "GET",
      });

      return NextResponse.json(data);

   } catch (e) {
      if (e instanceof ErrorCode) {
         return NextResponse.json({ message: e.message }, { status: e.status });
      }

      return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
   }
}

// Función actualiza un familiar.
export async function PUT(req: Request, context: RouteContext<"/api/family-members/[id]">) {
   try {
      const { id } = await context.params;
      const body = await req.json();

      const data = await backendFetch(`/family-members/${id}`, {
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
