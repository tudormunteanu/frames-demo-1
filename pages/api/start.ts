import type { NextApiRequest, NextApiResponse } from 'next';
import {parseFramePayload} from "@/app/frames"
import {getOrCreateGame} from "@/app/actions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // TODO: this is ugly
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { fid } = await parseFramePayload(req.body);
        const game = await getOrCreateGame(fid);
        const startUrl = `/start?gameId=${game.id}`;
        res.status(302).setHeader('Location', startUrl).end();
    } catch (e) {
        res.status(400).send(`Failed validate action: ${e}`);
    }
}