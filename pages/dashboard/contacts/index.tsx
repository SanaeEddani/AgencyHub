"use client";

import { useState, useEffect } from "react";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import SignInPage from "../../sign-in/[[...index]]";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";
import { useSearchParams } from "next/navigation";

type Contact = {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
    title: string | null;
    department: string | null;
};

export default function ContactsPage() {
    const { user } = useUser();
    const searchParams = useSearchParams();
    const initialAgencyName = searchParams.get("agencyName") || "";

    const [agencyName, setAgencyName] = useState(initialAgencyName);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [contactsViewed, setContactsViewed] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [limitReached, setLimitReached] = useState(false);

    const DAILY_LIMIT = 50;

    useEffect(() => {
        if (initialAgencyName) {
            handleSearchAuto(initialAgencyName);
        }
    }, [initialAgencyName]);

    const handleSearchAuto = async (name: string) => {
        setLoading(true);
        setError("");
        setLimitReached(false);
        try {
            const params = new URLSearchParams({ agencyName: name });
            const res = await fetch(`/api/contacts/list?${params.toString()}`);
            const data = await res.json();

            if (res.status === 403 || data.error === "Daily limit reached") {
                setLimitReached(true);
                setContacts([]);
                setContactsViewed(data.count || DAILY_LIMIT);
            } else if (res.status === 200) {
                setContacts(data.contacts || []);
                setContactsViewed(data.count || 0);
                setLimitReached(data.count >= DAILY_LIMIT);
            } else {
                setError(data.error || "Server error");
                setContacts([]);
            }
        } catch (err) {
            console.error(err);
            setError("Server error");
            setContacts([]);
        }
        setLoading(false);
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agencyName.trim()) return;
        await handleSearchAuto(agencyName);
    };

    const exportContacts = (contactsToExport: Contact[]) => {
        const csv = [
            ["First Name", "Last Name", "Email", "Phone", "Title", "Department"],
            ...contactsToExport.map((c) => [
                c.first_name ?? "",
                c.last_name ?? "",
                c.email ?? "",
                c.phone ?? "",
                c.title ?? "",
                c.department ?? "",
            ]),
        ]
            .map((e) => e.join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "contacts.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <SignedIn>
                {/* Layout complet */}
                <div style={{ display: "flex", minHeight: "100vh", background: "#fff" }}>
                    <Sidebar />

                    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                        <Topbar />

                        <main
                            style={{
                                flex: 1,
                                padding: 28,
                                overflowY: "auto",
                                marginTop: 10,
                                marginLeft: 260,
                            }}
                        >
                            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                                <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 20, color: "#ea580c" }}>
                                    Contacts
                                </h1>

                                {/* Counter */}
                                <div style={{ marginBottom: 16, fontWeight: 600, color: "#1f2937" }}>
                                    Contacts viewed today: {contactsViewed} / {DAILY_LIMIT}
                                </div>

                                {/* Daily limit message */}
                                {limitReached && (
                                    <div
                                        style={{
                                            padding: 14,
                                            marginBottom: 16,
                                            background: "#fff7ed",
                                            color: "#9a3412",
                                            border: "1px solid #fdba74",
                                            borderRadius: 10,
                                            fontWeight: 500,
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        You reached your daily limit.
                                        <button
                                            style={{
                                                padding: "6px 12px",
                                                borderRadius: 8,
                                                background: "#ea580c",
                                                color: "#fff",
                                                fontWeight: 600,
                                                border: "none",
                                                cursor: "pointer",
                                                marginLeft: 16,
                                            }}
                                        >
                                            Upgrade
                                        </button>
                                    </div>
                                )}

                                {/* Search Form */}
                                <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                                    <input
                                        value={agencyName}
                                        onChange={(e) => setAgencyName(e.target.value)}
                                        placeholder="Search by Agency Name"
                                        style={{
                                            flex: 1,
                                            padding: "12px 16px",
                                            borderRadius: 10,
                                            border: "1px solid #d1d5db",
                                            fontSize: 16,
                                            outline: "none",
                                        }}
                                        disabled={limitReached}
                                    />
                                    <button
                                        type="submit"
                                        style={{
                                            padding: "12px 18px",
                                            borderRadius: 10,
                                            background: "#ea580c",
                                            color: "#fff",
                                            fontWeight: 600,
                                            border: "none",
                                            cursor: "pointer",
                                        }}
                                        disabled={loading || limitReached}
                                    >
                                        {loading ? "Searching..." : "Search"}
                                    </button>
                                </form>

                                {/* Error */}
                                {error && (
                                    <div
                                        style={{
                                            padding: 14,
                                            marginBottom: 16,
                                            background: "#fee2e2",
                                            color: "#b91c1c",
                                            borderRadius: 10,
                                            fontWeight: 500,
                                        }}
                                    >
                                        {error}
                                    </div>
                                )}

                                {/* Table */}
                                {contacts.length > 0 ? (
                                    <div
                                        style={{
                                            overflowX: "auto",
                                            background: "#fff",
                                            padding: 20,
                                            borderRadius: 12,
                                            border: "1px solid #e5e7eb",
                                            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                                        }}
                                    >
                                        <div style={{
                                            background: "#fff",
                                            borderRadius: 12,
                                            padding: 12,
                                            boxShadow: "0 6px 20px rgba(234,88,12,0.06)",
                                            overflowX: "auto"
                                        }}>
                                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
                                                <thead>
                                                    <tr style={{ textAlign: "left", borderBottom: "2px solid #f97316", color: "#000" }}>
                                                        {["First Name", "Last Name", "Email", "Phone", "Title", "Department"].map((th) => (
                                                            <th
                                                                key={th}
                                                                style={{
                                                                    padding: "12px 8px",
                                                                    fontWeight: 700,
                                                                    fontSize: 14,
                                                                }}
                                                            >
                                                                {th}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {contacts.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={6} style={{ padding: 24, textAlign: "center", color: "#9ca3af" }}>
                                                                No contacts found.
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        contacts.map((c, idx) => (
                                                            <tr
                                                                key={c.id}
                                                                style={{
                                                                    background: idx % 2 === 0 ? "#ffffff" : "#fffaf5",
                                                                    borderBottom: "1px solid #f1f5f9",
                                                                    cursor: "pointer",
                                                                    transition: "background 0.2s",
                                                                }}
                                                                onMouseEnter={(e) => (e.currentTarget.style.background = "#fff7ed")}
                                                                onMouseLeave={(e) =>
                                                                    (e.currentTarget.style.background = idx % 2 === 0 ? "#ffffff" : "#fffaf5")
                                                                }
                                                            >
                                                                <td style={{ padding: "12px 8px" }}>{c.first_name ?? "-"}</td>
                                                                <td style={{ padding: "12px 8px" }}>{c.last_name ?? "-"}</td>
                                                                <td style={{ padding: "12px 8px" }}>{c.email ?? "-"}</td>
                                                                <td style={{ padding: "12px 8px" }}>{c.phone ?? "-"}</td>
                                                                <td style={{ padding: "12px 8px" }}>{c.title ?? "-"}</td>
                                                                <td style={{ padding: "12px 8px" }}>{c.department ?? "-"}</td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>


                                        {/* Export button */}
                                        <div style={{ marginTop: 16, textAlign: "right" }}>
                                            <button
                                                onClick={() => exportContacts(contacts)}
                                                style={{
                                                    padding: "10px 18px",
                                                    borderRadius: 10,
                                                    background: "#ea580c",
                                                    color: "#fff",
                                                    fontWeight: 600,
                                                    border: "none",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Export CSV
                                            </button>
                                        </div>
                                    </div>
                                ) : !loading && !error ? (
                                    <div style={{ padding: 28, textAlign: "center", color: "#6b7280" }}>
                                        No contacts found.
                                    </div>
                                ) : null}
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
