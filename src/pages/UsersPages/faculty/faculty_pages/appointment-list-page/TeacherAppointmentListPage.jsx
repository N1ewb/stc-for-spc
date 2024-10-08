import React, { useEffect, useState } from "react";

import "./TeacherAppointmentListPage.css";
import AppointmentsList from "../../../../../components/appointments/AppointmentsList";
import AppointmentInfo from "../../../../../components/appointments/AppointmentInfo";
import { useDB } from "../../../../../context/db/DBContext";
import { useAuth } from "../../../../../context/auth/AuthContext";
import { useChat } from "../../../../../context/chatContext/ChatContext";
import { useAppointment } from "../../../../../context/appointmentContext/AppointmentContext";

const TeacherAppointmentListPage = () => {
  const db = useDB();
  const auth = useAuth();
  const chat = useChat();
  const { currentAppointment, setCurrentAppointment } = useAppointment();
  const [acceptedAppointments, setAcceptedAppointments] = useState();

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        try {
          const unsubscribe = db.subscribeToAppointmentChanges(
            "Accepted",
            (callback) => {
              setAcceptedAppointments(callback);
            }
          );
          return () => unsubscribe();
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [db]);

  useEffect(() => {
    setCurrentAppointment(null);
  }, []);

  return (
    <div className="teacher-appointment-page-list-container w-full flex flex-col">
      <h1 className="text-[#320000]">
        <span className="font-bold">Accepted</span>
        <br></br>
        Appoinments
      </h1>
      <div className="appointment-list-main-content w-full flex flex-row justify-between">
        <div className="appointment-list-container w-[40%] flex flex-col gap-3">
          {acceptedAppointments && acceptedAppointments.length !== 0 ? (
            acceptedAppointments.map((appointment, index) => (
              <AppointmentsList
                key={index}
                appointment={appointment}
                setCurrentChatReceiver={chat.setCurrentChatReceiver}
              />
            ))
          ) : (
            <p className="font-bold text-[#320000]">No Appointments</p>
          )}
        </div>

        <div
          className={`w-[50%] bg-white shadow-md rounded-[30px] p-10 transition-all ease-in-out duration-300 ${
            currentAppointment
              ? "opacity-100 h-auto translate-y-0"
              : "opacity-0 h-0 -translate-y-10"
          }`}
        >
          {currentAppointment && (
            <AppointmentInfo
              appointment={currentAppointment}
              handleAcceptAppointment={() => null}
              handleDenyAppointment={() => null}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherAppointmentListPage;
