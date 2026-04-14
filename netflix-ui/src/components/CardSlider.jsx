import React, { useRef, useState } from "react";
import styled from "styled-components";
import Card from "./Card";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

export default function CardSlider({ data, title }) {
  const [showControls, setShowControls] = useState(false);

  // ✅ Track offset in px directly — no more mixed state/DOM math
  const [offset, setOffset] = useState(0);

  // ✅ Touch drag state
  const touchStartX = useRef(null);
  const touchStartOffset = useRef(0);

  const listRef = useRef();

  // ── Helpers ────────────────────────────────────────────────────────────────

  const getStep = () => {
    const firstCard = listRef.current?.querySelector("div");
    const cardWidth = firstCard?.getBoundingClientRect().width || 160;
    const gap = parseFloat(getComputedStyle(listRef.current).gap) || 10;
    return cardWidth + gap;
  };

  const getMaxOffset = () => {
    if (!listRef.current) return 0;
    // Total scrollable width minus the visible container width
    const sliderEl = listRef.current;
    const containerWidth = sliderEl.parentElement?.getBoundingClientRect().width || window.innerWidth;
    const totalWidth = sliderEl.scrollWidth;
    return Math.max(0, totalWidth - containerWidth + 100); // +100 for margin
  };

  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  const moveTo = (newOffset) => {
    const clamped = clamp(newOffset, 0, getMaxOffset());
    setOffset(clamped);
    listRef.current.style.transform = `translateX(${-clamped}px)`;
  };

  // ── Arrow buttons ──────────────────────────────────────────────────────────

  const handleDirection = (direction) => {
    const step = getStep();
    moveTo(direction === "left" ? offset - step : offset + step);
  };

  // ── Touch drag ─────────────────────────────────────────────────────────────

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartOffset.current = offset;
    setShowControls(true);
  };

  const onTouchMove = (e) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.touches[0].clientX;
    const newOffset = clamp(touchStartOffset.current + delta, 0, getMaxOffset());
    setOffset(newOffset);
    listRef.current.style.transform = `translateX(${-newOffset}px)`;
  };

  const onTouchEnd = () => {
    touchStartX.current = null;
  };

  // ──────────────────────────────────────────────────────────────────────────

  return (
    <Container
      className="flex column"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <h1>{title}</h1>
      <div className="wrapper">
        {/* Left arrow */}
        <div
          className={`slider-action left flex j-center a-center ${
            !showControls || offset === 0 ? "none" : ""
          }`}
          onClick={() => handleDirection("left")}
        >
          <AiOutlineLeft />
        </div>

        {/* Slider track */}
        <div
          className="flex slider"
          ref={listRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {data.map((movie, index) => (
            <Card movieData={movie} index={index} key={movie.id} />
          ))}
        </div>

        {/* Right arrow */}
        <div
          className={`slider-action right flex j-center a-center ${
            !showControls ? "none" : ""
          }`}
          onClick={() => handleDirection("right")}
        >
          <AiOutlineRight />
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  gap: 1rem;
  position: relative;
  padding: 2rem 0;

  h1 {
    margin-left: 50px;
    font-size: clamp(1rem, 2.5vw, 1.5rem);
    color: white;
  }

  .wrapper {
    position: relative;
    overflow: visible;

    .slider {
      width: max-content;
      gap: 1rem;
      /* ✅ transition only for arrow taps, not touch drag (drag sets inline directly) */
      transition: transform 0.3s ease-in-out;
      margin-left: 50px;
      padding-right: 50px;
      overflow: visible;
      /* ✅ Prevent iOS rubber-band on horizontal drag */
      touch-action: pan-x;
      user-select: none;
      -webkit-user-select: none;
    }

    .slider-action {
      position: absolute;
      z-index: 999;
      height: 100%;
      top: 0;
      bottom: 0;
      width: 50px;
      transition: 0.3s ease-in-out;
      background: rgba(0, 0, 0, 0.5);
      cursor: pointer;

      svg {
        font-size: 2rem;
        color: white;
      }
    }

    .none {
      display: none;
    }

    .left {
      left: 0;
    }

    .right {
      right: 0;
    }
  }

  @media (max-width: 768px) {
    padding: 1rem 0;

    h1 {
      margin-left: 1.5rem;
    }

    .wrapper {
      /* ✅ Clip the row horizontally so cards don't overflow the screen */
      overflow: hidden;

      .slider {
        margin-left: 1.5rem;
        gap: 0.6rem;
        /* ✅ No transition during touch drag for instant feel */
        transition: none;
      }

      /* ✅ Always show arrows on mobile (no hover state) */
      .slider-action {
        display: flex;
        width: 36px;
        background: rgba(0, 0, 0, 0.6);

        svg {
          font-size: 1.4rem;
        }
      }

      .none {
        /* ✅ Keep arrows visible on mobile even when showControls is false */
        display: flex;
      }
    }
  }

  @media (max-width: 480px) {
    padding: 0.75rem 0;

    h1 {
      margin-left: 1rem;
    }

    .wrapper {
      .slider {
        margin-left: 1rem;
        gap: 0.4rem;
      }

      .slider-action {
        width: 28px;

        svg {
          font-size: 1.1rem;
        }
      }
    }
  }
`;