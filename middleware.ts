import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
    matcher: ["/api/:path*"],
});
