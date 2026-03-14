import React, { useState } from "react";
import axios from "axios";

const EditDepartmentModal = ({ department, onClose, refresh }) => {

  const [name, setName] = useState(department.name);

  const handleUpdate = async () => {

    await axios.put(`/api/departments/${department.id}`, {
      name
    });

    refresh();
    onClose();
  };

  return (
    <div className="modal-overlay">

      <div className="modal">

        <h3>Edit Department</h3>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="modal-actions">

          <button
            className="btn-primary"
            onClick={handleUpdate}
          >
            Save
          </button>

          <button
            className="btn-cancel"
            onClick={onClose}
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
};

export default EditDepartmentModal;