import type { NextApiRequest, NextApiResponse } from 'next';
import {getSSLHubRpcClient, Message} from "@farcaster/hub-nodejs";

import { getGame, updateGame, isGameOver, getFrameVersion } from "@/app/actions";

const HUB_URL = process.env['HUB_URL']
const client = HUB_URL ? getSSLHubRpcClient(HUB_URL) : undefined;
const APP_URL = process.env['HOST'] || "https://replaceme.com";
const API_BASE_URL = `${APP_URL}/api`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        // Handle any non-POST requests
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
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

        const game = getGame(fid);
        updateGame(game, buttonId);

        const version = getFrameVersion();

        let imageUrl
        let isGameOver_ = isGameOver(game);
        if (isGameOver_) {
            imageUrl = `${API_BASE_URL}/images/over?version=${version}&correct=${game.correctAnswers}`;
        } else {
            imageUrl = `${API_BASE_URL}/images/level?id=${game.currentLevel}&version=${version}`;
        }
        const postUrl = `${API_BASE_URL}/next?version=${version}`;

        const sharingText = encodeURIComponent(`Can you guess more than ${game.correctAnswers} MVPs?`);
        const sharingUrl = `https://warpcast.com/~/compose?text=${sharingText}&embeds[]=${encodeURIComponent(APP_URL)}`

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(`
<!DOCTYPE html>
<html>
<head>
  <title>MVP or not MVP</title>
  <meta property="og:title" content="MVP or not MVP">
  <meta property="og:image" content="${imageUrl}">
  <meta name="fc:frame" content="vNext">
  <meta name="fc:frame:image" content="${imageUrl}">
  <meta name="fc:frame:post_url" content="${postUrl}">

  `+(
    isGameOver_ ? 
        `
        <meta name="fc:frame:button:1" content="Share">
        <meta name="fc:frame:button:1:action" content="link">
        <meta name="fc:frame:button:1:target" content="${sharingUrl}">
        `
    :
        `
        <meta name="fc:frame:button:1" content="MVP">
        <meta name="fc:frame:button:2" content="Not MVP">
        `
  )+`

</head>
<body></body>
</html>
        `);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating image');
    }
}
