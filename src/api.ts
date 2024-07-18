const API_KEY = "a4072b5f96ae97201134740f0b7887fb";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  category?: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
}

export interface IGetAllMoviesResult {
  nowPlaying: IGetMoviesResult;
  top_rated: IGetMoviesResult;
  upcoming: IGetMoviesResult;
}

export async function getMovies() {
  const nowPlaying = await (
    await fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`)
  ).json();
  // const latest = await (
  //   await fetch(`${BASE_PATH}/movie/latest?api_key=${API_KEY}`)
  // ).json();
  const top_rated = await (
    await fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`)
  ).json();
  const upcoming = await (
    await fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`)
  ).json();

  return {
    nowPlaying,
    top_rated,
    upcoming,
  };
}
