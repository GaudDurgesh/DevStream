import React from "react";
import { useDispatch } from "react-redux";
import { fetchDataByGenre } from "../store";
import styled from "styled-components";

export default function SelectGenre({ genres, type, selectedGenre, onGenreChange }) {
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const genreId = e.target.value;
    onGenreChange(genreId);
    dispatch(fetchDataByGenre({ genre: genreId, type }));
  };

  return (
    <Select value={selectedGenre || ""} onChange={handleChange}>
      {genres.map((genre) => (
        <option key={genre.id} value={genre.id}>
          {genre.name}
        </option>
      ))}
    </Select>
  );
}

const Select = styled.select`
  margin-left: 5rem;
  cursor: pointer;
  font-size: 0.95rem;        /* ✅ smaller than before (was 1.4rem) */
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 4px;
  padding: 0.25rem 0.4rem;
  max-width: calc(100% - 10rem);

  option {
    background-color: black;
    color: white;
  }

  @media (max-width: 1024px) {
    margin-left: 3rem;
    font-size: 0.9rem;
    max-width: calc(100% - 6rem);
  }

  @media (max-width: 768px) {
    margin-left: 1.5rem;
    font-size: 0.85rem;
    max-width: calc(100% - 3rem);
    padding: 0.2rem 0.35rem;
  }

  @media (max-width: 480px) {
    margin-left: 1rem;
    font-size: 0.8rem;
    width: calc(100% - 2rem);   /* full width on phones */
    max-width: calc(100% - 2rem);
    padding: 0.2rem 0.3rem;
  }
`;