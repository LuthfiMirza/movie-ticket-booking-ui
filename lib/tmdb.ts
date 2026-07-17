import type { CastMember, Movie } from "@/types";
import { createPosterDataUri } from "@/lib/poster";

const TMDB_API_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const TMDB_PROFILE_IMAGE_BASE = "https://image.tmdb.org/t/p/w185";

interface TmdbGenre {
  id: number;
  name: string;
}

interface TmdbCastMember {
  name: string;
  character: string;
  profile_path: string | null;
}

interface TmdbVideo {
  key: string;
  site: string;
  type: string;
}

interface TmdbReleaseDateEntry {
  certification: string;
}

interface TmdbReleaseDatesResult {
  iso_3166_1: string;
  release_dates: TmdbReleaseDateEntry[];
}

interface TmdbMovieSummary {
  id: number;
  title: string;
}

interface TmdbMovieDetails extends TmdbMovieSummary {
  poster_path: string | null;
  overview: string;
  runtime: number | null;
  genres: TmdbGenre[];
  credits: { cast: TmdbCastMember[] };
  videos: { results: TmdbVideo[] };
  release_dates: { results: TmdbReleaseDatesResult[] };
}

/** TMDB's v4 Read Access Token is a long JWT; the v3 API Key is a short hex string. */
function isReadAccessToken(credential: string): boolean {
  return credential.split(".").length === 3 && credential.length > 100;
}

async function tmdbFetch<T>(path: string): Promise<T> {
  const credential = process.env.TMDB_API_KEY;
  if (!credential) {
    throw new Error("Missing TMDB_API_KEY environment variable");
  }

  const url = new URL(`${TMDB_API_BASE}${path}`);
  const headers: HeadersInit = {};

  if (isReadAccessToken(credential)) {
    headers.Authorization = `Bearer ${credential}`;
  } else {
    url.searchParams.set("api_key", credential);
  }

  const response = await fetch(url.toString(), {
    headers,
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

function getPosterUrl(title: string, posterPath: string | null): string {
  return posterPath ? `${TMDB_IMAGE_BASE}${posterPath}` : createPosterDataUri(title, "#1a1a2e");
}

function getTrailerKey(videos: TmdbVideo[]): string | undefined {
  const trailer =
    videos.find((video) => video.site === "YouTube" && video.type === "Trailer") ??
    videos.find((video) => video.site === "YouTube");
  return trailer?.key;
}

function getUsCertification(results: TmdbReleaseDatesResult[]): string {
  const us = results.find((result) => result.iso_3166_1 === "US");
  const certification = us?.release_dates.find((entry) => entry.certification)?.certification;
  return certification || "NR";
}

function mapCast(cast: TmdbCastMember[]): CastMember[] {
  return cast.slice(0, 3).map((member) => ({
    name: member.name,
    role: member.character || "—",
    profileUrl: member.profile_path ? `${TMDB_PROFILE_IMAGE_BASE}${member.profile_path}` : undefined,
  }));
}

function mapMovieDetails(internalId: string, details: TmdbMovieDetails): Movie {
  return {
    id: internalId,
    title: details.title,
    posterUrl: getPosterUrl(details.title, details.poster_path),
    genres: details.genres.map((genre) => genre.name),
    durationMinutes: details.runtime ?? 0,
    synopsis: details.overview,
    rating: getUsCertification(details.release_dates.results),
    cast: mapCast(details.credits.cast),
    trailerKey: getTrailerKey(details.videos.results),
  };
}

async function getNowPlayingMovies(limit: number): Promise<TmdbMovieSummary[]> {
  const data = await tmdbFetch<{ results: TmdbMovieSummary[] }>(
    "/movie/now_playing?language=en-US&page=1"
  );
  return data.results.slice(0, limit);
}

async function getMovieDetails(tmdbId: number): Promise<TmdbMovieDetails> {
  return tmdbFetch<TmdbMovieDetails>(
    `/movie/${tmdbId}?append_to_response=credits,videos,release_dates&language=en-US`
  );
}

export async function fetchNowPlayingMovies(internalIds: string[]): Promise<Movie[]> {
  const summaries = await getNowPlayingMovies(internalIds.length);

  return Promise.all(
    summaries.map(async (summary, index) => {
      const details = await getMovieDetails(summary.id);
      return mapMovieDetails(internalIds[index], details);
    })
  );
}
