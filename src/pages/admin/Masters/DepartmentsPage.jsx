import React, { useEffect, useState } from "react";
import { getDepartments, addDepartment, editDepartment } from "../../../Services/DepartmentService";
import "../../../styles/Department.css"
import toast from "react-hot-toast";

const DepartmentsPage = () => {

  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const [editingDept, setEditingDept] = useState(null);
  const [showModal, setShowModal] = useState(false);

    const loadDepartments = async () => {
    const data = await getDepartments();
    setDepartments(data);
  };

  useEffect(() => {
    loadDepartments();
  }, []);



  const handleAdd = async (e) => {
    e.preventDefault();

    const req = {
      name,
      code
    };

    await addDepartment(req);

    setName("");
    setCode("");

    loadDepartments();
    toast.success("Department Added Successfully!")
  };

  const openEdit = (dept) => {
    setEditingDept(dept);
    setShowModal(true);
  };

  const handleUpdate = async () => {

    const req = {
      name: editingDept.name,
      code: editingDept.code
    };

    await editDepartment(editingDept.Id, req);

    setShowModal(false);
    loadDepartments();
    toast.success("Departemnt modified Successfully!")
  };

  return (
    <div className="dept-master-page">
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

          <button type="submit">
            Add Department
          </button>

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

            {departments.map((dept,index) => (
              <tr key={dept.Id}>
                <td>{index+1}</td>
                <td>{dept.Id}</td>
                <td>{dept.code}</td>
                <td>{dept.name}</td>

                <td>
                  <button onClick={() => openEdit(dept)}>
                    Edit
                  </button>
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

              <button onClick={handleUpdate}>
                Save
              </button>

              <button onClick={() => setShowModal(false)}>
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
    </div>
  );
};

export default DepartmentsPage;