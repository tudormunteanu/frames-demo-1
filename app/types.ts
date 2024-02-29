export type Game = {
  id: string;
  player: number;
  correctAnswers: number;
  currentLevel: number;
}

export type Level = {
  id: number;
  name: string;
  mvp: boolean;
}

export type MetadataProps = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}
