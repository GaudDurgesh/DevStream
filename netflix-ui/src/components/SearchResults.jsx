import React from "react";
import styled from "styled-components";
import Card from "./Card";
import { useSelector } from "react-redux";

export default function SearchResults({ searchQuery, searchResults }) {
  const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
  const genres = useSelector((state) => state.netflix.genres);

  const getGenreNames = (genreIds = []) => {
    return genreIds
      .map((id) => genres.find((g) => g.id === id)?.name)
      .filter(Boolean)
      .slice(0, 3);
  };

  return (
    <Container>
      {searchResults.length === 0 ? (
        <h2 className="no-results">No Results Found</h2>
      ) : (
        <div className="search-grid">
          {searchResults
            .filter((item) => item.media_type !== "person")
            .map((item) => (
              <Card
                key={item.id}
                movieData={{
                  id: item.id,
                  name: item.title || item.name,
                  image: item.backdrop_path || item.poster_path,
                  genres: getGenreNames(item.genre_ids),
                }}
              />
            ))}
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  padding: 8rem 3rem 2rem;

  .no-results {
    color: white;
    text-align: center;
    margin-top: 5rem;
  }

  .search-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1.5rem;
  }

  /* Laptop */
  @media (max-width: 1200px) {
    .search-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  /* Tablet */
  @media (max-width: 900px) {
    .search-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  /* Mobile */
  @media (max-width: 600px) {
    padding: 6rem 1rem 2rem;

    .search-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
  }

  /* Small mobile */
  @media (max-width: 400px) {
    .search-grid {
      grid-template-columns: 1fr;
    }
  }
`;