import type { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';
import satori from "satori";
import {join} from 'path';
import * as fs from "fs";

import { levels, APP_URL } from "@/app/constants";

const fontPath = join(process.cwd(), 'Roboto-Regular.ttf')
let fontData = fs.readFileSync(fontPath)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const stepId: number = parseInt((req.query['id'] || "0") as string);

        const level = levels.find(l => l.id === stepId);
        const imageUrl = `${APP_URL}/levels/pfp.png`;

        const svg = await satori(
            <div style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                display: 'flex',
                width: '100%',
                height: '100%',
                backgroundColor: 'f4f4f4',
                padding: 50,
                lineHeight: 1.2,
                fontSize: 22,
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 20,
                }}>
                    <span style={{color: 'lightgray'}}>
                        {(level?.id || 0) + 1}/{levels.length}
                    </span>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        paddingTop: 10,
                    }}>
                        <div
                            style={{
                                display: 'flex',
                                width: '30%',
                            }}
                        >
                            <img 
                                src={imageUrl}
                                alt={level?.name} 
                            />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                width: '70%',
                            }}
                        >
                            <h2 style={{
                                textAlign: 'left',
                                color: 'lightgray',
                                margin: 0,
                                marginLeft: 20,
                            }}>
                                {level?.name || "No such level"}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
            ,
            {
                width: 600, height: 400, fonts: [{
                    data: fontData,
                    name: 'Roboto',
                    style: 'normal',
                    weight: 400
                }]
            })

        // Convert SVG to PNG using Sharp
        const pngBuffer = await sharp(Buffer.from(svg))
            .toFormat('png')
            .toBuffer();

        // Set the content type to PNG and send the response
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'max-age=10');
        res.send(pngBuffer);
    } catch (error) {
        res.status(500).send('Error generating image');
    }
}
