export interface Movie {
  id: string;
  title: string;
  poster_path?: string;
  backdrop_path?: string;
  overview?: string;
  release_date?: string;
  vote_average?: number;
  homepage?: string;
  runtime?: number;

  genres?: {
    id: number;
    name: string;
  }[];
}
