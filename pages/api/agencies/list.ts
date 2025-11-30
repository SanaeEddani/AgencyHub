import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const page = Math.max(1, Number(req.query.page ?? 1));
        const take = 10;
        const skip = (page - 1) * take;

        const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
        const state = typeof req.query.state === "string" ? req.query.state.trim() : "";
        const state_code = typeof req.query.state_code === "string" ? req.query.state_code.trim() : "";

        // Build filters
        const where: any = {};

        // Search bar 
        if (q) {
            where.OR = [
                { name: { contains: q, mode: "insensitive" } },
                { state: { contains: q, mode: "insensitive" } }
            ];
        }

        if (state) where.state = { equals: state, mode: "insensitive" };
        if (state_code) where.state_code = { equals: state_code, mode: "insensitive" };

        const [total, items] = await Promise.all([
            prisma.agency.count({ where }),
            prisma.agency.findMany({
                where,
                orderBy: { name: "asc" },
                skip,
                take,
                select: {
                    id: true,
                    name: true,
                    state: true,
                    state_code: true,
                    type: true,
                    population: true,
                    website: true,
                },
            }),
        ]);

        return res.status(200).json({
            page,
            perPage: take,
            total,
            totalPages: Math.ceil(total / take),
            items,
        });
    } catch (error) {
        console.error("API /api/agencies/list error:", error);
        return res.status(500).json({ error: "Server error" });
    }
}
