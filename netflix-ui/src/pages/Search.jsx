

import React from "react";
import { useLocation } from "react-router-dom";

export default function Search() {
  const location = useLocation();
  const results = location.state?.results || [];

  return (
    <div>
      <h2>Search Results</h2>

      {results.length === 0 ? (
        <p>No results found</p>
      ) : (
        results.map((movie) => (
          <div key={movie.id}>
            <h3>{movie.title}</h3>
          </div>
        ))
      )}
    </div>
  );
}