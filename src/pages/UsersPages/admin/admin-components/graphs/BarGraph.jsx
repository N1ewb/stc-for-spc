import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const BarGraph = ({ apptList }) => {
  const [sortedApptList, setSortedApptList] = useState([]);
  const [category, setCategory] = useState("week"); // 'week', 'month', 'semester'

  useEffect(() => {
    const fetchData = () => {
      const now = new Date();

      if (category === "week") {
        // This Week (By Day)
        const last7Days = [];

        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(now.getDate() - i);
          last7Days.push(date.toISOString().split("T")[0]);
        }

        const apptCounts = last7Days.map((day) => ({
          date: day,
          count: 0,
        }));

        apptList.forEach((appt) => {
          const apptDate = appt.appointmentDate;
          const foundDay = apptCounts.find((day) => day.date === apptDate);
          if (foundDay) {
            foundDay.count++;
          }
        });

        setSortedApptList(apptCounts);

      } else if (category === "month") {
        // This Month (By Week)
        const weeks = Array.from({ length: 4 }, (_, i) => ({
          week: `Week ${i + 1}`,
          count: 0,
        }));

        apptList.forEach((appt) => {
          const apptDate = new Date(appt.appointmentDate);
          const weekNum = Math.ceil(apptDate.getDate() / 7) - 1;
          if (weeks[weekNum]) weeks[weekNum].count++;
        });

        setSortedApptList(weeks);

      } else if (category === "semester") {
        // This Semester (By Month - 6 months)
        const months = Array.from({ length: 6 }, (_, i) => {
          const month = new Date();
          month.setMonth(now.getMonth() - (5 - i));
          return {
            month: month.toLocaleString("default", { month: "long" }),
            count: 0,
          };
        });

        apptList.forEach((appt) => {
          const apptDate = new Date(appt.appointmentDate);
          const monthName = apptDate.toLocaleString("default", { month: "long" });
          const foundMonth = months.find((m) => m.month === monthName);
          if (foundMonth) foundMonth.count++;
        });

        setSortedApptList(months);
      }
    };

    fetchData();
  }, [apptList, category]);

  const data = {
    labels:
      category === "week"
        ? sortedApptList.map((day) => day.date)
        : category === "month"
        ? sortedApptList.map((week) => week.week)
        : sortedApptList.map((month) => month.month),
    datasets: [
      {
        label: "# of Appointments",
        data: sortedApptList.map((item) => item.count),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="w-full text-[#320000]">
      <h3 className=" font-bold">Appointment <span className="font-light">Statistics</span></h3>
     <div className="flex flex-row justify-between">
      <p >This {category}</p>
     <div className="[&_button]:bg-transparent [&_button]:hover:bg-transparent [&_button]:text-[#320000] flex flex-row gap-3 [&_button]:transition-all [&_button]:ease-out [&_button]:duration-150">
        <button className={`p-0 ${category === 'week' ? "-translate-y-1 ":"border-0"}`} onClick={() => setCategory("week")}>This Week</button>
        <button className={`p-0 ${category === 'month' ? "-translate-y-1 ":"border-0"}`} onClick={() => setCategory("month")}>This Month</button>
        <button className={`p-0 ${category === 'semester' ? "-translate-y-1 ":"border-0"}`} onClick={() => setCategory("semester")}>This Semester</button>
      </div>
     </div>

      <Bar data={data} options={options} />
    </div>
  );
};

export default BarGraph;