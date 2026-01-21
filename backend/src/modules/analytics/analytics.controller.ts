import { Request, Response } from 'express';
import Analytics from './analytics.model';

export const logEvent = async (req: Request, res: Response) => {
    try {
        const { eventType, metadata } = req.body;
        await Analytics.create({ eventType, metadata });
        res.status(201).json({ success: true });
    } catch (error) {
        // Analytics failure shouldn't block client, just log error
        res.status(500).json({ success: false });
    }
};

export const getStats = async (req: Request, res: Response) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const dailyStats = await Analytics.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        event: "$eventType"
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.date": 1 } }
        ]);

        // Transform into Recharts friendly format
        // [{ date: '2023-10-01', visit: 10, project_view: 5 }]
        const formattedStats = dailyStats.reduce((acc: any[], curr) => {
            const date = curr._id.date;
            const event = curr._id.event;
            const count = curr.count;

            let dayEntry = acc.find(e => e.date === date);
            if (!dayEntry) {
                dayEntry = { date };
                acc.push(dayEntry);
            }
            dayEntry[event] = count;
            return acc;
        }, []);

        res.json(formattedStats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
};
