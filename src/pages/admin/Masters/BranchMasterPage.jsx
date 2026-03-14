import React, { useEffect, useState } from "react";
import { getDepartments } from "../../../Services/DepartmentService";
import { getCoursesByDept } from "../../../Services/CourseService";
import { getBranchesByCourse, addBranch, editBranch } from "../../../Services/BranchService";
import toast from "react-hot-toast";
import "../../../styles/BranchMaster.css"

const BranchMasterPage = () => {

  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);

  const [selectedDept, setSelectedDept] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const [editingBranch, setEditingBranch] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    const data = await getDepartments();
    console.log (data);
    setDepartments(data);
  };

  const loadCourses = async (deptId) => {
    const data = await getCoursesByDept(deptId);
    setCourses(data);
  };

  const loadBranches = async (courseId) => {
    const data = await getBranchesByCourse(courseId);
    setBranches(data);
  };

  const handleDeptChange = async (e) => {
    const deptId = e.target.value;
    setSelectedDept(deptId);
    setSelectedCourse("");
    setBranches([]);

    if (deptId) {
      await loadCourses(deptId);
    }
  };

  const handleCourseChange = async (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);

    if (courseId) {
      await loadBranches(courseId);
    }
  };

  const handleAddBranch = async (e) => {
    e.preventDefault();

    const req = {
      name,
      code,
      courseId: selectedCourse
    };

    await addBranch(req);

    setName("");
    setCode("");
    toast.success("Branch Added!")

    loadBranches(selectedCourse);
  };

  const openEdit = (branch) => {
    setEditingBranch(branch);
    setShowModal(true);
  };

  const handleUpdate = async () => {

    const req = {
      name: editingBranch.name,
      code: editingBranch.code,
      courseId: selectedCourse
    };

    await editBranch(editingBranch.id, req);

    setShowModal(false);
    toast.success("Branch Modified!")
    loadBranches(selectedCourse);
  };

  return (
    <div className="branch-master-page">
    <div className="page-container">

      <h2>Branch Master</h2>

      {/* Department Selector */}

      <div className="card">

        <label>Department</label>

        <select value={selectedDept} onChange={handleDeptChange}>
          <option value="">Select Department</option>

          {departments.map((dept) => (
            <option key={dept.Id} value={dept.Id}>
              {dept.name}
            </option>
          ))}

        </select>

      </div>

      {/* Course Selector */}

      {selectedDept && (

        <div className="card">

          <label>Course</label>

          <select value={selectedCourse} onChange={handleCourseChange}>
            <option value="">Select Course</option>

            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}

          </select>

        </div>
      )}

      {/* Add Branch */}

      {selectedCourse && (

        <div className="card">

          <h3>Add Branch</h3>

          <form onSubmit={handleAddBranch}>

            <input
              type="text"
              placeholder="Branch Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Branch Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />

            <button type="submit">
              Add Branch
            </button>

          </form>

        </div>
      )}

      {/* Branch Table */}

      {selectedCourse && (

        <div className="card">

          <h3>Branch List</h3>

          <table>

            <thead>
              <tr>
                <th>Sl No.</th>
                <th>ID</th>
                <th>Code</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {branches.map((branch,index) => (
                <tr key={branch.id}>
                  <td>{index+1}</td>
                  <td>{branch.id}</td>
                  <td>{branch.code}</td>
                  <td>{branch.name}</td>

                  <td>
                    <button onClick={() => openEdit(branch)}>
                      Edit
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

      {/* Edit Modal */}

      {showModal && (

        <div className="modal-overlay">

          <div className="modal">

            <h3>Edit Branch</h3>

            <input
              type="text"
              value={editingBranch.name}
              onChange={(e) =>
                setEditingBranch({ ...editingBranch, name: e.target.value })
              }
            />

            <input
              type="text"
              value={editingBranch.code}
              onChange={(e) =>
                setEditingBranch({ ...editingBranch, code: e.target.value })
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

export default BranchMasterPage;
