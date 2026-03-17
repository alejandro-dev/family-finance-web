import { NextResponse } from 'next/server'

export async function POST() {
   // Obtener el token de la cookie
   const res = NextResponse.json({ ok: true })

   // Borrar el token de la cookie
   res.cookies.set('token', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
   })

   // Borrar también el rol persistido para evitar redirecciones inconsistentes.
   res.cookies.set('role', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
   })

   return res;
}
