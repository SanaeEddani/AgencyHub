import { clerkMiddleware } from "@clerk/nextjs/server";

// Middleware Clerk
export default clerkMiddleware();

// Configuration du matcher pour Next.js
export const config = {
    matcher: ["/api/:path*"], // protège toutes les routes /api/*
};
