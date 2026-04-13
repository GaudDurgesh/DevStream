import React from "react";
import CardSlider from "./CardSlider";
import styled from "styled-components";

export default function Slider({ movies }) {
  const getMoviesFromRange = (from, to) => movies.slice(from, to);

  const rows = [
    { title: "Trending Now", data: getMoviesFromRange(0, 10) },
    { title: "New Releases", data: getMoviesFromRange(10, 20) },
    { title: "Blockbuster Movies", data: getMoviesFromRange(20, 30) },
    { title: "Popular on Netflix", data: getMoviesFromRange(30, 40) },
    { title: "Action Movies", data: getMoviesFromRange(40, 50) },
    { title: "Epics", data: getMoviesFromRange(50, 60) },
  ];

  return (
    <Container>
      {rows.map(({ title, data }) =>
        data.length ? (
          <CardSlider key={title} title={title} data={data} />
        ) : null,
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 3vw, 2.5rem);
  padding: 1rem 0 3rem;

  /* Tablet */
  @media (max-width: 768px) {
    gap: 1.5rem;
    padding-bottom: 2rem;
  }

  /* Mobile */
  @media (max-width: 480px) {
    gap: 1rem;
    padding: 0.5rem 0 1.5rem;
  }
`;
