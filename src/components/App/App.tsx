import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import css from "../App/App.module.css";
import { fetchMovies } from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import toast, { Toaster } from "react-hot-toast";
import { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import ReactPaginate from "react-paginate";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
    placeholderData: keepPreviousData,
  });

  const handleSubmit = (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1);
  };
  const openModal = () => setIsMovieModalOpen(true);
  const closeModal = () => {
    setIsMovieModalOpen(false);
    setSelectedMovie(null);
  };
  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    openModal();
  };
  const totalPages = data?.total_pages ?? 0;
  // для перевірки загальної кількості сторінок
  return (
    <>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSubmit} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {!isLoading &&
        !isError &&
        data?.results.length === 0 &&
        toast.error("No movie found for your request.")}
      {!isLoading && !isError && data && data.results.length > 0 && (
        <>
          <MovieGrid onSelect={handleSelectMovie} movies={data.results} />
          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      )}

      {isMovieModalOpen && selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </>
  );
}
