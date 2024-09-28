import React from "react";

const TopOne = ({ topInstructors }) => {
  return (
    <div className="w-[180px] h-[450px] flex flex-col items-center text-center justify-end ">
      <img
        className="object-cover object-center h-[100px] w-[100px] rounded-full border-2 border-solid border-[#320000] bg-[#320000]"
        src={topInstructors[0].ins.photoURL}
        alt="profile"
      />
      <p className="w-full font-medium ">{topInstructors[0].ins.firstName}</p>
      <div className="bar h-[300px] text-[#320000] w-full bg-[#36d9d98f] rounded-t-3xl flex flex-col justify-end pb-2 items-center">
        <p className="font-semibold">1st</p>
        <p className="bg-[#eaeaea] px-3 py-1 rounded-3xl border-2 border-solid border-[#c1c1c1] w-[70%] font-medium">   {topInstructors[0].avgRating} <span className="text-sm font-light">Rating</span></p>
      </div>
    </div>
  );
};

const TopTWo = ({ topInstructors }) => {
  return (
    <div className="w-[180px] h-[450px] flex flex-col items-center text-center justify-end">
      <img
        className="object-cover object-center h-[100px] w-[100px] rounded-full border-2 border-solid border-[#320000] bg-[#320000]"
        src={topInstructors[1].ins.photoURL}
        alt="profile"
      />
      <p className="w-full font-medium ">{topInstructors[1].ins.firstName}</p>
      <div className="bar h-[235px] text-[#320000] w-full bg-[#ff3c0053] rounded-t-3xl flex flex-col justify-end pb-2 items-center">
        <p className="font-semibold">2nd</p>
        <p className="bg-[#eaeaea] px-3 py-1 rounded-3xl border-2 border-solid border-[#c1c1c1] w-[70%] font-medium" >  {topInstructors[1].avgRating} <span className="text-sm font-light">Rating</span></p>
      </div>
    </div>
  );
};

const TopThree = ({ topInstructors }) => {
  return (
    <div className="w-[180px] h-[450px] flex flex-col items-center text-center justify-end ">
      <img
        className="object-cover object-center h-[100px] w-[100px] rounded-full border-2 border-solid border-[#320000] bg-[#320000]"
        src={topInstructors[2].ins.photoURL}
        alt="profile"
      />
      <p className="w-full font-medium ">{topInstructors[2].ins.firstName}</p>
      <div className="bar h-[175px] text-[#320000] w-full bg-[#ffc1076c] rounded-t-3xl flex flex-col justify-end pb-2 items-center">
        <p className="font-semibold">3rd</p>
        <p className="bg-[#eaeaea] px-3 py-1 rounded-3xl border-2 border-solid border-[#c1c1c1] w-[70%] font-medium">   {topInstructors[2].avgRating} <span className="text-sm font-light">Rating</span></p>
      </div>
    </div>
  );
};

const TopInstructors = ({ topInstructors }) => {
  return (
    <div className="w-full flex flex-row  justify-center gap-1 text-[#320000] border-2 border-solid border-[#c5c5c5] rounded-lg p-3">
      <TopTWo topInstructors={topInstructors} />
      <TopOne topInstructors={topInstructors} />
      <TopThree topInstructors={topInstructors} />
    </div>
  );
};

export default TopInstructors;