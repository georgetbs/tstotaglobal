// middleware.ts

import { i18nRouter } from "next-i18n-router";
import type { NextRequest } from "next/server";
import i18NextConfig from "@/i18next.config";
import { NextResponse } from "next/server";

// Define the CORS headers you want to set
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
  "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
};

/**
 * Middleware function to handle i18n routing and set CORS headers.
 * 
 * @param {NextRequest} request - The incoming request object.
 * @returns {NextResponse} - The response object with necessary headers.
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    // Create a new response for OPTIONS requests
    const response = new NextResponse(null, { status: 204 });
    // Set CORS headers
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  // Process i18n routing
  const response = await i18nRouter(request, {
    locales: i18NextConfig.i18n.locales,
    defaultLocale: i18NextConfig.i18n.defaultLocale,
  });

  // Set CORS headers on all other responses
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

// Apply this middleware only to files in the app directory, excluding specific paths
export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
