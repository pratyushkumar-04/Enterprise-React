import React, { useEffect, useState } from "react";
import { getStudentImage } from "../../Services/StudentService";
import { getAssignmentsbyFaculty } from "../../Services/SubjectAssignmentService";
import instance from "../../Services/axios";
import "../../styles/FacultyStudentAttendance.css";

const FacultyStudentAttendance = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState({});

  const facultyId = localStorage.getItem("id");

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const res = await getAssignmentsbyFaculty(facultyId);
      console.log(res);

      // We only want active assignments (optional, but good practice)
      const activeAssignments = res.filter((a) => a.active);
      setClasses(activeAssignments);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClassChange = (id) => {
    setSelectedClassId(id);
    const cls = classes.find((c) => String(c.id) === String(id));
    setSelectedClass(cls);
  };

  const loadImages = async (studentsList) => {
    const urls = {};
    for (const student of studentsList) {
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

  const fetchSummary = async () => {
    if (!selectedClass) return;

    try {
      setLoading(true);

      const res = await instance.get(
        `/attendance/faculty/${facultyId}/subject/${selectedClass.subjectId}/section/${selectedClass.sectionId}/summary`,
      );

      setData(res.data);
      if (res.data && res.data.students) {
        loadImages(res.data.students);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="faculty-dashboard-container">
      {/* 🔹 Filters */}
      <div className="filter-card">
        <h5 className="section-subtitle">Select Class</h5>

        <div className="filter-row">
          <div className="filter-group" style={{ flexGrow: 1 }}>
            <select
              className="filter-input"
              value={selectedClassId}
              onChange={(e) => handleClassChange(e.target.value)}
            >
              <option value="">Select Subject + Section</option>

              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.subjectName} - Section {cls.sectionName}
                </option>
              ))}
            </select>
          </div>

          <div className="button-group">
            <button
              className="btn-mark-attendance btn-unmarked"
              disabled={!selectedClass}
              onClick={fetchSummary}
            >
              Load Attendance
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 Summary */}
      {data && data.summary && (
        <div className="summary-card">
          <div className="summary-header">
            <h4>
              {data.summary.subjectName} - Section {data.summary.sectionName}
            </h4>
          </div>

          <div className="summary-stats-row">
            <div className="stat-box">
              <p>Total Classes</p>
              <h5>{data.summary.totalClasses}</h5>
            </div>

            <div className="stat-box">
              <p>Average Attendance</p>
              <h5>{data.summary.averageAttendance}%</h5>
            </div>

            <div className="stat-box">
              <p>Below 75%</p>
              <h5>{data.summary.below75Count}</h5>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Table */}
      {loading ? (
        <div className="text-center py-4 text-muted">
          <h6>Loading...</h6>
        </div>
      ) : (
        data && (
          <div className="table-card">
            <div className="table-header-row">
              <h3 className="section-title">Student Attendance</h3>
            </div>

            <div className="table-responsive">
              <table className="custom-attendance-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Roll</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Total</th>
                    <th>%</th>
                  </tr>
                </thead>

                <tbody>
                  {data.students.map((s, index) => (
                    <tr
                      key={s.studentId}
                      className={
                        s.percentage < 60
                          ? "row-absent"
                          : s.percentage < 75
                            ? "row-warning"
                            : "row-success"
                      }
                    >
                      <td>{index + 1}</td>
                      <td>
                        {imageUrls[s.studentId] ? (
                          <img
                            src={imageUrls[s.studentId]}
                            alt="student"
                            style={{
                              width: "34px",
                              height: "34px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "34px",
                              height: "34px",
                              borderRadius: "50%",
                              background: "#e5e7eb",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "14px",
                            }}
                          >
                            👤
                          </div>
                        )}
                      </td>
                      <td className="fw-semibold">{s.name}</td>
                      <td>{s.rollNumber}</td>
                      <td>{s.presentCount}</td>
                      <td>{s.absentCount}</td>
                      <td>{s.totalClasses}</td>
                      <td>
                        <span className="fw-bold">{s.percentage}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default FacultyStudentAttendance;
