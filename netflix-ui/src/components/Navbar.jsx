import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { FaPowerOff, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { firebaseAuth } from "../utils/firebase-config";
import { signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

export default function Navbar({ isScrolled, setSearchQuery }) {
  const links = [
    { name: "Home", link: "/" },
    { name: "TV Shows", link: "/tv" },
    { name: "Movies", link: "/movies" },
    { name: "My List", link: "/mylist" },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (!currentUser) navigate("/login");
    });
    return unsub;
  }, []);

  const [showSearch, setShowSearch] = useState(false);
  const [inputHover, setInputHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (showSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearch]);

  // ✅ Fixed: use mousedown instead of click, and check menuRef properly
  useEffect(() => {
    if (!menuOpen) return;
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    // ✅ Use mousedown/touchstart so it doesn't conflict with the toggle button tap
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [menuOpen]);

  return (
    // ✅ attach menuRef to the nav so outside-click works correctly
    <Container ref={menuRef}>
      <nav className={`flex ${isScrolled ? "scrolled" : ""}`}>
        {/* LEFT */}
        <div className="left flex a-center">
          <div className="brand flex a-center j-center">
            <Link to="/" className="logo-link">
              <span className="logo-text">
                <span className="logo-dev">DEV</span>
                <span className="logo-stream">STREAM</span>
              </span>
            </Link>
          </div>
          <ul className="links flex">
            {links.map(({ name, link }) => (
              <li key={name}>
                <Link to={link}>{name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT */}
        <div className="right flex a-center">
          <div className={`search ${showSearch ? "show-search" : ""}`}>
            <button
              onFocus={() => setShowSearch(true)}
              onBlur={() => {
                if (!inputHover) setShowSearch(false);
              }}
            >
              <FaSearch />
            </button>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search Movies & TV Shows"
              onMouseEnter={() => setInputHover(true)}
              onMouseLeave={() => setInputHover(false)}
              onBlur={() => {
                setShowSearch(false);
                setInputHover(false);
              }}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="logout-btn" onClick={() => signOut(firebaseAuth)}>
            <FaPowerOff />
          </button>

          <button
            className="hamburger"
            // ✅ Use onPointerDown instead of onClick — fires before outside-click listener
            onPointerDown={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile menu */}
        <ul className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          {links.map(({ name, link }) => (
            <li key={name}>
              <Link to={link} onClick={() => setMenuOpen(false)}>
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  );
}

const Container = styled.div`
  nav {
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.85) 0%,
      rgba(0, 0, 0, 0.4) 60%,
      transparent 100%
    );
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 100;
    padding: 0 4rem;
    height: 6.5rem;
    justify-content: space-between;
    align-items: center;
    transition: background 0.3s ease-in-out;
    flex-wrap: wrap;
    align-content: flex-start;

    &.scrolled {
      background: black;
    }

    .left {
      gap: 2rem;

      .brand .logo-link {
        text-decoration: none;
      }

      .logo-text {
        display: inline-flex;
        align-items: baseline;
        font-family: "Arial Black", "Arial Bold", Gadget, sans-serif;
        font-size: clamp(1rem, 3vw, 1.75rem);
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
        color: #e50914;
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

      .links {
        list-style-type: none;
        gap: 2rem;

        li a {
          color: white;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 400;
          transition: color 0.2s;
          &:hover {
            color: #b3b3b3;
          }
        }
      }
    }

    .right {
      gap: 1rem;

      .logout-btn {
        background-color: transparent;
        border: none;
        cursor: pointer;
        &:focus { outline: none; }
        svg {
          color: #f34242;
          font-size: 1.2rem;
        }
      }

      .search {
        display: flex;
        gap: 0.4rem;
        align-items: center;
        justify-content: center;
        padding: 0.2rem 0.5rem;

        button {
          background-color: transparent;
          border: none;
          cursor: pointer;
          &:focus { outline: none; }
          svg {
            color: white;
            font-size: 1.2rem;
          }
        }

        input {
          width: 0;
          opacity: 0;
          visibility: hidden;
          transition: 0.3s ease-in-out;
          background-color: transparent;
          border: none;
          color: white;
          &:focus { outline: none; }
        }
      }

      .show-search {
        border: 1px solid white;
        background-color: rgba(0, 0, 0, 0.6);
        input {
          width: 180px;
          opacity: 1;
          visibility: visible;
          padding: 0.3rem;
        }
      }

      /* ✅ Hidden on desktop */
      .hamburger {
        display: none;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0.5rem;        /* ✅ larger tap target */
        margin: -0.5rem;        /* ✅ offset padding so layout stays same */
        &:focus { outline: none; }
        svg {
          color: white;
          font-size: 1.4rem;
          display: block;
        }
      }
    }

    .mobile-menu {
      list-style: none;
      width: 100%;
      margin: 0;
      padding: 0;
      max-height: 0;
      overflow: hidden;
      background: rgba(0, 0, 0, 0.95);
      flex-direction: column;
      transition: max-height 0.3s ease;

      li a {
        display: block;
        color: white;
        text-decoration: none;
        font-size: 1rem;
        padding: 0.75rem 1.5rem;
        transition: background 0.2s;
        &:hover {
          background: rgba(255, 255, 255, 0.08);
        }
      }

      &.open {
        max-height: 300px;
      }
    }

    @media (max-width: 768px) {
      padding: 0 2rem;
      height: 5rem;

      .left .links {
        display: none;
      }

      .right .hamburger {
        display: block;   /* ✅ show on tablet/mobile */
      }
    }

    @media (max-width: 480px) {
      padding: 0 1.2rem;
      height: 4.5rem;

      .right {
        gap: 0.6rem;
      }

      .right .show-search input {
        width: 120px;
      }
    }
  }
`;