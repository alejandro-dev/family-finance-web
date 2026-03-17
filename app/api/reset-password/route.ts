import { backendFetch } from "@/services/backend";
import { ErrorCode } from "@/services/errors/ErrorCode";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
   try {
      const body = await req.json();
      const data = await backendFetch("/reset-password", {
         method: "POST",
         body: JSON.stringify(body),
      });

      return NextResponse.json(data);
   
   } catch (error) {
      if (error instanceof ErrorCode) {
         return NextResponse.json(
            { message: error.message },
            { status: error.status }
         );
      }

      // Errores inesperados
      return NextResponse.json(
         { message: "Service unavailable"  },
         { status: 503 }
      );
   }
}

export async function PUT(req: Request) {
   try {
      const { searchParams } = new URL(req.url);
      const token = searchParams.get("token");

      const body = await req.json();
      const data = await backendFetch(`/reset-password?token=${token}`, {
         method: "PUT",
         body: JSON.stringify(body),
      });

      return NextResponse.json(data);

   } catch (error) {
      if (error instanceof ErrorCode) {
         return NextResponse.json(
            { message: error.message },
            { status: error.status }
         );
      }

      // Errores inesperados
      return NextResponse.json(
         { message: "Service unavailable"  },
         { status: 503 }
      );
   }
   
}