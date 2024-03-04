import {parseFramePayload} from "@/app/frames";
import { getGameByFid, updateGame, isGameOver, resetGame } from "@/app/actions";

export async function POST(req: Request) {
  const { buttonIndex, fid } = await parseFramePayload(await req.json());  
  const game = await getGameByFid(fid);

  if (!game) {
    return new Response("Game not found", {status: 404});        
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

  return new Response(
    "",
    {
      status: 302,
      headers: {"Location": nextUrl}
    }
  );
}
