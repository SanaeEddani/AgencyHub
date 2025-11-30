export default function handler(req, res) {
    res.status(200).json({ dbUrl: process.env.DATABASE_URL });
}
