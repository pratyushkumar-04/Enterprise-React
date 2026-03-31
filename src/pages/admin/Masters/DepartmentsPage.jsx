/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  getDepartments,
  addDepartment,
  editDepartment,
} from "../../../Services/DepartmentService";
import "../../../styles/Department.css";
import toast from "react-hot-toast";
import Loader from "../../../Components/common/Loader";

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const [editingDept, setEditingDept] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const data = await getDepartments();
      setDepartments(data);
    } catch (err) {
      toast.error("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const req = { name, code };
      await addDepartment(req);

      setName("");
      setCode("");

      await loadDepartments();
      toast.success("Department Added Successfully!");
    } catch (err) {
      toast.error("Failed to add department");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (dept) => {
    setEditingDept(dept);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const req = { name: editingDept.name, code: editingDept.code };
      await editDepartment(editingDept.Id, req);

      setShowModal(false);
      await loadDepartments();
      toast.success("Department Modified Successfully!");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("Failed to update department");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dept-master-page">
      {loading && (
  <div className="loader-overlay">
    <Loader />
  </div>
)}
      <div className="page-container">
        <h2>Department Master</h2>

        {/* Add Form */}
        <div className="card">
          <h3>Add Department</h3>

          <form onSubmit={handleAdd}>
            <input
              type="text"
              placeholder="Department Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Department Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />

            <button type="submit">Add Department</button>
          </form>
        </div>

        {/* Department Table */}

        <div className="card">
          <h3>Department List</h3>

          <table>
            <thead>
              <tr>
                <th>Sl no.</th>
                <th>ID</th>
                <th>Code</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {departments.map((dept, index) => (
                <tr key={dept.Id}>
                  <td>{index + 1}</td>
                  <td>{dept.Id}</td>
                  <td>{dept.code}</td>
                  <td>{dept.name}</td>

                  <td>
                    <button onClick={() => openEdit(dept)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Edit Department</h3>

              <input
                type="text"
                value={editingDept.name}
                onChange={(e) =>
                  setEditingDept({ ...editingDept, name: e.target.value })
                }
              />

              <input
                type="text"
                value={editingDept.code}
                onChange={(e) =>
                  setEditingDept({ ...editingDept, code: e.target.value })
                }
              />

              <div className="modal-actions">
                <button onClick={handleUpdate}>Save</button>

                <button onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentsPage;
