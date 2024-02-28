"use server";

import { Game } from "@/app/types";
import { levels } from "@/app/constants";

export function getGame(fid: number): Game {
  return {
    id: "1",
    player: fid,
    level: 1,
    created_at: 1,
    correct_answers: 0
  };
}

export function updateGame(game: Game, levelId: number, buttonId: number) {

  const buttonValues: {[key: number]: boolean} = {
      1: true,
      2: false
  };

  if(!(levelId > 0) || !(levelId < levels.length))
    return;

  game.correct_answers += levels[levelId].mvp === buttonValues[buttonId] ? 1 : 0;

  const fid = game.player;
  console.log("step id from API: ", levelId);  
  console.log("fid", fid, "buttonId", buttonValues[buttonId]);
  console.log("correct?", levels[levelId].mvp === buttonValues[buttonId]);
  console.log("----");
}

export function isGameOver(levelId: number): boolean {
  return levelId >= levels.length;
}
