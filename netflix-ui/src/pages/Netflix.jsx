import React, { useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import { useState } from "react";
import backgroundImage from "../assets/home.jpg";
import MovieLogo from "../assets/homeTitle.webp";
import { FaPlay } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies, getGenres } from "../store/index.js";
import Slider from "../components/Slider.jsx";
import SearchResults from "../components/SearchResults.jsx";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import axios from "axios";

export default function Netflix() {
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const genresLoaded = useSelector((state) => state.netflix.genresLoaded);
  const movies = useSelector((state) => state.netflix.movies);
  const dispatch = useDispatch();
  const [email, setEmail] = useState(undefined);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) setEmail(currentUser.email);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    dispatch(getGenres());
  }, []);

  useEffect(() => {
    if (genresLoaded) {
      dispatch(fetchMovies({ type: "all" }));
    }
  }, [genresLoaded]);

  // ✅ Moved inside useEffect to avoid re-registering on every render
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset !== 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchSearchMovies = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&include_adult=false`
        );
        const data = await res.json();
        setSearchResults(data.results || []);
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
      }
    };
    const delay = setTimeout(fetchSearchMovies, 500);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  const addToList = async (item) => {
    try {
      await axios.post(`${BACKEND_URL}/api/user/add`, {
        email,
        data: {
          id: item.id,
          name: item.title || item.name,
          image: item.backdrop_path || item.poster_path,
          genres: [],
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <Navbar isScrolled={isScrolled} setSearchQuery={setSearchQuery} />

      {searchQuery.trim() ? (
        <SearchResults
          searchQuery={searchQuery}
          searchResults={searchResults}
        />
      ) : (
        <>
          <div className="hero">
            <img
              src={backgroundImage}
              alt="background"
              className="background-image"
            />
            <div className="container">
              <div className="logo">
                <img src={MovieLogo} alt="Movie Logo" />
              </div>
              <div className="buttons flex">
                <button
                  className="flex j-center a-center"
                  onClick={() => navigate("/player")}
                >
                  <FaPlay /> Play
                </button>
                <button className="flex j-center a-center">
                  <AiOutlineInfoCircle /> More Info
                </button>
              </div>
            </div>
          </div>

          <Slider movies={movies} />
        </>
      )}
    </Container>
  );
}

const Container = styled.div`
  background-color: black;

  .hero {
    position: relative;

    .background-image {
      filter: brightness(60%);
    }

    img {
      height: 100vh;
      width: 100vw;
      object-fit: cover;
    }

    .container {
      position: absolute;
      bottom: 5rem;
      left: 0;
      width: 100%;

      .logo {
        img {
          width: clamp(150px, 30vw, 380px);
          height: auto;
          margin-left: clamp(1.5rem, 5vw, 5rem);
        }
      }

      .buttons {
        margin: 1.5rem clamp(1.5rem, 5vw, 5rem);
        gap: 1rem;
        flex-wrap: wrap;

        button {
          font-size: clamp(0.85rem, 2vw, 1.4rem);
          gap: 0.6rem;
          border-radius: 0.2rem;
          padding: 0.5rem 1.5rem;
          border: none;
          cursor: pointer;
          transition: 0.3s ease-in-out;
          white-space: nowrap;

          &:hover {
            opacity: 0.8;
          }

          &:nth-of-type(2) {
            background-color: rgba(109, 109, 110, 0.7);
            color: white;

            svg {
              font-size: clamp(1rem, 2.5vw, 1.8rem);
            }
          }
        }
      }
    }
  }

  .movies {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 100px 50px;
  }

  .card {
    width: 200px;
    cursor: pointer;
    color: white;
    display: flex;
    flex-direction: column;
  }

  /* Tablet */
  @media (max-width: 768px) {
    .hero {
      .container {
        bottom: 3rem;

        .buttons {
          gap: 0.8rem;

          button {
            padding: 0.5rem 1.2rem;
          }
        }
      }
    }
  }

  /* Mobile */
  @media (max-width: 480px) {
    .hero {
      img {
        height: 100svh;
      }

      .container {
        bottom: 2rem;

        .logo img {
          width: clamp(120px, 50vw, 200px);
          margin-left: 1.2rem;
        }

        .buttons {
          margin: 1rem 1.2rem;
          gap: 0.6rem;

          button {
            font-size: 0.85rem;
            padding: 0.45rem 1rem;
            gap: 0.4rem;

            &:nth-of-type(2) svg {
              font-size: 1rem;
            }
          }
        }
      }
    }

    .movies {
      padding: 60px 16px;
    }

    .card {
      width: calc(50% - 10px);
    }
  }
`;