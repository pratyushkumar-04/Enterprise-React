import React, { useEffect, useMemo, useState } from "react";
import { getFacultyTimetable } from "../../Services/TimetableService";
import "../../styles/FacultyTimetable.css";

const FacultyTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  const days = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY"
  ];
  const facultyId = localStorage.getItem("id");

  const periods = [
    { id: 1, time: "09:00 - 10:00" },
    { id: 2, time: "10:00 - 11:00" },
    { id: 3, time: "11:15 - 12:15" },
    { id: 4, time: "12:15 - 01:15" },
    { id: 5, time: "02:00 - 03:00" },
    { id: 6, time: "03:00 - 04:00" },
    { id: 7, time: "04:00 - 05:00" }
  ];

  useEffect(() => {
    loadTimetable();
  }, []);

  const loadTimetable = async () => {
    try {
      const response = await getFacultyTimetable(facultyId);
      setTimetable(response.data || []);
    } catch (error) {
      console.error("Failed to load faculty timetable", error);
    } finally {
      setLoading(false);
    }
  };

  const academicYear = useMemo(() => {
    return timetable.length ? timetable[0].academicYear : "-";
  }, [timetable]);

  const totalSubjects = useMemo(() => {
    return new Set(timetable.map((item) => item.subjectId)).size;
  }, [timetable]);

  const facultyName = useMemo(() => {
    return timetable.length ? timetable[0].facultyName : "Faculty";
  }, [timetable]);

  const getCellData = (day, period) => {
    return timetable.find(
      (item) =>
        item.dayOfWeek === day &&
        Number(item.periodNumber) === Number(period)
    );
  };

  const formatDay = (day) => {
    return day.charAt(0) + day.slice(1).toLowerCase();
  };

  if (loading) {
    return (
      <div className="faculty-timetable-loading">
        Loading timetable...
      </div>
    );
  }

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

          <div className="summary-item">
            <span className="label">Total Classes</span>
            <span className="value">{timetable.length}</span>
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
                  <th key={day}>{formatDay(day)}</th>
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
                    const slot = getCellData(day, period.id);

                    return (
                      <td key={`${day}-${period.id}`}>
                        {slot ? (
                          <div className="timetable-slot">
                            <div className="slot-subject">
                              {slot.subjectName}
                            </div>

                            <div className="slot-section">
                              {slot.section} • Sem {slot.semester}
                            </div>

                            <div className="slot-room">
                              {slot.roomNumber || "No Room"}
                            </div>

                            <div className="slot-time">
                              {slot.startTime?.slice(0, 5)} -{" "}
                              {slot.endTime?.slice(0, 5)}
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