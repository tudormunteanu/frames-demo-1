import sharp from "sharp";
import satori from "satori";
import {join} from "path";
import * as fs from "fs";

const fontPath = join(process.cwd(), "Roboto-Regular.ttf");
let fontData = fs.readFileSync(fontPath);

export async function GET(req: Request) {    
  try {
    const {searchParams} = new URL(req.url);
    const score = searchParams.get("score");

    const svg = await satori(
      <div style={{
        justifyContent: "flex-start",
        alignItems: "center",
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: "f4f4f4",
        padding: 50,
        lineHeight: 1.2,
        fontSize: 24,
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          padding: 20,
          textAlign: "left",
          color: "lightgray"
        }}>
          <h2>Done!</h2>
          <h2>Correct answers: {score}</h2>
          <p>
            This game is a basic demo for a tutorial for 
            Farcaster Frames.
          </p>
        </div>
      </div>
      ,
      {
        width: 600, height: 400, fonts: [{
          data: fontData,
          name: "Roboto",
          style: "normal",
          weight: 400
        }]
      });

    const pngBuffer = await sharp(Buffer.from(svg))
      .toFormat("png")
      .toBuffer();

    return new Response(pngBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "max-age=10",
      },
    });
  } catch (error) {
    console.error("Error generating image", error);
    return new Response("Error generating image", {status: 500});
  }
}
