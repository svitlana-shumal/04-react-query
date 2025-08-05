import { Movie } from "../types/movie";
import axios from "axios";

export interface FetchMoviesProps {
  results: Movie[];
  page: number;
  total_results: number;
  total_pages: number;
}
const BASE_URL = "https://api.themoviedb.org/3/search/movie";
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export async function fetchMovies(
  query: string,
  page: number = 1
): Promise<FetchMoviesProps> {
  const config = {
    params: { query, page },
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  };
  const response = await axios.get<FetchMoviesProps>(BASE_URL, config);
  return response.data;
}
