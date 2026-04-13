

import React from "react";

export default function NotAvailable({ type }) {
  return (
    <h1 className="not-available">
      {type === "tv" ? "TV Show" : "Movie"} Not Available
    </h1>
  );
}
