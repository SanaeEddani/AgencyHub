"use client";

import { useEffect, useState } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import SignInPage from "../../sign-in/[[...index]]";
import { FiEye } from "react-icons/fi";

import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

type Agency = {
    id: string;
    name: string;
    state?: string | null;
    state_code?: string | null;
    type?: string | null;
    population?: number | null;
    website?: string | null;
};

export default function AgenciesPage() {
    const [items, setItems] = useState<Agency[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);

    const [q, setQ] = useState<string>("");
    const [stateFilter, setStateFilter] = useState<string>("");
    const [stateCodeFilter, setStateCodeFilter] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    async function load(pageToLoad = 1) {
        setLoading(true);
        const params = new URLSearchParams();
        params.set("page", String(pageToLoad));

        if (q) params.set("q", q);
        if (stateFilter) params.set("state", stateFilter);
        if (stateCodeFilter) params.set("state_code", stateCodeFilter);

        const res = await fetch(`/api/agencies/list?${params.toString()}`);
        const data = await res.json();

        setItems(data.items || []);
        setPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);

        setLoading(false);
    }

    useEffect(() => {
        load(1);
    }, []);

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        load(1);
    }

    return (
        <>
            <SignedIn>
                <div style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
                    <Topbar />
                    <div style={{ display: "flex", flex: 1 }}>
                        <Sidebar />
                        <main style={{ flex: 1, padding: 28, marginLeft: 260, background: "#fff" }}>
                            <div style={{ maxWidth: 1200 }}>
                                {/* Header */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                                    <h1 style={{ fontSize: 22, margin: 0, color: "#ea580c" }}>Agencies</h1>
                                    <Link href="/dashboard">
                                        <button style={{
                                            padding: "8px 12px",
                                            borderRadius: 8,
                                            background: "#fff",
                                            border: "1px solid #f97316",
                                            color: "#f97316",
                                            fontWeight: 500,
                                            cursor: "pointer"
                                        }}>
                                            Back
                                        </button>
                                    </Link>
                                </div>

                                {/* Search form */}
                                <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                                    <input
                                        value={q}
                                        onChange={(e) => setQ(e.target.value)}
                                        placeholder="Search by name or state"
                                        style={{
                                            flex: 1,
                                            padding: "10px 12px",
                                            borderRadius: 8,
                                            border: "1px solid #f97316",
                                            outline: "none"
                                        }}
                                    />
                                    <input
                                        value={stateFilter}
                                        onChange={(e) => setStateFilter(e.target.value)}
                                        placeholder="State"
                                        style={{
                                            width: 140,
                                            padding: "10px 12px",
                                            borderRadius: 8,
                                            border: "1px solid #f97316",
                                            outline: "none"
                                        }}
                                    />
                                    <input
                                        value={stateCodeFilter}
                                        onChange={(e) => setStateCodeFilter(e.target.value)}
                                        placeholder="State Code"
                                        style={{
                                            width: 140,
                                            padding: "10px 12px",
                                            borderRadius: 8,
                                            border: "1px solid #f97316",
                                            outline: "none"
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        style={{
                                            padding: "10px 14px",
                                            borderRadius: 8,
                                            background: "#f97316",
                                            color: "#fff",
                                            border: "none",
                                            fontWeight: 500,
                                            cursor: "pointer"
                                        }}
                                    >
                                        Search
                                    </button>
                                </form>

                                {/* Table */}
                                <div style={{
                                    background: "#fff",
                                    borderRadius: 12,
                                    padding: 12,
                                    boxShadow: "0 6px 20px rgba(234,88,12,0.06)"
                                }}>
                                    <div style={{ overflowX: "auto" }}>
                                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                            <thead>
                                                <tr style={{ textAlign: "left", borderBottom: "2px solid #f97316", color: "#000" }}>
                                                    <th style={{ padding: "12px 8px" }}>Name</th>
                                                    <th style={{ padding: "12px 8px" }}>State</th>
                                                    <th style={{ padding: "12px 8px" }}>State Code</th>
                                                    <th style={{ padding: "12px 8px" }}>Type</th>
                                                    <th style={{ padding: "12px 8px" }}>Population</th>
                                                    <th style={{ padding: "12px 8px" }}>Website</th>
                                                    <th style={{ padding: "12px 8px" }}>Contacts</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {loading ? (
                                                    <tr>
                                                        <td colSpan={7} style={{ padding: 24, textAlign: "center", color: "#f97316" }}>
                                                            Loading...
                                                        </td>
                                                    </tr>
                                                ) : items.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={7} style={{ padding: 24, textAlign: "center", color: "#9ca3af" }}>
                                                            No agencies found.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    items.map((a) => (
                                                        <tr key={a.id} style={{ borderBottom: "1px solid #f1f5f9", cursor: "pointer", transition: "background 0.2s" }}
                                                            onMouseEnter={e => (e.currentTarget.style.background = "#fff7ed")}
                                                            onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
                                                        >
                                                            <td style={{ padding: "12px 8px" }}>{a.name}</td>
                                                            <td style={{ padding: "12px 8px" }}>{a.state ?? "-"}</td>
                                                            <td style={{ padding: "12px 8px" }}>{a.state_code ?? "-"}</td>
                                                            <td style={{ padding: "12px 8px" }}>{a.type ?? "-"}</td>
                                                            <td style={{ padding: "12px 8px" }}>{a.population ?? "-"}</td>
                                                            <td style={{ padding: "12px 8px" }}>
                                                                {a.website ? (
                                                                    <a href={a.website} target="_blank" rel="noreferrer" style={{ color: "#FDBA74" }}>
                                                                        Visit
                                                                    </a>
                                                                ) : "-"}
                                                            </td>
                                                            <td style={{ padding: "12px 8px", textAlign: "center" }}>
                                                                <a
                                                                    href={`/dashboard/contacts?agencyName=${encodeURIComponent(a.name)}`}
                                                                    style={{
                                                                        color: "#6C757D",
                                                                        fontSize: 20,
                                                                        textDecoration: "none",
                                                                        display: "inline-flex",
                                                                        alignItems: "center",
                                                                        justifyContent: "center",
                                                                    }}
                                                                    title={`View contacts for ${a.name}`}
                                                                >
                                                                    <FiEye />
                                                                </a>
                                                            </td>

                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                                        <div style={{ color: "#6b7280" }}>
                                            Page {page} / {totalPages} — {total} results
                                        </div>

                                        <div style={{ display: "flex", gap: 8 }}>
                                            <button
                                                onClick={() => page > 1 && load(page - 1)}
                                                disabled={page <= 1 || loading}
                                                style={{
                                                    padding: "8px 12px",
                                                    borderRadius: 8,
                                                    border: "1px solid #f97316",
                                                    background: "#fff",
                                                    color: "#f97316",
                                                    cursor: page <= 1 || loading ? "not-allowed" : "pointer"
                                                }}
                                            >
                                                Previous
                                            </button>
                                            <button
                                                onClick={() => page < totalPages && load(page + 1)}
                                                disabled={page >= totalPages || loading}
                                                style={{
                                                    padding: "8px 12px",
                                                    borderRadius: 8,
                                                    border: "1px solid #f97316",
                                                    background: "#fff",
                                                    color: "#f97316",
                                                    cursor: page >= totalPages || loading ? "not-allowed" : "pointer"
                                                }}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </SignedIn>

            <SignedOut>
                <SignInPage />
            </SignedOut>
        </>
    );
}
