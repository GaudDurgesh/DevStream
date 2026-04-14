import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import video from "../assets/VideoST.mp4";
import { IoPlayCircleSharp } from "react-icons/io5";
import { RiThumbUpFill, RiThumbDownFill } from "react-icons/ri";
import { BsCheck } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import axios from "axios";
import { firebaseAuth } from "../utils/firebase-config";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { removedFromLikedMovies } from "../store/index.js";


export default function Card({ movieData, isLiked = false }) {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState(undefined);

  const isMobile = window.innerWidth <= 768;
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (!isHovered) setVideoReady(false);
  }, [isHovered]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) setEmail(currentUser.email);
      else navigate("/login");
    });
    return () => unsubscribe();
  }, []);

  const addToList = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/user/add`, {
        email,
        data: movieData,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const imageUrl = `https://image.tmdb.org/t/p/w500${movieData.image}`;

  return (
    <Container
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      onClick={() => isMobile && setIsHovered((prev) => !prev)}
    >
      {/* Base card image */}
      <img src={imageUrl} alt={movieData.name} />

      {isHovered && (
        <div className="hover">
          {/* ── TOP: image / video ── */}
          <div className="image-video-container">
            <img
              src={imageUrl}
              alt={movieData.name}
              className={videoReady ? "fade-out" : ""}
              onClick={() => navigate("/player")}
            />
            {!isMobile && (
              <video
                src={video}
                autoPlay
                loop
                muted
                className={videoReady ? "fade-in" : ""}
                onCanPlay={() => setVideoReady(true)}
                onClick={() => navigate("/player")}
              />
            )}
          </div>

          {/* ── BOTTOM: info ── */}
          <div className="info-container">
            <h3 className="name" onClick={() => navigate("/player")}>
              {movieData.name}
            </h3>

            <div className="icons">
              <div className="controls">
                <IoPlayCircleSharp title="Play" onClick={() => navigate("/player")} />
                <RiThumbUpFill title="Like" />
                <RiThumbDownFill title="Dislike" />
                {isLiked ? (
                  <BsCheck
                    title="Remove from List"
                    onClick={() =>
                      dispatch(removedFromLikedMovies({ email, movieId: movieData.id }))
                    }
                  />
                ) : (
                  <AiOutlinePlus title="Add to my list" onClick={addToList} />
                )}
              </div>
              <div className="info">
                <BiChevronDown title="More Info" />
              </div>
            </div>

            <div className="genres">
              <ul>
                {movieData.genres && movieData.genres.length > 0 ? (
                  movieData.genres.map((genre) => <li key={genre}>{genre}</li>)
                ) : (
                  <li>No genres available</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: clamp(120px, 18vw, 230px);
  cursor: pointer;
  position: relative;
  flex-shrink: 0;

  /* Base card image */
  > img {
    border-radius: 0.2rem;
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  .hover {
    /* ✅ High z-index so it floats above all sibling cards */
    z-index: 500;

    width: clamp(200px, 22vw, 22rem);
    position: absolute;

    /* ✅ Centered over the card, pops upward */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.95);

    border-radius: 0.4rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.85);
    background-color: #181818;
    overflow: hidden;

    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease, transform 0.25s ease;
  }

  /* ✅ Trigger on hover */
  &:hover .hover {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    pointer-events: all;
  }

  /* ── Image / Video section (TOP half) ── */
  .image-video-container {
    position: relative;
    width: 100%;
    height: 140px;
    background: #000;

    /* ✅ No overflow hidden here — we want video/img contained but not clipping */
    overflow: hidden;

    img,
    video {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      cursor: pointer;
    }

    img {
      z-index: 2;
      opacity: 1;
      transition: opacity 0.4s ease;

      /* ✅ Fade image out once video is ready */
      &.fade-out {
        opacity: 0;
      }
    }

    video {
      z-index: 3;
      opacity: 0;
      transition: opacity 0.5s ease;

      /* ✅ Fade video in when ready */
      &.fade-in {
        opacity: 1;
      }
    }
  }

  /* ── Info section (BOTTOM half) ── */
  .info-container {
    padding: 0.75rem 0.75rem 0.6rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;

    .name {
      font-size: clamp(0.75rem, 1.4vw, 1rem);
      color: white;
      margin: 0;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &:hover {
        text-decoration: underline;
      }
    }

    .icons {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .controls {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        flex-wrap: wrap;
      }

      svg {
        font-size: clamp(1.1rem, 2.5vw, 1.5rem);
        cursor: pointer;
        color: white;
        transition: color 0.2s, transform 0.2s;

        &:hover {
          color: #b8b8b8;
          transform: scale(1.15);
        }
      }
    }

    .genres ul {
      display: flex;
      gap: 0.35rem;
      flex-wrap: wrap;
      padding: 0;
      margin: 0;
      list-style: none;

      li {
        font-size: clamp(0.6rem, 1.1vw, 0.78rem);
        color: #b3b3b3;

        &:not(:last-child)::after {
          content: "·";
          margin-left: 0.35rem;
          color: #555;
        }
      }
    }
  }

  /* ── Mobile ── */
  @media (max-width: 768px) {
    width: clamp(100px, 28vw, 160px);

    .hover {
      width: clamp(170px, 62vw, 240px);
    }

    .image-video-container {
      height: 110px;
    }
  }

  @media (max-width: 480px) {
    width: clamp(90px, 32vw, 140px);

    .hover {
      width: clamp(150px, 72vw, 210px);
    }

    .image-video-container {
      height: 90px;
    }

    .icons svg {
      font-size: 1rem;
    }
  }
`;