export type Game = {
  id: string;
  player: number;
  level: number;
  created_at: number;
  correct_answers: number;
}

export type Level = {
  id: number;
  name: string;
  mvp: boolean;
}
