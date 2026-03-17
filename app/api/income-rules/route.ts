import { backendFetch } from "@/services/backend";
import { ErrorCode } from "@/services/errors/ErrorCode";
import { buildIncomeRulesSearchPath } from "@/services/incomeRulesService";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
   try {
      const { searchParams } = new URL(req.url);
      const page = Number(searchParams.get("page") ?? "0");
      const size = Number(searchParams.get("size") ?? "10");

      const path = buildIncomeRulesSearchPath({
         familyId: searchParams.get("familyId") ?? "",
         familyMemberId: searchParams.get("familyMemberId") ?? "",
         page: Number.isFinite(page) && page >= 0 ? Math.floor(page) : 0,
         size: Number.isFinite(size) && size > 0 ? Math.floor(size) : 10,
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

export async function POST(req: Request) {
   try {
      const body = await req.json();
      const data = await backendFetch("/income-rules", {
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
