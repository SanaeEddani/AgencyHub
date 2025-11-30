"use client";

import React from "react";
import Link from "next/link";
import { useUser, SignOutButton, UserButton } from "@clerk/nextjs";

export default function Topbar() {
    const { isLoaded, user } = useUser();

    return (
        <header
            style={{
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 20px",
                background: "#ffffff",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
                position: "sticky",
                top: 0,
                zIndex: 40,
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <Link href="/dashboard" style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 8,
                                background: "linear-gradient(135deg,#f97316,#fb923c)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontWeight: 700,
                            }}
                        >
                            A
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 16, color: "#f97316" }}>AgencyHub</div>
                    </div>
                </Link>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* show user name (if loaded) */}
                {isLoaded && user && (
                    <div style={{ marginRight: 8, fontSize: 14, color: "#333" }}>
                        {user.firstName ? `${user.firstName} ${user.lastName ?? ""}` : user.primaryEmailAddress?.emailAddress}
                    </div>
                )}

                {/* Clerk user menu (avatar) */}
                <UserButton afterSignOutUrl="/sign-in" />

                {/* Sign out button (clean) */}
                <SignOutButton>
                    <button
                        style={{
                            marginLeft: 8,
                            padding: "8px 12px",
                            borderRadius: 8,
                            border: "1px solid rgba(0,0,0,0.08)",
                            background: "#fff",
                            cursor: "pointer",
                            color: "#f97316",
                            fontWeight: 600,
                        }}
                        aria-label="Sign out"
                    >
                        Logout
                    </button>
                </SignOutButton>
            </div>
        </header>
    );
}
