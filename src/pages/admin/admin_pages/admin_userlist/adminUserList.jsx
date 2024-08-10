import React, { useEffect, useState } from "react";

import defaultProfile from "../../../../static/images/default-profile.png";

import "./adminUserList.css";

const AdminUserList = ({ db, auth }) => {
  const [userList, setUserList] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleGetAllUsers = async () => {
    try {
      const users = await db.getAllUsers();
      setUserList(users);
    } catch (error) {
      setError("Something went wrong while collecting users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userList === undefined) {
      handleGetAllUsers();
    }
  });

  if (loading) {
    return <div className="loading-screen">Loading User...</div>;
  }

  if (error) {
    return <div className="error-screen">{error}</div>;
  }

  return (
    <div className="admin-userlist-container">
      <h1>User List</h1>
      {userList && userList.length !== 0 ? (
        userList.map((users, index) => (
          <div className="userlist-container" key={index}>
            <img
              src={
                (auth.currentUser && auth.currentUser.photoUrl) ||
                defaultProfile
              }
              alt="default profile"
              height={25}
            />
            <p>{users.firstName}</p>
            <p>{users.lastName}</p>
            <p>{users.email}</p>
            <p>{users.role}</p>
            <p>{users.phoneNumber}</p>
            <div className="onlineStatus"></div>
            <div className="more-options"></div>
          </div>
        ))
      ) : (
        <p>No users</p>
      )}
    </div>
  );
};

export default AdminUserList;
