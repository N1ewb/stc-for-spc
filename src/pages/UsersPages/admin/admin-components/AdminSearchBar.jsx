import React, { useEffect, useState } from "react";

const AdminSearchBar = ({ datas, setData, temp, setCurrentPage }) => {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (searchQuery) {
      if (datas) {
        const foundData = datas.filter((data) => {
          const { name, email, studentIDnumber } = data.appointee || data || {};
          return (
            (name && name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (email &&
              email.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (studentIDnumber && studentIDnumber.includes(searchQuery))
          );
        });
        setData(foundData);
        setCurrentPage(1);
      }
    } else {
      setData(temp);
    }
  }, [searchQuery]);

  return (
    <div className="admin-schedule-header-searchbar">
      <input
        name="search-appointments"
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default AdminSearchBar;
