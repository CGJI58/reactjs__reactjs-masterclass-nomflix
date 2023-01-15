const API_KEY = "a4072b5f96ae97201134740f0b7887fb";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
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
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
}

export async function getMovies() {
  const data = await fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`);
  const json = await data.json();
  return json;
  // fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
  //   (response) => response.json()
}
