import { useState } from "react";
import "../../../../styles/FacultyAssignment.css"

export default function ReassignFacultyModal({
  assignment,
  faculties,
  onClose,
  onSubmit,
}) {
  const [newFacultyId, setNewFacultyId] = useState("");

  
  return (
  <div className="erp-modal-overlay">
    <div className="erp-modal">

      <div className="erp-modal-header warning">
        <span>Reassign Faculty</span>
        <button className="erp-close" onClick={onClose}>×</button>
      </div>

      <div className="erp-modal-body">
        <div className="erp-info">
          <p><strong>Subject:</strong> {assignment.subjectName}</p>
          <p><strong>Current Faculty:</strong> {assignment.facultyName}</p>
        </div>

        <div className="erp-field">
          <label className="erp-label">New Faculty</label>
          <select
            className="erp-select"
            value={newFacultyId}
            onChange={(e) => setNewFacultyId(e.target.value)}
          >
            <option value="">Select Faculty</option>
            {faculties
              .filter((f) => f.id !== assignment.facultyId)
              .map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="erp-modal-footer">
        <button className="erp-btn ghost" onClick={onClose}>
          Cancel
        </button>

        <button
          className="erp-btn warning"
          disabled={!newFacultyId}
          onClick={() => onSubmit(newFacultyId)}
        >
          Update Faculty
        </button>
      </div>

    </div>
  </div>
);

}