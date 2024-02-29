"use server";

import { Game } from "@/app/types";
import { levels } from "@/app/constants";

const runningGames: {[key: number]: Game} = {};

export async function getGame(fid: number): Promise<Game> {
  if(runningGames[fid] === undefined) {
    runningGames[fid] = {
      id: "1",
      player: fid,
      correctAnswers: 0,
      currentLevel: 0
    };
  }
  return runningGames[fid];
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

  const fid = game.player;
  console.log("fid", fid, "buttonId", buttonValues[buttonId]);
  console.log("correctAnswers", game.correctAnswers);
  console.log("----");
}

export async function isGameOver(game: Game): Promise<boolean> {
  return game.currentLevel >= levels.length;
}

export async function getFrameVersion(): Promise<number> {
  // Use this version to avoid caching issues.
  return Date.now() / 1000;
}
