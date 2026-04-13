import React, { useRef, useState } from "react";
import styled from "styled-components";
import Card from "./Card";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

export default function CardSlider({ data, title }) {
  const [showControls, setShowControls] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);
  const listRef = useRef();

  const handleDirection = (direction) => {
    // ✅ use actual card width dynamically instead of hardcoded 230
    const cardWidth =
      listRef.current.querySelector("div")?.getBoundingClientRect().width || 200;
    const gap = 16; // 1rem gap
    const step = cardWidth + gap;

    let distance = listRef.current.getBoundingClientRect().x - 70;

    if (direction === "left" && sliderPosition > 0) {
      listRef.current.style.transform = `translateX(${step + distance}px)`;
      setSliderPosition(sliderPosition - 1);
    }
    if (
      direction === "right" &&
      sliderPosition < Math.floor(data.length / 4)
    ) {
      listRef.current.style.transform = `translateX(${-step + distance}px)`;
      setSliderPosition(sliderPosition + 1);
    }
  };

  return (
    <Container
      className="flex column"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      // ✅ touch support for showing controls on mobile
      onTouchStart={() => setShowControls(true)}
    >
      <h1>{title}</h1>
      <div className="wrapper">
        <div
          className={`slider-action left ${!showControls ? "none" : ""} flex j-center a-center`}
        >
          <AiOutlineLeft onClick={() => handleDirection("left")} />
        </div>

        <div className="flex slider" ref={listRef}>
          {data.map((movie, index) => (
            <Card movieData={movie} index={index} key={movie.id} />
          ))}
        </div>

        <div
          className={`slider-action right ${!showControls ? "none" : ""} flex j-center a-center`}
        >
          <AiOutlineRight onClick={() => handleDirection("right")} />
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
    font-size: clamp(1rem, 2.5vw, 1.5rem); /* ✅ responsive title */
    color: white;
  }

  .wrapper {
    position: relative;
    overflow: hidden; /* ✅ clips cards that go outside */

    .slider {
      width: max-content;
      gap: 1rem;
      transform: translateX(0px);
      transition: 0.3s ease-in-out;
      margin-left: 50px;
      padding-right: 50px; /* ✅ space for right arrow */
    }

    .slider-action {
      position: absolute;
      z-index: 99;
      height: 100%;
      top: 0;
      bottom: 0;
      width: 50px;
      transition: 0.3s ease-in-out;
      background: rgba(0, 0, 0, 0.4); /* ✅ visible tap area on mobile */
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
      .slider {
        margin-left: 1.5rem;
        gap: 0.6rem;
      }

      /* ✅ always show arrows on mobile (no hover) */
      .slider-action {
        display: flex;
        width: 36px;

        svg {
          font-size: 1.4rem;
        }
      }

      .none {
        display: flex; /* ✅ override none on mobile — always visible */
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