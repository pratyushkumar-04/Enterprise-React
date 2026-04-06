import React, { useEffect, useState } from "react";
import {
  getFacultyProfile,
  getFacultyImage,
} from "../../Services/FacultyService";
import { getAssignmentsbyFaculty } from "../../Services/SubjectAssignmentService";
import "../../styles/FacultyDashboard.css";

const FacultyDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    loadDashboardData();
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
      {/* Profile Card */}
      <div className="faculty-profile-card">
        <div className="faculty-profile-header">
          <div className="faculty-avatar">{profile?.name?.charAt(0)}</div>

          <div>
            <h2>{profile.name}</h2>
            <p>{profile.designation}</p>
          </div>
        </div>

        <div className="faculty-profile-details">
          <img
            src={imageUrl || "/default-avatar.png"}
            alt="Faculty"
            className="faculty-profile-image"
          />
          <div>
            <label>Faculty Code</label>
            <span>{profile.facultyCode}</span>
          </div>

          <div>
            <label>Designation</label>
            <span>{formatText(profile.designation)}</span>
          </div>

          <div>
            <label>Department</label>
            <span>{profile.departmentName}</span>
          </div>

          <div>
            <label>Course</label>
            <span>{profile.courseName}</span>
          </div>

          <div>
            <label>Branch</label>
            <span>{profile.branchName}</span>
          </div>

          <div>
            <label>Status</label>
            <span>{formatText(profile.status)}</span>
          </div>

          <div>
            <label>Email</label>
            <span>{profile.email}</span>
          </div>

          <div>
            <label>Phone</label>
            <span>{profile.phone}</span>
          </div>

          <div>
            <label>Qualification</label>
            <span>{profile.qualification}</span>
          </div>
        </div>
      </div>

      {/* Assignment Section */}
      <div className="faculty-assignment-section">
        <div className="section-header">
          <h3>My Assigned Subjects</h3>
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
                  <td colSpan="6" className="no-data">
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
