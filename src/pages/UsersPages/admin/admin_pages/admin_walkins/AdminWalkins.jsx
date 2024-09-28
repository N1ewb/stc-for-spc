import React, { useEffect, useState } from "react";
import WalkinForm from "../../admin-components/walkins/WalkinForm";
import WalkinApptList from "../../admin-components/walkins/WalkinApptList";
import WalkinInfo from "../../admin-components/walkins/WalkinInfo";

const AdminWalkins = () => {
  const [currentWalkin, setCurrentWalkin] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleOpenForm = () => {
    setIsFormOpen(!isFormOpen);
    setCurrentWalkin(null);
  };

  useEffect(() => {
    if (currentWalkin) {
      setIsFormOpen(false);
    }
  }, [currentWalkin]);

  return (
    <div className="walkins-container w-full h-full flex flex-col overflow-hidden">

      <button
        onClick={handleOpenForm}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 w-40 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
      >
        {isFormOpen ? "Close Form" : "Open Form"}
      </button>

      <div className="walkins-content w-full flex flex-row pb-10">
        <div
          className={`transition-all duration-500 ease-in-out pb-5 px-2 ${
            isFormOpen ? "w-1/2" : "w-0"
          } overflow-hidden`}
        >
          {isFormOpen && <WalkinForm setIsFormOpen={setIsFormOpen} />}
        </div>

        <div
          className={`transition-all duration-500 ease-in-out ${
            isFormOpen || currentWalkin ? "w-1/2" : "w-full"
          }`}
        >
          <WalkinApptList setCurrentWalkin={setCurrentWalkin} currentWalkin={currentWalkin} />
        </div>

        <div
          className={`transition-transform duration-500 ease-in-out pb-5 px-2 ${
            currentWalkin && !isFormOpen ? "w-1/2 mx-3 translate-x-0"  : "w-0 translate-x-[100%]"
          } overflow-hidden`}
        >
          {currentWalkin && !isFormOpen && (
            <WalkinInfo
              currentWalkin={currentWalkin}
              setCurrentWalkin={setCurrentWalkin}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminWalkins;
