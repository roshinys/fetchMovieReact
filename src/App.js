import React, { useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [retryTimeoutId, setRetryTimeoutId] = useState(null);
  const [cancelRetry, setCancelRetry] = useState(false);

  const fetchMovieHandler = async () => {
    console.log("movie handler");
    try {
      const response = await fetch("https://swapi.dev/api/film/");
      if (!response.ok) {
        throw new Error("Something went wrong ....Retrying ");
      }
      const data = await response.json();
      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setIsLoading(false);
      setMovies(transformedMovies);
    } catch (err) {
      if (cancelRetry) {
        console.log("API call canceled");
        return;
      }
      setError(err.message);
      setIsLoading(false);
      setRetryCount(retryCount + 1);
      console.log("Retrying...");
      setRetryTimeoutId(
        setTimeout(() => {
          fetchMovieHandler();
        }, 1000)
      );
    }
    return;
  };

  useEffect(() => {
    return () => {
      clearTimeout(retryTimeoutId);
    };
  }, [retryTimeoutId]);

  const cancelRetryHandler = () => {
    clearTimeout(retryTimeoutId);
    setCancelRetry(true);
    setIsLoading(false);
    setError(null);
  };

  let content = <p>Found No Movies...</p>;
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }
  if (error) {
    content = (
      <>
        <p>{error}</p>
        <button onClick={cancelRetryHandler}>cancel retry</button>
      </>
    );
  }
  if (isLoading) {
    content = <p>Loading ....</p>;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
