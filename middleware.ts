// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export function middleware(req: NextRequest) {
    const { userId } = getAuth(req);

    // Bloquer les utilisateurs non connectés sur les routes /api/*
    if (!userId && req.nextUrl.pathname.startsWith("/api")) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    return NextResponse.next();
}

// Appliquer seulement aux routes API
export const config = {
    matcher: ["/api/:path*"],
};
