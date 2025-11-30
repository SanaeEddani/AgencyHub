import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import SignInPage from "../sign-in/[[...index]]";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

// Définir le type des props
type DashboardProps = {
    agencies: number;
    contacts: number;
};

export async function getServerSideProps() {
    const agencies = await prisma.agency.count();
    const contacts = await prisma.contact.count();

    return {
        props: {
            agencies,
            contacts,
        },
    };
}

// 🔹 Typage ajouté ici
export default function Dashboard({ agencies, contacts }: DashboardProps) {
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
        <>
            <SignedIn>
                <div style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
                    <Topbar />
                    <div style={{ display: "flex", flex: 1 }}>
                        <Sidebar />
                        <main style={{ flex: 1, padding: 28, background: "#FFFFFF", marginLeft: 260 }}>
                            <div style={{ maxWidth: 900, width: "100%", margin: "0 auto" }}>

                                {/* IMAGE CENTERED */}
                                <div style={{
                                    marginBottom: 24,
                                    borderRadius: 20,
                                    display: "flex",
                                    justifyContent: "center"
                                }}>
                                    <Image
                                        src="/images/agencyHub.jpeg"
                                        alt="agencyHub Banner"
                                        width={700}
                                        height={100}
                                        style={{ width: "90%", height: "auto", objectFit: "cover", borderRadius: 16 }}
                                    />
                                </div>

                                {/* STAT CARDS CENTERED */}
                                <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap", justifyContent: "center" }}>
                                    <div style={{ flex: "1 1 220px", padding: 16, background: "#fff", borderRadius: 16, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}>
                                        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Total Agencies</div>
                                        <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>{agencies}</div>
                                    </div>

                                    <div style={{ flex: "1 1 220px", padding: 16, background: "#fff", borderRadius: 16, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}>
                                        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Total Contacts</div>
                                        <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>{contacts}</div>
                                    </div>

                                    <div style={{ flex: "1 1 220px", padding: 16, background: "#fff", borderRadius: 16, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}>
                                        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Remaining Today</div>
                                        <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>{remaining}</div>
                                    </div>
                                </div>

                                {/* CARDS WITH BUTTONS */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 25 }}>

                                    {/* Card 1: Find Agencies */}
                                    <div style={{ width: "92%", padding: 24, background: "#f5f5f5", borderRadius: 5, color: "#111827", boxShadow: "0 6px 20px rgba(0,0,0,0.04)" }}>
                                        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, textAlign: "left" }}>Find Agencies</div>
                                        <div style={{ fontSize: 14, marginBottom: 16, textAlign: "left" }}>Search and explore agencies in your area efficiently, gaining quick access to their profiles, services, and key information to make informed decisions.</div>
                                        <div style={{ textAlign: "left" }}>
                                            <Link href="/dashboard/agencies">
                                                <button style={{ padding: "10px 15px", borderRadius: 5, background: "#f97316", color: "#fff", border: "none", fontWeight: 400, fontSize: 12, cursor: "pointer" }}>
                                                    Go to Agencies
                                                </button>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Card 2: Find Contacts */}
                                    <div style={{ width: "92%", padding: 24, background: "#f5f5f5", borderRadius: 5, color: "#111827", boxShadow: "0 6px 20px rgba(0,0,0,0.04)" }}>
                                        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, textAlign: "left" }}>Find Contacts</div>
                                        <div style={{ fontSize: 14, marginBottom: 16, textAlign: "left" }}>Discover and connect with contacts across multiple agencies seamlessly, allowing you to manage your network effectively and stay up-to-date with important connections.</div>
                                        <div style={{ textAlign: "left" }}>
                                            <Link href="/dashboard/contacts">
                                                <button style={{ padding: "10px 15px", borderRadius: 5, background: "#f97316", color: "#fff", border: "none", fontWeight: 400, fontSize: 12, cursor: "pointer" }}>
                                                    Go to Contacts
                                                </button>
                                            </Link>
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
