import type { FC } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useUser, useStackApp } from '@stackframe/react';
import './Navbar.css';

const Navbar: FC = () => {
  const user = useUser();
  const app = useStackApp();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Stock Info
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="navbar-collapse" id="mainNavbar">
          <ul className="navbar-menu">
            <li className="navbar-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
              >
                Home
              </NavLink>
            </li>
            {user && (
              <li className="navbar-item">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
                >
                  Dashboard
                </NavLink>
              </li>
            )}
          </ul>

          <div className="navbar-actions">
            {user ? (
              <>
                <span className="navbar-user">
                  Welcome, {user.displayName || user.primaryEmail}
                </span>
                <button
                  onClick={() => user.signOut()}
                  className="navbar-button navbar-button-outline"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => app.redirectToSignIn()}
                  className="navbar-button navbar-button-link"
                >
                  Login
                </button>
                <button
                  onClick={() => app.redirectToSignUp()}
                  className="navbar-button"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
