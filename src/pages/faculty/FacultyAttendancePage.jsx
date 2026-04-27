import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getStudentsForAttendance,
  markAttendance,
  createAttendanceSession,
  getFacultyClassesForAttendance,
} from "../../Services/AttendanceService.js";
import { getStudentImage } from "../../Services/StudentService.js";
import toast, { Toaster } from "react-hot-toast";
import "../../styles/FacultyAttendance.css";

const FacultyAttendancePage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const [absentRolls, setAbsentRolls] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedLectureNum, setSelectedLectureNum] = useState("");

  const facultyId = localStorage.getItem("id");

  useEffect(() => {
    if (sessionId) {
      loadStudents();
    } else {
      loadClasses();
    }
  }, [sessionId, selectedDate]);

  const loadClasses = async () => {
    try {
      setLoading(true);

      const data = await getFacultyClassesForAttendance(
        facultyId,
        selectedDate,
      );
      console.log(data);
      

      setClasses(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (value) => {
    setSelectedClassId(value);

    const cls = classes.find((item) => item.timetableEntryId === value);

    setSelectedClass(cls);

    if (cls) {
      setSelectedLectureNum(cls.lectureNum);
    }
  };

  const loadStudents = async () => {
    try {
      setLoading(true);

      const data = await getStudentsForAttendance(sessionId);

      const studentsArray = Array.isArray(data) ? data : data.students || [];

      setStudents(
        studentsArray.map((student) => ({
          ...student,
          present:
            student.present === null || student.present === undefined
              ? true
              : student.present,
        })),
      );

      if (data.sessionInfo) {
        setSessionInfo(data.sessionInfo);
      }

      // Load images for students
      loadImages(studentsArray);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const loadImages = async (studentsList) => {
    const urls = {};
    for (const student of studentsList) {
      // Load image only if we don't already have it
      if (!imageUrls[student.studentId]) {
        try {
          const res = await getStudentImage(student.studentId);
          if (res && res.data) {
            const imageUrl = URL.createObjectURL(res.data);
            urls[student.studentId] = imageUrl;
          }
        } catch (err) {
          console.error("Image load error for:", student.studentId, err);
        }
      }
    }
    if (Object.keys(urls).length > 0) {
      setImageUrls((prev) => ({ ...prev, ...urls }));
    }
  };

  const toggleAttendance = (studentId) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.studentId === studentId
          ? { ...student, present: !student.present }
          : student,
      ),
    );
  };

  const applyAbsentRolls = () => {
    if (!absentRolls.trim()) {
      toast.error("Please enter at least one roll number");
      return;
    }
    const absentArray = absentRolls
      .trim()
      .split(/\s+/)
      .map((r) => r.trim());

    setStudents((prev) =>
      prev.map((student) => ({
        ...student,
        present: !absentArray.includes(String(student.rollNumber)),
      })),
    );
    toast.success("Applied absent roll numbers");
  };

  const markAllPresent = () => {
    setStudents((prev) =>
      prev.map((student) => ({
        ...student,
        present: true,
      })),
    );
    toast.success("Marked all as present");
  };

  const markAllAbsent = () => {
    setStudents((prev) =>
      prev.map((student) => ({
        ...student,
        present: false,
      })),
    );
    toast.success("Marked all as absent");
  };

  const handleSave = async () => {
    try {
      const toastId = toast.loading("Saving attendance...");
      const payload = {
        sessionId,
        attendanceList: students.map((student) => ({
          studentId: student.studentId,
          status: student.present ? "PRESENT" : "ABSENT",
        })),
      };

      await markAttendance(payload);

      toast.success("Attendance saved successfully", { id: toastId });
      setTimeout(() => navigate("/faculty"), 1500);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save attendance");
    }
  };

  return (
    <div className="attendance-page container mt-4">
      <Toaster position="top-right" />

      {loading && !students.length && !classes.length && (
        <div className="loader-overlay">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <h2>Attendance Management</h2>

      {!sessionId && (
        <div className="filter-row d-flex flex-wrap gap-3 mb-4 mt-4">
          <input
            type="date"
            className="form-control"
            style={{ width: "200px" }}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <select
            className="form-control"
            style={{ flex: "1", minWidth: "250px" }}
            value={selectedClassId}
            onChange={(e) => handleClassChange(e.target.value)}
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls.timetableEntryId} value={cls.timetableEntryId}>
                {cls.subjectName} - Section {cls.sectionName} - Semester {cls.Semester}
              </option>
            ))}
          </select>

          <input
            type="number"
            className="form-control"
            style={{ width: "150px" }}
            value={selectedLectureNum}
            onChange={(e) => setSelectedLectureNum(e.target.value)}
            placeholder="Lecture No."
          />

          <button
            className="load-btn shadow-sm"
            disabled={!selectedClass}
            onClick={async () => {
              try {
                const toastId = toast.loading("Initializing session...");
                let sid = selectedClass.sessionId;

                if (!sid) {
                  const created = await createAttendanceSession({
                    timetableEntryId: selectedClass.timetableEntryId,
                    date: selectedDate,
                    lectureNum: Number(selectedLectureNum),
                  });
                  sid = created.id;
                }
                toast.dismiss(toastId);
                navigate(`/faculty/attendance/${sid}`);
              } catch (err) {
                console.error(err);
                toast.error("Failed to initialize session");
              }
            }}
          >
            Load Students
          </button>
        </div>
      )}

      {sessionInfo && (
        <div className="section-summary shadow-sm">
          <h5>
            Session: {sessionInfo.subjectName} - Section{" "}
            {sessionInfo.sectionName} - Lecture {sessionInfo.lectureNum}
          </h5>
          <span className="student-count">
            Date: {sessionInfo.date} | Students: {students.length}
          </span>
        </div>
      )}

      {sessionId && (
        <>
          {/* <div className="quick-actions-bar d-flex justify-content-between align-items-center flex-wrap gap-3 mt-4 mb-3 p-3 bg-white rounded-3 shadow-sm border border-light">
            <div className="d-flex align-items-center gap-2 flex-grow-1">
              <span className="fw-semibold text-secondary me-2">Quick Mark:</span>
              <input
                type="text"
                className="form-control quick-mark-input shadow-sm border-0 bg-light"
                placeholder="Absent rolls (e.g., 101 104)"
                value={absentRolls}
                onChange={(e) => setAbsentRolls(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    applyAbsentRolls();
                  }
                }}
              />
              <button className="btn btn-primary px-4 fw-semibold shadow-sm" onClick={applyAbsentRolls}>Apply</button>
            </div>
            <div className="d-flex gap-3">
              <button className="mark-btn btn-present shadow-sm" onClick={markAllPresent}>
                Mark All Present
              </button>
              <button className="mark-btn btn-absent shadow-sm" onClick={markAllAbsent}>
                Mark All Absent
              </button>
            </div>
          </div> */}
          <div className="quick-actions-container">
            {/* Row 1: Quick Mark */}
            <div className="quick-mark-row">
              <span className="quick-mark-title">Quick Mark</span>
              <div className="quick-mark-input-wrapper">
                <input
                  type="text"
                  className="quick-mark-input"
                  placeholder="Enter absent roll numbers separated by space (e.g., 101 104)"
                  value={absentRolls}
                  onChange={(e) => setAbsentRolls(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      applyAbsentRolls();
                    }
                  }}
                />
              </div>
              <button
                className="btn-apply"
                onClick={applyAbsentRolls}
              >
                Apply
              </button>
            </div>

            {/* Row 2: Bulk Actions */}
            <div className="bulk-actions-row">
              <button className="mark-btn-modern btn-present-modern" onClick={markAllPresent}>
                Mark All Present
              </button>

              <button className="mark-btn-modern btn-absent-modern" onClick={markAllAbsent}>
                Mark All Absent
              </button>
            </div>
          </div>

          <div className="table-section">
            <div className="table-header">
              <h5 className="m-0 text-dark fw-bold">Students List</h5>
            </div>

            <div className="table-container">
              <table className="student-table">
                <thead>
                  <tr>
                    <th>Sl No</th>
                    <th>Photo</th>
                    <th>Admission No</th>
                    <th>Name</th>
                    <th>Roll Number</th>
                    <th>Status</th>
                    <th>Present</th>
                  </tr>
                </thead>

                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-muted">
                        No students found in this session.
                      </td>
                    </tr>
                  ) : (
                    students.map((student, index) => (
                      <tr key={student.studentId}>
                        <td>{index + 1}</td>

                        <td>
                          {imageUrls[student.studentId] ? (
                            <img
                              src={imageUrls[student.studentId]}
                              alt="student"
                              className="student-avatar"
                            />
                          ) : (
                            <div className="avatar-placeholder">👤</div>
                          )}
                        </td>

                        <td>{student.admissionNumber}</td>

                        <td>{student.name}</td>

                        <td>{student.rollNumber || "-"}</td>

                        <td>
                          <span
                            className={`status-badge ${student.present ? "status-present" : "status-absent"}`}
                          >
                            {student.present ? "Present" : "Absent"}
                          </span>
                        </td>

                        <td>
                          <input
                            type="checkbox"
                            className="attendance-checkbox"
                            checked={student.present}
                            onChange={() => toggleAttendance(student.studentId)}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="generate-btn-container">
              <button className="generate-btn" onClick={handleSave}>
                Save Attendance
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FacultyAttendancePage;
