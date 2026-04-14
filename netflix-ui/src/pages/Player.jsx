import React from "react";
import styled from "styled-components";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import video from "../assets/VideoST.mp4";

export default function Player() {
  const navigate = useNavigate();

  return (
    <Container>
      <div className="player">
        <div className="back">
          <BsArrowLeft onClick={() => navigate(-1)} />
        </div>
        <video
          src={video}
          autoPlay
          loop
          controls
          playsInline          /* ← prevents iOS from forcing fullscreen */
          webkit-playsinline   /* ← older iOS Safari */
        />
      </div>
    </Container>
  );
}

const Container = styled.div`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .player {
    position: relative;
    width: 100vw;
    height: 100vh;
    height: 100dvh; /* ← dynamic viewport height: fixes mobile browser chrome overlap */
    background: #000;
    overflow: hidden;

    .back {
      position: absolute;
      top: env(safe-area-inset-top, 0px); /* ← respects notch / status bar */
      left: 0;
      padding: 1rem 1.25rem;
      z-index: 10;

      svg {
        display: block;
        font-size: 2rem;
        color: #fff;
        cursor: pointer;
        filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.6));
        -webkit-tap-highlight-color: transparent; /* ← removes tap flash on mobile */
        transition: opacity 0.2s ease;

        &:active {
          opacity: 0.6;
        }
      }
    }

    video {
      position: absolute;
      inset: 0;          /* shorthand for top/right/bottom/left: 0 */
      width: 100%;
      height: 100%;
      object-fit: cover; /* fills screen without distortion */
    }
  }

  /* ── Small phones (≤ 375px) ─────────────────────── */
  @media (max-width: 375px) {
    .player .back svg {
      font-size: 1.75rem;
    }
  }

  /* ── Landscape orientation ───────────────────────── */
  @media (orientation: landscape) and (max-height: 500px) {
    .player .back {
      padding: 0.5rem 0.75rem;
    }

    .player .back svg {
      font-size: 1.5rem;
    }
  }

  /* ── Tablets (portrait & landscape) ─────────────── */
  @media (min-width: 768px) {
    .player .back svg {
      font-size: 2.5rem;
    }

    .player .back {
      padding: 1.5rem 2rem;
    }
  }
`;