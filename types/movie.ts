export interface CastMember {
  name: string;
  role: string;
}

export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  genres: string[];
  durationMinutes: number;
  synopsis: string;
  rating: string;
  cast: CastMember[];
}
