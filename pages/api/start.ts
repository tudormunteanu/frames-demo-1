import type { NextApiRequest, NextApiResponse } from 'next';
import {getSSLHubRpcClient, Message} from "@farcaster/hub-nodejs";

const HUB_URL = process.env['HUB_URL']
const client = HUB_URL ? getSSLHubRpcClient(HUB_URL) : undefined;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // TODO: this is ugly
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
        // Also validate the frame url matches the expected url
        let urlBuffer = validatedMessage?.data?.frameActionBody?.url || [];
        const urlString = Buffer.from(urlBuffer).toString('utf-8');
        if (validatedMessage && !urlString.startsWith(process.env['HOST'] || '')) {
            return res.status(400).send(`Invalid frame url: ${urlBuffer}`);
        }
    } catch (e) {
        return res.status(400).send(`Failed to validate message: ${e}`);
    }

    let fid = 0;
    if (client) {
        fid = validatedMessage?.data?.fid || 0;
    } else {
        fid = req.body?.untrustedData?.fid || 0;
    }

    res.status(302).setHeader('Location', '/start').end();
}