import { backendFetch } from "@/services/backend";
import { ErrorCode } from "@/services/errors/ErrorCode";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
   const body = await req.json();

   try{
      // Realizar la solicitud al backend de Spring Boot
      const data = await backendFetch(`/family-member-invitations/invitation`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(body)
      });

      return NextResponse.json(data);

   } catch (e) {
      if (e instanceof ErrorCode) {
         return NextResponse.json({ message: e.message }, { status: e.status });
      }

      return NextResponse.json({ message: "Unexpected error" }, { status: 500 });
   }
}
