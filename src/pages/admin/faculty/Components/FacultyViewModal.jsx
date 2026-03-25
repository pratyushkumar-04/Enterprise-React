import React from "react";
import { getCv } from "../../../../Services/FacultyService";

const FacultyViewModal = ({ faculty, imageUrls, onClose }) => {
  if (!faculty) return null;

  // New handler to fetch CV and open it
  const handleViewCv = async () => {
    try {
      const res = await getCv(faculty.id);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Failed to load CV:", err);
      alert("Unable to open CV. Please try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        {/* IMAGE */}
        <div className="card-image-container">
          <img
            src={imageUrls[faculty.id] || ""}
            alt={faculty.name}
            className="card-hero-image"
          />
          <button className="card-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="card-content">
          <h2 className="student-name">{faculty?.name}</h2>
          <p className="student-role">{faculty?.designation}</p>

          <div className="divider"></div>

          <div className="info-list">
            <div className="info-item">
              <span className="label">Faculty Code</span>
              <span className="value">{faculty?.facultyCode}</span>
            </div>
            <div className="info-item">
              <span className="label">Department</span>
              <span className="value">{faculty?.departmentName}</span>
            </div>
            <div className="info-item">
              <span className="label">Branch</span>
              <span className="value">{faculty?.branchName}</span>
            </div>
            <div className="info-item">
              <span className="label">Email</span>
              <span className="value">{faculty?.email}</span>
            </div>
            <div className="info-item">
              <span className="label">Phone</span>
              <span className="value">{faculty?.phone}</span>
            </div>

            <div className="divider"></div>

            <h3 className="document-title">Documents</h3>

            <div className="document-buttons">
              <button onClick={handleViewCv} className="doc-btn">
                View CV
              </button>
            </div>
          </div>

          <div className={`status-bar ${faculty.status.toLowerCase()}`}>
            {faculty.status}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyViewModal;