import sharp from 'sharp';
import satori from "satori";
import {join} from 'path';
import * as fs from "fs";

import { APP_URL } from "@/app/constants";
import {getGame} from "@/app/actions";


const fontPath = join(process.cwd(), 'Roboto-Regular.ttf')
let fontData = fs.readFileSync(fontPath)

export async function GET(req: Request) {

    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get('gameId') as string;
    const game = await getGame(gameId);

    try {

        if (game === null) {
            return new Response('Game not found', {status: 404});
        }

        const levels = game.levels;
        const level = levels.find(l => l.id === game.currentLevel);
        const imageUrl = `${APP_URL}/levels/${level?.file}`;

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

        const pngBuffer = await sharp(Buffer.from(svg))
            .toFormat('png')
            .toBuffer();

        return new Response(pngBuffer, {
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'max-age=10',
            },
        });
    } catch (error) {
        console.error('Error generating image', error);
        return new Response('Error generating image', {status: 500});        
    }
}
