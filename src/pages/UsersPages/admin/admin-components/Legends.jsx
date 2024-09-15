import React, { useRef, useState, useEffect } from "react";
import { ChromePicker } from "react-color";
import { useDB } from "../../../../context/db/DBContext";
import toast from "react-hot-toast";

const Legends = ({ teacher }) => {
  const db = useDB();
  const toastMessage = (message) => toast(message);
  const [instructorColorCode, setInstructorColorCode] = useState(
    teacher.instructorColorCode || "gray"
  );
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const colorPickerRef = useRef(null);
  const pickerButtonRef = useRef(null);

  const handleEditInstructorColor = (e) => {
    e.stopPropagation();
    setIsColorPickerOpen(!isColorPickerOpen);
  };

  const confirmColor = async () => {
    if (instructorColorCode && teacher.userID) {
      try {
        await db.editInstructorColorCode(teacher.userID, instructorColorCode);
        toastMessage("Color code changed successfully");
        setIsColorPickerOpen(false);
      } catch (error) {
        toastMessage("Error in editing instructor color: " + error.message);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target) &&
        !pickerButtonRef.current.contains(event.target)
      ) {
        setIsColorPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="instructors-legend w-full flex flex-row flex-wrap gap-6">
      <div className="color-picker-container w-full">
        {isColorPickerOpen && (
          <div
            className="color-picker-ref absolute bottom-0 w-fit z-50"
            ref={colorPickerRef}
            onClick={(e) => e.stopPropagation()}
          >
            <ChromePicker
              color={instructorColorCode}
              onChange={(newColor) => setInstructorColorCode(newColor.hex)}
            />
            <button
              className="w-full rounded-md bg-[#720000] text-white py-2 mt-2 hover:bg-[#2b9f4a]"
              onClick={confirmColor}
            >
              Change Color Code
            </button>
          </div>
        )}
      </div>
      <div
        ref={pickerButtonRef}
        onClick={handleEditInstructorColor}
        className="teacher-legend flex flex-row items-center gap-2 w-[100px] cursor-pointer"
      >
        <p className="m-0">{teacher.lastName}</p>
        <div
          style={{
            backgroundColor: instructorColorCode,
          }}
          className="instructorColorCode p-3 rounded-md"
        ></div>
      </div>
    </div>
  );
};

export default Legends;