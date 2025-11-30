import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

const DAILY_LIMIT = 50;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        console.log("=== /api/contacts/list called ===");

        // Authentification
        const { userId } = getAuth(req);
        console.log("userId from Clerk:", userId);
        if (!userId) {
            console.log("Unauthorized request: no userId");
            return res.status(401).json({ error: "Unauthorized" });
        }

        // 2️⃣ Vérifier le paramètre agencyName
        const agencyName = typeof req.query.agencyName === "string" ? req.query.agencyName.trim() : "";
        console.log("Received agencyName:", agencyName);
        if (!agencyName) {
            console.log("Error: agencyName is required");
            return res.status(400).json({ error: "agencyName is required" });
        }

        //  Définir la journée
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        console.log("StartOfDay:", startOfDay, "EndOfDay:", endOfDay);

        // Récupérer ou créer le compteur utilisateur
        let userCount = await prisma.userDailyCount.findFirst({
            where: {
                userId,
                date: { gte: startOfDay, lt: endOfDay },
            },
        });
        console.log("userCount before create:", userCount);

        if (!userCount) {
            userCount = await prisma.userDailyCount.create({
                data: { userId, date: new Date(), count: 0 },
            });
            console.log("Created new userCount:", userCount);
        }

        if (userCount.count >= DAILY_LIMIT) {
            console.log("Daily limit reached:", userCount.count);
            return res.status(200).json({ contacts: [], count: userCount.count, error: "Daily limit reached" });
        }

        // Rechercher l'agence
        const agency = await prisma.agency.findFirst({
            where: { name: { contains: agencyName, mode: "insensitive" } },
            include: {
                Contact: {
                    orderBy: { first_name: "asc" },
                    take: DAILY_LIMIT - userCount.count,
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        email: true,
                        phone: true,
                        title: true,
                        department: true,
                    },
                },
            },
        });

        console.log("Agency found:", agency?.id, "with contacts:", agency?.Contact.length || 0);

        const contacts = agency?.Contact || [];

        //  Mise à jour du compteur
        const newCount = userCount.count + contacts.length;
        await prisma.userDailyCount.update({
            where: { id: userCount.id },
            data: { count: newCount },
        });
        console.log("Updated userCount:", newCount);

        // Réponse
        return res.status(200).json({ contacts, count: newCount });

    } catch (error) {
        console.error("API /contacts/list error:", error);
        return res.status(500).json({ contacts: [], count: 0, error: "Server error" });
    }
}
