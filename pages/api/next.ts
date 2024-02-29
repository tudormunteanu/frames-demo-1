import type { NextApiRequest, NextApiResponse } from 'next';
import {getSSLHubRpcClient, Message} from "@farcaster/hub-nodejs";

import { getGame, updateGame, isGameOver } from "@/app/actions";

const HUB_URL = process.env['HUB_URL']
const client = HUB_URL ? getSSLHubRpcClient(HUB_URL) : undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    let validatedMessage : Message | undefined = undefined;
    try {
        const frameMessage = Message.decode(Buffer.from(req.body?.trustedData?.messageBytes || '', 'hex'));
        const result = await client?.validateMessage(frameMessage);
        if (result && result.isOk() && result.value.valid) {
            validatedMessage = result.value.message;
        }
        let urlBuffer = validatedMessage?.data?.frameActionBody?.url || [];
        const urlString = Buffer.from(urlBuffer).toString('utf-8');
        if (validatedMessage && !urlString.startsWith(process.env['HOST'] || '')) {
            return res.status(400).send(`Invalid frame url: ${urlBuffer}`);
        }
    } catch (e) {
        return res.status(400).send(`Failed to validate message: ${e}`);
    }

    let buttonId = 0, fid = 0;
    if (client) {
        buttonId = validatedMessage?.data?.frameActionBody?.buttonIndex || 0;
        fid = validatedMessage?.data?.fid || 0;
    } else {
        buttonId = req.body?.untrustedData?.buttonIndex || 0;
        fid = req.body?.untrustedData?.fid || 0;
    }

    const game = await getGame(fid);
    updateGame(game, buttonId);

    const isGameOver_ = await isGameOver(game);

    let nextUrl;
    if (isGameOver_) {
        console.log("game done", game.correctAnswers);
        nextUrl = `/over?score=${game.correctAnswers}`;
    } else {
        nextUrl = `/next?levelId=${game.currentLevel}`;
    }

    res.status(302).setHeader('Location', nextUrl).end();    
}
