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
  const navigate = useNavigate();
  const [email, setEmail] = useState(undefined);

  const isMobile = window.innerWidth <= 768;
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

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

  return (
    <Container
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      onClick={() => isMobile && setIsHovered((prev) => !prev)}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
        alt="Movies"
      />

      {isHovered && (
        <div className="hover">
          <div className="image-video-container">
            <img
              src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
              alt="Movies"
              onClick={() => navigate("/player")}
            />

            {/* Desktop only video */}
            {!isMobile && (
              <video
                src={video}
                autoPlay
                loop
                muted
                onClick={() => navigate("/player")}
              />
            )}
          </div>

          <div className="info-container flex column">
            <h3 className="name" onClick={() => navigate("/player")}>
              {movieData.name}
            </h3>

            <div className="icons flex j-center">
              <div className="controls flex">
                <IoPlayCircleSharp
                  title="Play"
                  onClick={() => navigate("/player")}
                />
                <RiThumbUpFill title="Like" />
                <RiThumbDownFill title="Dislike" />

                {isLiked ? (
                  <BsCheck
                    title="Remove from List"
                    onClick={() =>
                      dispatch(
                        removedFromLikedMovies({
                          email,
                          movieId: movieData.id,
                        })
                      )
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

            <div className="genres flex">
              <ul className="flex">
                {movieData.genres && movieData.genres.length > 0 ? (
                  movieData.genres.map((genre) => (
                    <li key={genre}>{genre}</li>
                  ))
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

  img {
    border-radius: 0.2rem;
    width: 100%;
    height: 100%;
    display: block;
  }

  .hover {
    z-index: 90;
    width: clamp(160px, 22vw, 20rem);
    position: absolute;
    top: -120px;

    left: 50%;
    transform: translateX(-50%) scale(0.9);

    border-radius: 0.3rem;
    box-shadow: rgba(0, 0, 0, 0.75) 0px 3px 10px;
    background-color: #181818;

    opacity: 0;
    transition: 0.3s ease-in-out;

    .image-video-container {
      position: relative;
      width: 100%;
      height: 130px;
      border-radius: 0.3rem;
      overflow: hidden;

      img,
      video {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      video {
        z-index: 5;
      }
    }

    .info-container {
      padding: 0.6rem;
      gap: 0.4rem;

      .name {
        font-size: clamp(0.7rem, 1.5vw, 1rem);
        color: white;
        margin: 0;
      }
    }

    .icons {
      justify-content: space-between;

      .controls {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      svg {
        font-size: clamp(1rem, 2.5vw, 1.5rem);
        cursor: pointer;
        color: white;
        transition: 0.3s;

        &:hover {
          color: #b8b8b8;
        }
      }
    }

    .genres ul {
      display: flex;
      gap: 0.4rem;
      flex-wrap: wrap;
      padding: 0;
      margin: 0;

      li {
        font-size: clamp(0.6rem, 1.2vw, 0.8rem);
        color: #b3b3b3;
        list-style: none;
      }
    }
  }

  /* hover animation */
  &:hover .hover {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }

  /* Mobile */
  @media (max-width: 768px) {
    width: clamp(100px, 28vw, 160px);

    .hover {
      width: clamp(150px, 60vw, 220px);
      top: -100px;
    }
  }

  @media (max-width: 480px) {
    width: clamp(90px, 32vw, 140px);

    .hover {
      width: clamp(140px, 70vw, 200px);
      top: -80px;

      .image-video-container {
        height: 80px;
      }

      .icons svg {
        font-size: 1rem;
      }
    }
  }
`;