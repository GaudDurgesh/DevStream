import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function Header(props) {
  const navigate = useNavigate();
  return (
    <Container className="flex a-center j-between">
      <div className="logo">
        <span className="logo-text">
          <span className="logo-dev">DEV</span>
          <span className="logo-stream">STREAM</span>
        </span>
      </div>
      <button
        className="btn"
        onClick={() => navigate(props.login ? "/login" : "/signup")}
      >
        {props.login ? "Log In" : "Sign In"}
      </button>
    </Container>
  );
}

const Container = styled.div`
  padding: 0 4rem;

  /* Tablet */
  @media (max-width: 768px) {
    padding: 0 2rem;
  }

  /* Mobile */
  @media (max-width: 480px) {
    padding: 0 1.2rem;
  }

  .logo {
    .logo-text {
      display: inline-flex;
      align-items: baseline;
      font-family: 'Arial Black', 'Arial Bold', Gadget, sans-serif;
      font-size: clamp(1rem, 4vw, 1.75rem);
      font-weight: 900;
      letter-spacing: -0.04em;
      line-height: 1;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6));
      user-select: none;
    }

    .logo-dev {
      color: #e50914;
      font-style: italic;
      letter-spacing: -0.02em;
    }

    .logo-stream {
      font-style: italic;
      font-weight: 900;
      background: linear-gradient(
        to bottom,
        #ff1e1e 0%,
        #e50914 40%,
        #b00710 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  .btn {
    background-color: #e50914;
    border: none;
    padding: 0.5rem 1.2rem;
    border-radius: 4px;
    color: white;
    font-weight: 600;
    font-size: clamp(0.75rem, 2vw, 0.95rem);
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.2s ease;

    &:hover {
      background-color: #f40612;
    }

    /* Tablet */
    @media (max-width: 768px) {
      padding: 0.45rem 1rem;
    }

    /* Mobile */
    @media (max-width: 480px) {
      padding: 0.4rem 0.8rem;
    }
  }
`;