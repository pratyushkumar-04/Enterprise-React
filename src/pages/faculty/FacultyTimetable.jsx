import React from "react";
import "../../styles/FacultyTimetable.css";

const FacultyTimetable = () => {
  const facultyName = "Pramod Jha";
  const academicYear = "2025-26";
  const totalSubjects = 3;

  const periods = [
    { id: 1, time: "09:00 - 10:00" },
    { id: 2, time: "10:00 - 11:00" },
    { id: 3, time: "11:15 - 12:15" },
    { id: 4, time: "12:15 - 01:15" },
    { id: 5, time: "02:00 - 03:00" },
    { id: 6, time: "03:00 - 04:00" },
    { id: 7, time: "04:00 - 05:00" }
  ];

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  const timetable = [
    {
      day: "Monday",
      period: 1,
      subject: "DSA",
      section: "A",
      room: "C-204"
    },
    {
      day: "Monday",
      period: 4,
      subject: "DBMS",
      section: "B",
      room: "C-105"
    },
    {
      day: "Tuesday",
      period: 2,
      subject: "DSA",
      section: "A",
      room: "C-204"
    },
    {
      day: "Wednesday",
      period: 3,
      subject: "OOPs",
      section: "A",
      room: "Lab-2"
    },
    {
      day: "Thursday",
      period: 5,
      subject: "DBMS",
      section: "B",
      room: "C-105"
    },
    {
      day: "Friday",
      period: 1,
      subject: "DSA",
      section: "A",
      room: "C-204"
    },
    {
      day: "Saturday",
      period: 2,
      subject: "Mentoring",
      section: "-",
      room: "Faculty Room"
    }
  ];

  const getCellData = (day, period) => {
    return timetable.find(
      (item) => item.day === day && item.period === period
    );
  };

  return (
    <div className="faculty-timetable-page">
      <div className="timetable-header-card">
        <div>
          <h1>My Timetable</h1>
          <p>{facultyName}</p>
        </div>

        <div className="timetable-summary">
          <div className="summary-item">
            <span className="label">Academic Year</span>
            <span className="value">{academicYear}</span>
          </div>

          <div className="summary-item">
            <span className="label">Assigned Subjects</span>
            <span className="value">{totalSubjects}</span>
          </div>
        </div>
      </div>

      <div className="timetable-card">
        <div className="timetable-wrapper">
          <table className="faculty-timetable-table">
            <thead>
              <tr>
                <th className="time-column">Time</th>
                {days.map((day) => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {periods.map((period) => (
                <tr key={period.id}>
                  <td className="time-slot">
                    <div className="period-number">
                      Period {period.id}
                    </div>
                    <div className="period-time">{period.time}</div>
                  </td>

                  {days.map((day) => {
                    const cell = getCellData(day, period.id);

                    return (
                      <td key={`${day}-${period.id}`}>
                        {cell ? (
                          <div className="timetable-slot">
                            <div className="slot-subject">
                              {cell.subject}
                            </div>

                            <div className="slot-section">
                              Section {cell.section}
                            </div>

                            <div className="slot-room">
                              {cell.room}
                            </div>
                          </div>
                        ) : (
                          <div className="empty-slot">—</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FacultyTimetable;