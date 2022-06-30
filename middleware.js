import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req) {
  const session = await getToken({req, secret: process.env.NEXTAUTH_SECRET})
  
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if(!session) {
      return NextResponse.redirect(new URL('/', req.url))
    }else{
      if(session.role !== 'admin') return NextResponse.redirect(new URL('/', req.url))
    }
  }

  if (req.nextUrl.pathname.startsWith('/customer')) {
    if(!session) {
      return NextResponse.redirect(new URL('/', req.url))
    }else{
      if(session.role !== 'customer') return NextResponse.redirect(new URL('/', req.url))
    }
  }
}