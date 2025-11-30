// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export function middleware(req: NextRequest) {
    const { userId } = auth(req);

    // Ici, tu peux protéger tes routes API
    if (!userId && req.nextUrl.pathname.startsWith("/api")) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    return NextResponse.next();
}

// Appliquer le middleware uniquement aux routes API
export const config = {
    matcher: ["/api/:path*"],
};
