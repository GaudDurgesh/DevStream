import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMovies, getGenres } from "../store";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import styled from "styled-components";
import NotAvailable from "../components/NotAvailable";
import Navbar from "../components/Navbar";
import Slider from "../components/Slider";
import SelectGenre from "../components/SelectGenre";
// import { API_KEY } from "../utils/constants";
import SearchResults from "../components/SearchResults";


export default function Movies() {
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const genresLoaded = useSelector((state) => state.netflix.genresLoaded);
  const movies = useSelector((state) => state.netflix.movies);
  const genres = useSelector((state) => state.netflix.genres);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (!currentUser) navigate("/login");
    });
    return unsub;
  }, []);

  useEffect(() => {
    dispatch(getGenres());
  }, []);

  useEffect(() => {
    if (genresLoaded) dispatch(fetchMovies({ type: "movie" }));
  }, [genresLoaded]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.pageYOffset !== 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchSearchMovies = async () => {
      if (!searchQuery.trim()) { setSearchResults([]); return; }
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&include_adult=false`
        );
        const data = await res.json();
        setSearchResults(data.results || []);
      } catch { setSearchResults([]); }
    };
    const delay = setTimeout(fetchSearchMovies, 500);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  return (
    <Container>
      <Navbar isScrolled={isScrolled} setSearchQuery={setSearchQuery} />
      <div className="data">
        {searchQuery.trim() ? (
          <SearchResults searchQuery={searchQuery} searchResults={searchResults} />
        ) : (
          <>
            <SelectGenre genres={genres} type="movie" />
            {movies.length ? <Slider movies={movies} /> : <NotAvailable type="movie" />}
          </>
        )}
      </div>
    </Container>
  );
}
const Container = styled.div`
  background-color: black;
  min-height: 100vh;

  .data {
    margin-top: 8rem;
    padding: 0 2rem;

    .not-available {
      text-align: center;
      color: white;
      font-size: clamp(0.9rem, 2vw, 1.2rem);
      padding: 2rem;
    }
  }

  @media (max-width: 768px) {
    .data {
      margin-top: 6rem;
      padding: 0 1.2rem;
    }
  }

  @media (max-width: 480px) {
    .data {
      margin-top: 5rem;
      padding: 0 0.8rem;
    }
  }
`;