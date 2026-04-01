import React, { useEffect, useState } from "react";
import { updateFaculty } from "../../../../Services/FacultyService";

const FacultyEditModal = ({ faculty, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    departmentId: "",
    branchId: "",
  });

  useEffect(() => {
    if (faculty) {
      setForm({
        name: faculty.name || "",
        email: faculty.email || "",
        phone: faculty.phone || "",
        designation: faculty.designation || "",
        departmentId: faculty.departmentId || "",
        branchId: faculty.branchId || "",
        joiningDate: faculty.joiningDate || "",
      });
    }
  }, [faculty]);

  const handleSubmit = async () => {
    try {
      await updateFaculty(faculty.id, form); // JSON request
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Edit Faculty</h3>

        {/* Name */}
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        {/* Email */}
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* Phone */}
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        {/* Designation */}
        <select
          value={form.designation}
          onChange={(e) =>
            setForm({ ...form, designation: e.target.value })
          }
        >
          <option value="">Select Designation</option>
          <option value="PROFESSOR">PROFESSOR</option>
          <option value="ASSISTANT_PROFESSOR">ASSISTANT PROFESSOR</option>
          <option value="ASSOCIATE_PROFESSOR">ASSOCIATE PROFESSOR</option>
          <option value="HOD">HOD</option>
          <option value = "LAB_INSTRUCTOR">LAB INSTRUCTOR</option>
        </select>


        {/* Joining Date */}
        <input
          type="date"
          value={form.joiningDate}
          onChange={(e) =>
            setForm({ ...form, joiningDate: e.target.value })
          }
        />

        {/* Actions */}
        <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
          <button onClick={handleSubmit}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default FacultyEditModal;