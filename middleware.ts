// middleware.ts
import { withClerkMiddleware } from "@clerk/nextjs/edge";

export default withClerkMiddleware((req) => {
    return new Response("OK"); // middleware minimal, juste pour build
});

export const config = {
    matcher: ["/api/:path*"], // protège tes routes API
};
