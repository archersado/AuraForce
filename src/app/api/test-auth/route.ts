import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Auth.js base route is accessible',
    timestamp: new Date().toISOString(),
    path: '/auraforce/api/auth',
  });
}

export async function POST() {
  return NextResponse.json({
    message: 'Auth.js base route POST is accessible',
    timestamp: new Date().toISOString(),
    path: '/auraforce/api/auth',
  });
}
