"use server"

import { User } from '@/types/User'
import { cookies } from 'next/headers'
import { cache } from 'react'
import { demoUser, isDemoMode } from "@/lib/demo";

export const getCurrentUser = cache(async (): Promise<User | null> => {
   if (isDemoMode) return demoUser;

   const token = (await cookies()).get('token')?.value
   if (!token) return null

   const res = await fetch(`${process.env.SPRING_API_URL}/auth/me`, {
      headers: {
         Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
   })

   if (!res.ok) return null

   return res.json()
})
