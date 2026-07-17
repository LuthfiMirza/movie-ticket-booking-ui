export interface CastMember {
  name: string;
  role: string;
  /** TMDB profile photo URL. Absent when TMDB has no photo on file for this person. */
  profileUrl?: string;
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
  /** YouTube video key for the trailer, from TMDB. Absent when no trailer is available. */
  trailerKey?: string;
}
