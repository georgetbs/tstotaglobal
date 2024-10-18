// app/api/getCurrentTime/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const currentTime = new Date().toISOString();
    console.log('getCurrentTime API called:', currentTime);
    return NextResponse.json({ currentTime }, { status: 200 });
  } catch (error) {
    console.error('Error in getCurrentTime API:', error);
    return NextResponse.json({ currentTime: '' }, { status: 500 });
  }
}
