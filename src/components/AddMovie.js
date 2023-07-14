import React, { useEffect, useState } from "react";
import styles from "./AddMovie.module.css";

function AddMovie(props) {
  const [title, setTitle] = useState("");
  const [openingText, setOpeningText] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [movieValid, setMovieValid] = useState(false);

  useEffect(() => {
    const debouncedTimeout = setTimeout(() => {
      const isTitleValid = title.trim().length > 0;
      const isOpeningTextValid = openingText.trim().split(" ").length <= 20;
      const isReleaseDateValid = isValidDate(releaseDate);
      setMovieValid(isTitleValid && isOpeningTextValid && isReleaseDateValid);
    }, 500);
    return () => {
      clearTimeout(debouncedTimeout);
    };
  }, [title, openingText, releaseDate]);

  const titleChangeHandler = (e) => {
    setTitle(e.target.value);
  };

  const openingTextChangeHandler = (e) => {
    setOpeningText(e.target.value);
  };

  const dateChangeHandler = (e) => {
    setReleaseDate(e.target.value);
  };

  const isValidDate = (dateString) => {
    const formattedDate = new Date(dateString).toLocaleDateString("en-GB");
    return formattedDate !== "Invalid Date";
  };

  const formSubmitHandler = (e) => {
    e.preventDefault();
    if (movieValid) {
      const movie = {
        title: title,
        openingText: openingText,
        releaseDate: releaseDate,
      };
      props.onAddMovie(movie);
      setTitle("");
      setOpeningText("");
      setReleaseDate("");
    } else {
      console.log("nt a valid movie");
    }
  };

  return (
    <form className={styles.form} onSubmit={formSubmitHandler}>
      <div className={styles.formDiv}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={titleChangeHandler}
        />
      </div>
      <div className={styles.formDiv}>
        <label htmlFor="openingText">Opening Text (max 20 words):</label>
        <textarea
          id="openingText"
          value={openingText}
          onChange={openingTextChangeHandler}
        />
      </div>
      <div className={styles.formDiv}>
        <label htmlFor="releaseDate">Release Date:</label>
        <input
          type="date"
          id="releaseDate"
          value={releaseDate}
          onChange={dateChangeHandler}
        />
      </div>
      <div className={styles.formButton}>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}

export default AddMovie;
