import { atom } from "recoil";
import { IMovie } from "./api";

export const movieState = atom<IMovie>({
  key: "banner",
  default: {
    adult: false,
    backdrop_path: "",
    genre_ids: [0],
    id: 0,
    original_language: "",
    original_title: "",
    overview: "",
    popularity: 0,
    poster_path: "",
    release_date: "",
    title: "",
    video: false,
    vote_average: 0,
    vote_count: 0,
  },
});
// export {};
