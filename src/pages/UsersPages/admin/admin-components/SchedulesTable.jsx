import React, { useCallback, useEffect, useRef, useState } from "react";
import SchedulesModal from "../../../../components/modal/schedules-modal/SchedulesModal";
import { useDB } from "../../../../context/db/DBContext";
import { Tooltip } from "react-bootstrap";
import Loading from "../../../../components/Loading/Loading";
import { times } from "../../../../lib/global";
import SetTD from "../../../../lib/utility/setTd";

const SchedulesTable = ({
  show,
  schedules,
  toggleShow,
  teachersList,
  toastMessage,
  setSchedules,
  choosenCells,
  setChoosenCells,
  isEditMode,
  setIsEditMode,
}) => {
  const db = useDB();
  const [scheduleData, setScheduleData] = useState({});
  const deletedCells = useRef(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);

 

  const handleDeleteSchedulesDoc = useCallback(
    async (value, day) => {
      try {
        setError(false);
        await db.deleteSchedule(value.timeslot.id, day.id);
        const key = `${value.timeslot.time.startTime}-${value.timeslot.time.endTime}-${day.dayOfWeek}`;
        deletedCells.current.add(key);
        setScheduleData((prevData) => {
          const newData = { ...prevData };
          delete newData[key];
          return newData;
        });
        toastMessage("Deleted Successfully");
      } catch (error) {
        setError(true);
        toastMessage("Error in deleting schedule ...");
      }
    },
    [db, toastMessage]
  );

  useEffect(() => {
    const handleGetDays = async () => {
      try {
        const dayOfWeek = await db.getDays();
        setSchedules(dayOfWeek);
      } catch (error) {
        toastMessage(error.message);
      }
    };
    handleGetDays();
  }, []);

  // const handleGetTimeSlots = async (day) => {
  //   try {
  //     const timeSlot = await db.getTimeslotsForDay(day);
  //   } catch (error) {
  //     toastMessage("Error in retreivng timeslots", error.message);
  //   }
  // };

  const handleCellClick = (time, day) => {
    if (isEditMode) {
      const cellData = { time, day: day.dayOfWeek, fullDay: day };
      const JsonFormat = JSON.stringify(cellData);
      setChoosenCells((prev) =>
        prev.includes(JsonFormat)
          ? prev.filter((cell) => cell !== JsonFormat)
          : [...prev, JsonFormat]
      );
    }
  };

  const setTd = (value) => {
    try {
      const {choosedCells, editMode, notifSent} = SetTD(value, scheduleData, choosenCells, db)
      db.setNotifSent(notifSent)
      setChoosenCells(choosedCells)
      setIsEditMode(editMode)
    } catch (error) {
      toastMessage("Error in setting table data", error.message);
    }
  };

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        const unsubscribeSchedules = db.subscribeToSchedulesChanges(
          async (schedules) => {
            const unsubscribeTimeslotCallbacks = [];
            const newScheduleData = {};

            schedules.forEach((schedule) => {
              const unsubscribeTimeslot = db.subscribeToTimeslotChanges(
                (timeslots) => {
                  timeslots.forEach((timeslot) => {
                    const key = `${timeslot.time.startTime}-${timeslot.time.endTime}-${schedule.dayOfWeek}`;

                    if (!deletedCells.current.has(key)) {
                      const foundInstructor = teachersList.find(
                        (instructor) =>
                          instructor.userID ===
                          timeslot.assignedInstructor.userID
                      );
                     
                      newScheduleData[key] = { foundInstructor, timeslot };
                    }
                  });

                  setScheduleData((prevData) => {
                    const updatedData = { ...prevData, ...newScheduleData };

                    deletedCells.current.forEach((key) => {
                      delete updatedData[key];
                    });
                    return updatedData;
                  });
                },
                schedule
              );

              unsubscribeTimeslotCallbacks.push(unsubscribeTimeslot);
            });

            return () => {
              unsubscribeSchedules();
              unsubscribeTimeslotCallbacks.forEach((unsubscribe) =>
                unsubscribe()
              );
            };
          }
        );
      } catch (error) {
        toastMessage("Error fetching schedules: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [db, teachersList, toastMessage]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="schedules-table basis-[80%]  md:basis-[90%]  flex flex-col items-center justify-between shadow-md gap-3 p-10 rounded-[30px]">
      <table className=" min-w-[50%] border-collapse  text-center">
        <thead>
          <tr className="  [&_th]:border-transparent [&_th]:font-bold [&_th]:text-[#720000] [&_th]:p-[8px] [&_th]:w-[100px] xsm:w-[80px]">
            <th className="xsm:text-[14px] ">Time/Days</th>
            {schedules && schedules.length !== 0
              ? schedules.map((day) => (
                  <th className="xsm:text-[13px]" key={day.id}>
                    <span className="block md:hidden ">{day.dayOfWeek}</span>
                    <span className="hidden md:block">{day.shortVer}</span>
                  </th>
                ))
              : ""}
          </tr>
        </thead>
        <tbody>
          {times.map((time) => (
            <tr key={`${time.startTime}-${time.endTime}`}>
              <td className="h-[30px] xsm:text-[14px] ">
                {`${time.startTime}:00 - ${time.endTime}:00`}
              </td>
              {schedules && schedules.length !== 0
                ? schedules.map((day) => {
                    const cellKey = `${time.startTime}-${time.endTime}-${day.dayOfWeek}`;
                    const cellValue = scheduleData[cellKey];
                    const isCellClickable = !cellValue;
                    return (
                      <td
                        style={{
                          backgroundColor:
                            cellValue?.foundInstructor?.instructorColorCode ||
                            "",
                        }}
                        key={cellKey}
                        onClick={
                          isCellClickable
                            ? () => handleCellClick(time, day)
                            : undefined
                        }
                        className={`border-solid border-[1px] border-[#e4e4e4] ${
                          isEditMode &&
                          choosenCells.some((cell) => {
                            const parsedCell = JSON.parse(cell);
                            return (
                              parsedCell.time.startTime === time.startTime &&
                              parsedCell.time.endTime === time.endTime &&
                              parsedCell.day === day.dayOfWeek
                            );
                          })
                            ? `bg-[#571010]`
                            : isEditMode
                            ? "bg-[#fca4a4] cursor-pointer hover:bg-[#5f1b24]"
                            : ""
                        } ${
                          cellValue && isEditMode ? "cursor-not-allowed " : ""
                        }`}
                      >
                        {cellValue && isEditMode ? (
                          <div className="flex flex-row w-full justify-between">
                            <div className="spacer"></div>
                            <button
                              className="x-button p-1 bg-transparent hover:bg-transparent "
                              onClick={() =>
                                handleDeleteSchedulesDoc(cellValue, day)
                              }
                            >
                              X
                            </button>
                          </div>
                        ) : (
                          ""
                        )}
                      </td>
                    );
                  })
                : ""}
            </tr>
          ))}
        </tbody>
      </table>
      {show && (
        <SchedulesModal
          toggleShow={toggleShow}
          show={show}
          teachersList={teachersList}
          toastMessage={toastMessage}
          setTd={setTd}
        />
      )}
      <Tooltip data-anchorselect=".x-button" place="top">
        Delete cell
      </Tooltip>
    </div>
  );
};

export default SchedulesTable;
