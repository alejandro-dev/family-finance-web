import { cookies } from "next/headers";
import { ErrorCode } from "./errors/ErrorCode";
import { demoBackendFetch, isDemoMode } from "@/lib/demo";

export async function backendFetch<T>(path: string, options?: RequestInit): Promise<T> {
   if (isDemoMode) {
      return demoBackendFetch<T>(path, options);
   }

   if (!process.env.SPRING_API_URL) {
      throw new ErrorCode("SPRING_API_URL is not configured", 500);
   }

   // `cookies()` can be asynchronous in your environment/types; await it
   const token = (await cookies()).get("token")?.value;

   const res = await fetch(`${process.env.SPRING_API_URL}${path}`, {
      ...options,
      headers: {
         "Content-Type": "application/json",
         ...(options?.headers || {}),
         ...(token && { Authorization: `Bearer ${token}` }),
      },
      cache: options?.cache ?? "no-store", // Si no se especifica, no se usa caché.
   });

   const data = await res.json().catch(() => null);

   if (!res.ok) {
      throw new ErrorCode(
         data?.message || "Unexpected error",
         res.status
      );
   }

   return data;
}
