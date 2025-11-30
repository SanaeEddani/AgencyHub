"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";

type Item = { href: string; label: string; icon?: React.ReactNode };

const items: Item[] = [
    { href: "/dashboard", label: "Dashboard", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 13h8V3H3v10zM3 21h8v-6H3v6zM13 21h8V11h-8v10zM13 3v6h8V3h-8z" fill="currentColor" /></svg> },
    { href: "/dashboard/agencies", label: "Agencies", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zM7 9h2V7H7v2zm4 4h2v-2h-2v2zM7 17h2v-2H7v2zm8-8h2V7h-2v2zM15 21h2v-2h-2v2z" fill="currentColor" /></svg> },
    { href: "/dashboard/contacts", label: "Contacts", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" fill="currentColor" /></svg> },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user } = useUser();
    const [remaining, setRemaining] = useState(50);

    useEffect(() => {
        if (!user) return;

        async function fetchRemaining() {
            try {
                const res = await fetch(`/api/contacts/list?agencyName=__dummy__`);
                const data = await res.json();
                if (res.ok) {
                    setRemaining(Math.max(0, 50 - data.count));
                }
            } catch (err) {
                console.error(err);
            }
        }

        fetchRemaining();
    }, [user]);

    return (
        <aside
            style={{
                position: "fixed",
                top: 64,
                left: 0,
                bottom: 0,
                width: 260,
                minWidth: 220,
                background: "#fff",
                borderRight: "1px solid rgba(0,0,0,0.06)",
                paddingTop: 20,
                paddingBottom: 20,
                zIndex: 50,
            }}
        >


            <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {items.map((it) => {
                    const active = pathname?.startsWith(it.href) ?? false;
                    return (
                        <Link
                            key={it.href}
                            href={it.href}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                padding: "10px 18px",
                                color: active ? "#0f172a" : "#475569",
                                textDecoration: "none",
                                background: active ? "rgba(251,146,60,0.06)" : "transparent",
                                borderLeft: active ? "4px solid #f97316" : "4px solid transparent",
                            }}
                        >
                            <div style={{ width: 20, display: "flex", justifyContent: "center", color: active ? "#f97316" : "#94a3b8" }}>
                                {it.icon}
                            </div>
                            <div style={{ fontSize: 15, fontWeight: 600 }}>{it.label}</div>
                        </Link>
                    );
                })}

                {/* Credits Remaining */}
                <div style={{ marginTop: 20, padding: "0 18px" }}>
                    <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Credits Remaining</div>
                    <div style={{ height: 12, width: "100%", background: "#e5e7eb", borderRadius: 6, overflow: "hidden" }}>
                        <div
                            style={{
                                width: `${(remaining / 50) * 100}%`,
                                background: "#f97316",
                                height: "100%",
                                borderRadius: 6,
                                transition: "width 0.3s ease",
                            }}
                        ></div>
                    </div>
                    <div style={{ fontSize: 12, color: "#374151", marginTop: 4, textAlign: "right" }}>
                        {remaining}/50
                    </div>
                </div>
            </nav>
        </aside>
    );
}
