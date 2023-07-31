import React from "react";
import { Link } from "react-router-dom";
import { getTokenCookie } from "../Context/Cookies";

const Home = () => {
  const user = getTokenCookie();
  return (
    <div className="home-container">
      <header className="header">
        <h1>Kratin healthcare</h1>
      </header>
      <main className="main-content">
        <p>Welcome to our modern healthcare.</p>
        <p>We are here to take care of your health needs.</p>
        <div className="cta-buttons">
          {!user && (
            <>
              <Link title="Login" to="/login" className="cta-button">
                Login
              </Link>
              <Link title="Signup" to="/signup" className="cta-button">
                Signup
              </Link>
            </>
          )}
          {user && (
            <>
              <Link to="/profile-update" className="cta-button">
                Update details
              </Link>
              <Link to="/add-medicin" className="cta-button">
                Add Medicins
              </Link>
              <Link to="/medicin-lists" className="cta-button">
                Show Medicins
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
