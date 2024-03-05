"use server";

import {kv} from "@vercel/kv";
import {Game, Level} from "@/app/types";
import {tmpLevels} from "@/app/constants";

function getGameId(fid: number): string {
  // Generate a gloabl id
  return `fid:${fid.toString()}`;
}

export async function getOrCreateGame(fid: number): Promise<Game> {
  const id = getGameId(fid);

  let runningGame = await kv.get(id) as Game | null;
  if(runningGame !== null) {
    return runningGame as Game;
  }

  const newGame = {
    id: id,
    player: fid,
    correctAnswers: 0,
    currentLevel: 0,
    levels: await generateRandomLevels(),
  };
  await kv.set(id, newGame);
  return newGame as Game;
}

export async function getGameByFid(fid: number): Promise<Game | null> {
  const gameId = getGameId(fid);
  return await getGame(gameId);
}

export async function getGame(id: string): Promise<Game | null> {
  let runningGame = await kv.get(id) as Game;
  return runningGame;
}

export async function updateGame(game: Game, buttonId: number) {

  const {currentLevel: levelId, levels} = game;

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
  const {levels} = game;
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

export async function generateRandomLevels(): Promise<Level[]> {
  const shuffledTmpLevels = tmpLevels.sort(() => Math.random() - 0.5);
  return shuffledTmpLevels.slice(0, 5).map((level, index) => {
    return {
      ...level,
      id: index
    };
  });
}
