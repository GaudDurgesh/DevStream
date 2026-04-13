import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import BackgroundImage from "../components/BackgroundImage";
import Header from "../components/Header";
import { firebaseAuth } from "../utils/firebase-config";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    try {
      const { email, password } = formValues;
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) navigate("/");
    });
    return unsub;
  }, []);

  return (
    <Container>
      <BackgroundImage />
      <div className="content">
        <Header login />
        <div className="body flex column a-center j-center">
          <div className="text flex column">
            <h1>Unlimited Movies, TV shows and more.</h1>
            <h4>Watch anywhere. Cancel anytime.</h4>
            <h6>
              Ready to watch? Enter your email to create or restart membership.
            </h6>
          </div>

          <div className="form">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={formValues.email}
              onChange={(e) =>
                setFormValues({ ...formValues, [e.target.name]: e.target.value })
              }
            />

            {showPassword && (
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formValues.password}
                onChange={(e) =>
                  setFormValues({ ...formValues, [e.target.name]: e.target.value })
                }
              />
            )}

            {!showPassword ? (
              <button className="btn" onClick={() => setShowPassword(true)}>
                Get Started
              </button>
            ) : (
              <button className="btn signup-btn" onClick={handleSignIn}>
                Sign Up
              </button>
            )}
          </div>

          {error && <p className="error-msg">{error}</p>}
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  position: relative;

  .content {
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    height: 100vh;
    width: 100vw;
    display: grid;
    grid-template-rows: 15vh 85vh;

    .body {
      gap: 1.2rem;
      padding: 0 1rem;

      .text {
        gap: 0.6rem;
        text-align: center;
        color: white;

        h1 {
          font-size: clamp(1.2rem, 4vw, 2rem);
          padding: 0 1rem;
          margin: 0;
        }
        h4 {
          font-size: clamp(0.9rem, 2.5vw, 1.2rem);
          margin: 0;
          font-weight: 400;
        }
        h6 {
          font-size: clamp(0.75rem, 2vw, 1rem);
          margin: 0;
          font-weight: 400;
          color: #ccc;
        }
      }

      .form {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.8rem;
        width: 100%;
        max-width: 480px;

        input {
          width: 100%;
          color: black;
          background: white;
          border: 1px solid #ccc;
          padding: 0.9rem 1rem;
          font-size: 1rem;
          border-radius: 4px;
          box-sizing: border-box;

          &:focus {
            outline: none;
            border-color: #999;
          }
        }

        .btn {
          width: 100%;
          padding: 0.8rem 1rem;
          background-color: #e50914;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;

          &:hover {
            background-color: #f40612;
          }
        }
      }

      .error-msg {
        color: #ff4444;
        font-size: 0.85rem;
        text-align: center;
        max-width: 480px;
        margin: 0;
      }
    }
  }

  /* Tablet */
  @media (min-width: 600px) {
    .content .body .form {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;

      input {
        flex: 1 1 200px;
        max-width: 280px;
      }

      .btn {
        flex: 0 0 auto;
        width: auto;
        padding: 0.9rem 1.8rem;
        font-size: 1rem;
      }
    }
  }

  /* Desktop */
  @media (min-width: 900px) {
    .content .body .form {
      flex-direction: row;
      flex-wrap: nowrap;
      max-width: 700px;

      input {
        flex: 1;
        max-width: unset;
      }

      .btn {
        width: auto;
        white-space: nowrap;
        padding: 0.9rem 2rem;
      }
    }
  }
`;