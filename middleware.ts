// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs";

export default clerkMiddleware();

export const config = {
    matcher: ["/api/:path*"], // Définir les routes ici
};
