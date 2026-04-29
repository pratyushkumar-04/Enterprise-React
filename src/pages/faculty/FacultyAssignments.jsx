import React, { useEffect, useMemo, useState } from "react";
import { FaBookOpen, FaLayerGroup, FaCalendarAlt } from "react-icons/fa";
import { getAssignmentsbyFaculty } from "../../Services/SubjectAssignmentService";
import "../../styles/FacultyAssignmentsList.css";

const FacultyAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const facultyId = localStorage.getItem("id");

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const response = await getAssignmentsbyFaculty(facultyId);
      console.log(response);
      setAssignments(response || []);
    } catch (error) {
      console.error("Error loading assignments", error);
    } finally {
      setLoading(false);
    }
  };

  const totalSubjects = useMemo(() => {
    return new Set(assignments.map((a) => a.subjectId)).size;
  }, [assignments]);

  const totalSections = useMemo(() => {
    return new Set(assignments.map((a) => a.sectionId)).size;
  }, [assignments]);

  const academicYear = useMemo(() => {
    if (!assignments.length) return "-";
    return assignments[0].academicYear || assignments[1].academicYear;
  }, [assignments]);

  if (loading) {
    return (
      <div className="faculty-assignment-loading">
        Loading assigned subjects...
      </div>
    );
  }

  return (
    <div className="faculty-assignments-page">
      <div className="faculty-assignments-header">
        <h1>My Assigned Subjects</h1>
        <p>Subjects and sections currently assigned to you</p>
      </div>

      {/* Summary Cards */}
      <div className="assignment-summary-grid">
        <div className="summary-card">
          <div className="summary-icon blue">
            <FaBookOpen />
          </div>
          <div>
            <h3>{totalSubjects}</h3>
            <p>Total Subjects</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon green">
            <FaLayerGroup />
          </div>
          <div>
            <h3>{totalSections}</h3>
            <p>Total Sections</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon orange">
            <FaCalendarAlt />
          </div>
          <div>
            <h3>{academicYear}</h3>
            <p>Academic Year</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="assignment-table-card">
        <div className="table-header">
          <h2>Assigned Subjects & Sections</h2>
        </div>

        <div className="table-wrapper">
          <table className="assignment-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Code</th>
                <th>Branch</th>
                <th>Semester</th>
                <th>Section</th>
                <th>Academic Year</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td>
                      <div className="subject-cell">
                        <span className="subject-name">
                          {assignment.subjectName}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="subject-code">
                        {assignment.subjectCode}
                      </span>
                    </td>

                    <td>{assignment.branch}</td>

                    <td>
                      Semester {assignment.semester}
                    </td>

                    <td>
                      <span className="section-badge">
                        {assignment.sectionName}
                      </span>
                    </td>

                    <td>{assignment.academicYear}</td>

                    <td>
                      <span
                        className={`status-badge ${
                          assignment.active ? "active" : "inactive"
                        }`}
                      >
                        {assignment.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    No subject assignments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="assignment-mobile-list">
        {assignments.map((assignment) => (
          <div className="assignment-mobile-card" key={assignment.id}>
            <div className="mobile-card-top">
              <h3>{assignment.subjectName}</h3>
              <span className="subject-code">{assignment.subjectCode}</span>
            </div>

            <div className="mobile-card-grid">
              <div>
                <label>Branch</label>
                <span>{assignment.branch}</span>
              </div>

              <div>
                <label>Semester</label>
                <span>Semester {assignment.semester}</span>
              </div>

              <div>
                <label>Section</label>
                <span>{assignment.sectionName}</span>
              </div>

              <div>
                <label>Year</label>
                <span>{assignment.academicYear}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyAssignments;