import type { NextApiRequest, NextApiResponse } from 'next';
import {parseFramePayload} from "@/app/frames"

import { getGame, updateGame, isGameOver } from "@/app/actions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { buttonIndex, fid } = await parseFramePayload(req.body);

    const game = await getGame(fid);
    updateGame(game, buttonIndex);

    const isGameOver_ = await isGameOver(game);

    let nextUrl;
    if (isGameOver_) {
        nextUrl = `/over?score=${game.correctAnswers}`;
    } else {
        nextUrl = `/next?levelId=${game.currentLevel}`;
    }

    res.status(302).setHeader('Location', nextUrl).end();    
}
