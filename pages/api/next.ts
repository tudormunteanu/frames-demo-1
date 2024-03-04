import type { NextApiRequest, NextApiResponse } from 'next';
import {parseFramePayload} from "@/app/frames"

import { getGameByFid, updateGame, isGameOver, resetGame } from "@/app/actions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { buttonIndex, fid } = await parseFramePayload(req.body);
    const game = await getGameByFid(fid);

    if (!game) {
        res.status(404).send(`Game not found for fid: ${fid}`);
        return;
    }

    updateGame(game, buttonIndex);
    const isGameOver_ = await isGameOver(game);

    let nextUrl;
    if (isGameOver_) {
        await resetGame(fid);
        nextUrl = `/over?score=${game.correctAnswers}`;
    } else {
        nextUrl = `/next?gameId=${game.id}`;
    }

    res.status(302).setHeader('Location', nextUrl).end();    
}
