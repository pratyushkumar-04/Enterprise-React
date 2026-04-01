// RemoveAssignmentDialog.jsx

import "../../../../styles/FacultyAssignment.css"


export default function RemoveAssignmentDialog({
  assignment,
  onClose,
  onConfirm,
}) {
  if (!assignment) return null;

 
return (
  <div className="erp-modal-overlay">
    <div className="erp-modal">

      <div className="erp-modal-header danger">
        <span>Remove Assignment</span>
        <button className="erp-close" onClick={onClose}>×</button>
      </div>

      <div className="erp-modal-body">
        <p className="erp-warning-text">
          Are you sure you want to remove this assignment?
        </p>

        <div className="erp-info-box">
          <p><strong>Subject:</strong> {assignment.subjectName}</p>
          <p><strong>Faculty:</strong> {assignment.facultyName}</p>
          <p><strong>Section:</strong> {assignment.sectionName}</p>
        </div>
      </div>

      <div className="erp-modal-footer">
        <button className="erp-btn ghost" onClick={onClose}>
          Cancel
        </button>

        <button
          className="erp-btn danger"
          onClick={() => onConfirm(assignment.id)}
        >
          Remove
        </button>
      </div>

    </div>
  </div>
);
}