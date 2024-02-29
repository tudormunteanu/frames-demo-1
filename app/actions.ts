"use server";

import { kv } from '@vercel/kv';
import { Game } from "@/app/types";
import { levels } from "@/app/constants";

function getGameId(fid: number): string {
  return `fid:${fid.toString()}`;
}

export async function getGame(fid: number): Promise<Game> {
  const gameId = getGameId(fid);

  let runningGame = await kv.get(gameId);
  if(runningGame !== null) {
    return runningGame as Game;
  }

  const newGame = {
    id: gameId,
    player: fid,
    correctAnswers: 0,
    currentLevel: 0
  }
  await kv.set(gameId, newGame);
  return newGame as Game;
}

export async function updateGame(game: Game, buttonId: number) {

  const levelId = game.currentLevel;
  console.log("currentLevel", levelId);

  if(levelId >= levels.length)
    return;

  const buttonValues: {[key: number]: boolean} = {
      1: true,
      2: false
  };

  game.correctAnswers += levels[levelId].mvp === buttonValues[buttonId] ? 1 : 0;
  game.currentLevel += 1;

  const gameId = getGameId(game.player);
  await kv.set(gameId, game);
}

export async function isGameOver(game: Game): Promise<boolean> {
  return game.currentLevel >= levels.length;
}

export async function getFrameVersion(): Promise<number> {
  // Use this version to avoid caching issues.
  return Date.now() / 1000;
}

export async function resetGame(fid: number) {
  const gameId = getGameId(fid);
  await kv.del(gameId);
}
