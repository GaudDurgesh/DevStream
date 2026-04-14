import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserLikedMovies } from "../store";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Card from "../components/Card";

export default function UserLiked() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const movies = useSelector((state) => state.netflix.movies) ?? [];
  const dispatch = useDispatch();
  const [email, setEmail] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) setEmail(currentUser.email);
      else navigate("/login");
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (email) dispatch(getUserLikedMovies(email));
  }, [email, dispatch]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.pageYOffset !== 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Container>
      <Navbar isScrolled={isScrolled} />
      <div className="hero">
        <span className="label">Your Collection</span>
        <h1>My List</h1>
        <span className="count">{movies.length} title{movies.length !== 1 ? "s" : ""} saved</span>
        <div className="divider" />
      </div>

      {movies.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🎬</div>
          <p>Your list is empty. Start adding movies!</p>
        </div>
      ) : (
        <div className="grid">
          {movies.map((movie, index) => (
            <Card
              movieData={movie}
              index={index}
              key={movie.id}
              isLiked={true}
            />
          ))}
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  background-color: #0a0a0a;
  min-height: 100vh;
  color: #fff;

  .hero {
    position: relative;
    padding: 7rem 3rem 2rem;
    background: linear-gradient(180deg, #1a0000 0%, #0a0a0a 100%);

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 40px,
        rgba(229, 9, 20, 0.03) 40px,
        rgba(229, 9, 20, 0.03) 41px
      );
      pointer-events: none;
    }

    .label {
      display: block;
      font-size: 11px;
      letter-spacing: 4px;
      color: #e50914;
      text-transform: uppercase;
      margin-bottom: 0.4rem;
    }

    h1 {
      font-family: "Bebas Neue", sans-serif;
      font-size: 5rem;
      line-height: 1;
      margin: 0 0 0.25rem;
      color: #fff;
    }

    .count {
      font-size: 13px;
      color: #666;
    }

    .divider {
      height: 1px;
      background: linear-gradient(90deg, #e50914 0%, transparent 60%);
      margin: 1.5rem 0 0;
    }
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    padding: 2rem 3rem 4rem;
  }

  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 6rem 2rem;
    color: #555;

    .empty-icon {
      font-size: 3.5rem;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.1rem;
    }
  }

  @media (max-width: 768px) {
    .hero {
      padding: 6rem 1.5rem 1.5rem;
      h1 { font-size: 3rem; }
    }
    .grid {
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      padding: 1.5rem 1.5rem 3rem;
      gap: 0.75rem;
    }
  }
`;