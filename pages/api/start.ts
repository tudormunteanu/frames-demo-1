import type { NextApiRequest, NextApiResponse } from 'next';
import {parseFramePayload} from "@/app/frames"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // TODO: this is ugly
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { fid } = await parseFramePayload(req.body);
        res.status(302).setHeader('Location', '/start').end();
    } catch (e) {
        res.status(400).send(`Failed validate action: ${e}`);
    }
}