import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./admin_appointments.css";
import { useDB } from "../../../../../context/db/DBContext";
import { useAuth } from "../../../../../context/auth/AuthContext";
import AppointmentList from "../../../../../components/appointments/AppointmentsList";
import { useChat } from "../../../../../context/chatContext/ChatContext";

import AppointmentInfo from "../../../../../components/appointments/AppointmentInfo";
import { useAppointment } from "../../../../../context/appointmentContext/AppointmentContext";

const AdminAppointmentPage = () => {
  const db = useDB();
  const auth = useAuth();
  const chat = useChat();
  const { currentAppointment, setCurrentAppointment } = useAppointment();
  const [appointments, setAppointments] = useState();

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        try {
          const unsubscribe = db.subscribeToAppointmentChanges((callback) => {
            setAppointments(callback);
          });
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
    <div className="admin-appointments-container">
      <div className="appoinments-container">
        <div className="accepted-appointments-container">
          <h3>Appointments List</h3>
          {appointments && appointments.length ? (
            appointments.map((appointment, index) =>
              appointment.appointmentStatus === "Accepted" ? (
                <AppointmentList
                  key={index}
                  appointment={appointment}
                  setCurrentChatReceiver={chat.setCurrentChatReceiver}
                />
              ) : null
            )
          ) : (
            <p>No accepted appointments yet</p>
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
              handleAcceptAppointment={() => null}
              handleDenyAppointment={() => null}
            />
          )}
        </div>

        {/* <div className="ongoing-requests-container">
          <h3>Ongoing Appointment Request</h3>
          {appointments && appointments.length ? (
            appointments.map((appointment) =>
              appointment.appointmentStatus === "pending" ? (
                <div key={appointment.id} className="ongoing-requests">
                  <p>{appointment.appointee.name}</p>
                  <p>{appointment.appointmentStatus}</p>
                  <button
                    onClick={() =>
                      handleAcceptAppointment(
                        appointment.id,
                        appointment.appointee.email,
                        appointment.appointmentDate
                      )
                    }
                  >
                    Accept
                  </button>
                  <button onClick={() => handleDenyAppointment(appointment.id)}>
                    Deny
                  </button>
                </div>
              ) : null
            )
          ) : (
            <p>No appointment requests yet</p>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default AdminAppointmentPage;