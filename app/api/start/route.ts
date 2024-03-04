import {parseFramePayload} from "@/app/frames";
import {getOrCreateGame} from "@/app/actions";

export async function POST(req: Request) {    
  try {
    const { fid } = await parseFramePayload(await req.json());
    const game = await getOrCreateGame(fid);
    const startUrl = `/start?gameId=${game.id}`;

    return new Response(
      "",
      {
        status: 302,
        headers: {"Location": startUrl}
      }
    );        
  } catch (e) {

    return new Response(
      `Failed validate action: ${e}`,
      {status: 400}
    );     
  }
}