import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFacultyProfile,
  getFacultyImage,
} from "../../Services/FacultyService";
import { getAssignmentsbyFaculty } from "../../Services/SubjectAssignmentService";

import "../../styles/FacultyDashboard.css";
import {
  createAttendanceSession,
  getCurrentClass,
} from "../../Services/AttendanceService";

const FacultyDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);
  const [currentClass, setCurrentClass] = useState(null);

  const facultyId = localStorage.getItem("id");

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    fetchCurrentClass();
  }, []);

  const loadDashboardData = async () => {
    try {
      const profileRes = await getFacultyProfile();
      setProfile(profileRes);

      const facultyId = localStorage.getItem("id");

      if (facultyId) {
        const imageRes = await getFacultyImage(facultyId);
        const url = URL.createObjectURL(imageRes.data);
        setImageUrl(url);
        const assignmentRes = await getAssignmentsbyFaculty(facultyId);
        setAssignments(assignmentRes);
      }
    } catch (error) {
      console.error("Error loading faculty dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleAttendanceClick = async () => {
    try {
      let sessionId = currentClass.sessionId;

      if (!sessionId) {
        const data = await createAttendanceSession({
          timetableEntryId: currentClass.timetableEntryId,
          date: new Date().toISOString().split("T")[0],
          lectureNum: currentClass.lectureNum,
        });

        console.log(data);
        

        sessionId = data.Id;
      }

      navigate(`/faculty/attendance/${sessionId}`);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCurrentClass = async () => {
    try {
      const data = await getCurrentClass(facultyId);
      // console.log(data);
      

      if (!data || data.hasCurrentClass === false) {
        setCurrentClass(null);
        return;
      }

      setCurrentClass(data);
    } catch (err) {
      console.error(err);
    }
  };
  const formatText = (value) =>
    value
      ?.toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  if (loading) {
    return <div className="faculty-dashboard-loading">Loading...</div>;
  }

  return (
    <div className="faculty-dashboard-container">
      <div className="dashboard-top-row">
        {/* Minimal Profile Card */}
        <div className="minimal-profile-card">
          <img
            src={imageUrl || "/default-avatar.png"}
            alt="Faculty"
            className="faculty-profile-image-small"
          />
          <div className="minimal-profile-info">
            <h3>{profile.name}</h3>
            <p className="designation">{formatText(profile.designation)}</p>
            <p className="faculty-code">{profile.facultyCode}</p>
          </div>
        </div>

        {/* Current Class Card */}
        <div className="current-class-card">
          {currentClass ? (
            <div className="current-class-content">
              <div className="class-info">
                <h5 className="section-subtitle">Current Class</h5>
                <h4 className="class-title">{currentClass.subjectName}</h4>
                <div className="class-meta">
                  <span className="meta-badge section-badge">
                    Section {currentClass.sectionName}
                  </span>
                  <span className="meta-badge lecture-badge">
                    Lecture {currentClass.lectureNum}
                  </span>
                  <span className="meta-badge time-badge">
                    <i className="bi bi-clock me-1"></i>
                    {currentClass.startTime.slice(0, 5)} - {currentClass.endTime.slice(0, 5)}
                  </span>
                </div>
              </div>

              <div className="class-action">
                <button
                  className={`btn-mark-attendance ${
                    currentClass.attendanceMarked ? "btn-marked" : "btn-unmarked"
                  }`}
                  onClick={handleAttendanceClick}
                >
                  {currentClass.attendanceMarked
                    ? "View / Edit Attendance"
                    : "Mark Attendance"}
                </button>
              </div>
            </div>
          ) : (
            <div className="no-class-content">
              <div className="no-class-icon">☕</div>
              <h5 className="no-class-title">No Ongoing Class</h5>
              <p className="no-class-text">
                You do not have any classes scheduled right now. Take a break!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Assignment Section */}
      <div className="faculty-assignment-section">
        <div className="section-header">
          <h3>Assigned Subjects</h3>
        </div>

        <div className="assignment-table-wrapper">
          <table className="assignment-table">
            <thead>
              <tr>
                <th>Sl. No.</th>
                <th>Subject</th>
                <th>Code</th>
                <th>Section</th>
                <th>Semester</th>
                <th>Branch</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {assignments.length > 0 ? (
                assignments.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>{item.subjectName}</td>
                    <td>{item.subjectCode}</td>
                    <td>{item.sectionName}</td>
                    <td>{item.semester}</td>
                    <td>{item.branch}</td>
                    <td>
                      <span
                        className={
                          item.active ? "status-active" : "status-inactive"
                        }
                      >
                        {item.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    No assignments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
