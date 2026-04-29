    import React, { useEffect, useState } from "react";
    import { useNavigate } from "react-router-dom";
    import { getFacultyAttendanceSessions } from "../../Services/AttendanceService";

    const FacultyAttendanceHistory = () => {
    const navigate = useNavigate();

    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);

    const [fromDate, setFromDate] = useState(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]
    );

    const [toDate, setToDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const facultyId = localStorage.getItem("id");

    useEffect(() => {
        fetchSessions();
    }, [fromDate, toDate]);

    const fetchSessions = async () => {
        try {
        setLoading(true);

        const data = await getFacultyAttendanceSessions(
            facultyId,
            fromDate,
            toDate
        );

        setSessions(data);
        } catch (err) {
        console.error("Error fetching sessions:", err);
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="faculty-dashboard-container">

        {/* 🔹 Filters */}
        <div className="filter-card">
            <h5 className="section-subtitle">Filter Attendance</h5>

            <div className="filter-row">
                <div className="filter-group">
                <label>From Date</label>
                <input
                    type="date"
                    className="filter-input"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                />
                </div>

                <div className="filter-group">
                <label>To Date</label>
                <input
                    type="date"
                    className="filter-input"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                />
                </div>

                <div className="button-group">
                <button
                    className="btn-mark-attendance btn-unmarked w-100"
                    onClick={fetchSessions}
                >
                    Search
                </button>
                </div>
            </div>
        </div>

        {/* 🔹 Table */}
        <div className="history-table-card">
            <div className="table-header-row">
                <h3 className="section-title">Attendance History</h3>
                <span className="session-count-badge">
                {sessions.length} Sessions
                </span>
            </div>

            {loading ? (
                <div className="text-center py-4 text-muted">
                <h6>Loading...</h6>
                </div>
            ) : sessions.length === 0 ? (
                <div className="text-center py-4 text-muted">
                <h6>No attendance records found</h6>
                </div>
            ) : (
                <div className="table-responsive">
                <table className="custom-attendance-table">
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Subject</th>
                        <th>Section</th>
                        <th>Lecture</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                    </thead>

                    <tbody>
                    {sessions.map((s) => (
                        <tr 
                          key={s.sessionId}
                          className={s.attendanceMarked ? "row-success" : "row-warning"}
                        >
                        <td>
                            {new Date(s.date).toLocaleDateString()}
                        </td>

                        <td className="fw-semibold" style={{ color: "#1e293b" }}>
                            {s.subjectName}
                        </td>

                        <td>{`${s.branch}-${s.semester}-${s.sectionName}`}</td>

                        <td>L{s.lectureNum}</td>

                        <td>
                            {s.startTime.slice(0, 5)} -{" "}
                            {s.endTime.slice(0, 5)}
                        </td>

                        <td>
                            <span
                            className={
                                s.attendanceMarked
                                ? "status-completed"
                                : "status-pending"
                            }
                            >
                            {s.attendanceMarked
                                ? "Completed"
                                : "Pending"}
                            </span>
                        </td>

                        <td className="text-end">
                            <button
                            className="btn-view"
                            onClick={() =>
                                navigate(
                                `/faculty/attendance/${s.sessionId}`
                                )
                            }
                            >
                            View
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}
        </div>
        </div>
    );
    };

    export default FacultyAttendanceHistory;