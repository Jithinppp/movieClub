import React, { useEffect, useState } from "react";
import "./App.css";
import { FilmIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const apiKey = "25758446";

function App() {
  const [movies, setMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentMovie, setCurrentMovie] = useState({});

  // every search input fire omdb http req
  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${apiKey}&s=${searchInput}`
        );

        if (!res.ok)
          throw new Error("failed to fetch. check your internet connection");

        const data = await res.json();
        if (data.Response === "False") throw new Error("no movies found");

        console.log(data);
        setMovies(data.Search);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    if (searchInput.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    fetchMovies();
  }, [searchInput]);

  return (
    <div className="App">
      {/* navbar */}
      <Navigation setSearchInput={setSearchInput} />
      <div className="boxContainer">
        {/* box one */}
        <SearchResult
          movies={movies}
          error={error}
          isLoading={loading}
          setCurrentMovie={setCurrentMovie}
        />
        {/* box two */}
        <MoviesWatched currentMovie={currentMovie} />
      </div>
    </div>
  );
}

export default App;

// navbar
function Navigation({ setSearchInput }) {
  return (
    <nav className="navigation">
      <div className="logoContainer">
        <FilmIcon height={25} width={25} />
        <span>usePopcorns</span>
      </div>
      <input
        placeholder="Search movies..."
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <p>
        found <strong>{0}</strong> movies
      </p>
    </nav>
  );
}

// search result
function SearchResult({ movies, isLoading, error, setCurrentMovie }) {
  console.log(error, movies);
  return (
    <div>
      {isLoading && <Loader />}
      {!isLoading && !error && (
        <ul className="moviesContainer">
          {movies.map((movie) => (
            <MovieItem
              key={movie.imdbID}
              movie={movie}
              setCurrentMovie={setCurrentMovie}
            />
          ))}
        </ul>
      )}
      {error && <ErrorMessage errorMsg={error} />}
    </div>
  );
}

// movies watched
function MoviesWatched({ currentMovie }) {
  useEffect(() => {
    console.log("movie Changed", currentMovie);
  }, [currentMovie]);
  return (
    <div>
      <h3>Movies watched</h3>
      {currentMovie && <p>{currentMovie.Title}</p>}
    </div>
  );
}

function ErrorMessage({ errorMsg }) {
  return <p>{errorMsg}</p>;
}
function Loader() {
  return <p>Loading...</p>;
}

function MovieItem({ movie, setCurrentMovie }) {
  return (
    <li className="movieItem" onClick={() => setCurrentMovie(movie)}>
      <img src={movie.Poster} alt={movie.Title} className="movieImage" />
      <div className="movieDescContainer">
        <h3>{movie.Title}</h3>
        <p>{movie.Year}</p>
      </div>
    </li>
  );
}
