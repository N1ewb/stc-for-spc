import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";
import { useDB } from "../../context/db/DBContext";
import Profile from "../userProfile/Profile";
import "./Navbar.css";

const Navbar = () => {
  const auth = useAuth();
  const db = useDB();
  const [user, setUser] = useState(null);

  const handleGetUser = async () => {
    if (auth.currentUser) {
      const user = await db.getUser(auth.currentUser.uid);
      setUser(user);
    }
  };

  useEffect(() => {
    if (user === null || user === undefined) {
      handleGetUser();
    }
  });

  return (
    <div className="navbar-container">
      <div className="logo-wrapper">
        <h2>Student Counsel</h2>
      </div>
      <div className="nav-links">
        {auth.currentUser && (
          <Link to="/Dashboard">
            <p>Dashboard</p>
          </Link>
        )}

        {!auth.currentUser ? (
          <>
            <Link to="/Login">
              <p>Login</p>
            </Link>
            <Link to="/StudentRegister">
              <p>Register</p>
            </Link>
          </>
        ) : (
          <>
            <img src={auth.currentUser && auth.currentUser.photoUrl} />
            <Profile />
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
