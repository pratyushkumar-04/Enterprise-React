import React, { useEffect, useState } from "react";
import { getDepartments } from "../../../Services/DepartmentService";
import { getCoursesByDept, addCourse, editCourse } from "../../../Services/CourseService";
import toast from "react-hot-toast";
import"../../../styles/CourseMaster.css"

const CourseMasterPage = () => {

  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");

  const [courses, setCourses] = useState([]);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [duration, setDuration] = useState("");

  const [editingCourse, setEditingCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    const data = await getDepartments();
    setDepartments(data);
  };

  const loadCourses = async (deptId) => {
    const data = await getCoursesByDept(deptId);
    setCourses(data);
  };

  const handleDeptChange = (e) => {
    const deptId = e.target.value;
    setSelectedDept(deptId);
    if (deptId) loadCourses(deptId);
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();

    const req = {
      name,
      code,
      durration: duration,
      deptId: selectedDept
    };

    await addCourse(req);

    setName("");
    setCode("");
    setDuration("");
    toast.success("Course Added Successfully!")
    loadCourses(selectedDept);
  };

  const openEdit = (course) => {
    setEditingCourse(course);
    setShowModal(true);

    
  };

  const handleUpdate = async () => {

    const req = {
      name: editingCourse.name,
      code: editingCourse.code,
      durration: editingCourse.durationYears,
      deptId: selectedDept
    };

    await editCourse(editingCourse.id, req);

    setShowModal(false);
    toast.success("Course Modified!");
    loadCourses(selectedDept);
  };

  return (
    <div className="course-master-page">
    <div className="page-container">

      <h2>Course Master</h2>

      {/* Department Selector */}

      <div className="card">

        <label>Select Department</label>

        <select value={selectedDept} onChange={handleDeptChange}>
          <option value="">-- Select Department --</option>

          {departments.map((dept) => (
            <option key={dept.Id} value={dept.Id}>
              {dept.name}
            </option>
          ))}

        </select>

      </div>

      {/* Add Course */}

      {selectedDept && (

        <div className="card">

          <h3>Add Course</h3>

          <form onSubmit={handleAddCourse}>

            <input
              type="text"
              placeholder="Course Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Course Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Duration (Years)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />

            <button type="submit">
              Add Course
            </button>

          </form>

        </div>
      )}

      {/* Course Table */}

      {selectedDept && (

        <div className="card">

          <h3>Course List</h3>

          <table>

            <thead>
              <tr>
                <th>Sl No.</th>
                <th>ID</th>
                <th>Code</th>
                <th>Name</th>
                <th>Duration</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {courses.map((course,index) => (
                <tr key={course.id}>
                  <td>{index+1}</td>
                  <td>{course.id}</td>
                  <td>{course.code}</td>
                  <td>{course.name}</td>
                  <td>{course.durationYears}</td>

                  <td>
                    <button onClick={() => openEdit(course)}>
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

            <h3>Edit Course</h3>

            <input
              type="text"
              value={editingCourse.name}
              onChange={(e) =>
                setEditingCourse({ ...editingCourse, name: e.target.value })
              }
            />

            <input
              type="text"
              value={editingCourse.code}
              onChange={(e) =>
                setEditingCourse({ ...editingCourse, code: e.target.value })
              }
            />

            <input
              type="number"
              value={editingCourse.durationYears}
              onChange={(e) =>
                setEditingCourse({ ...editingCourse, durationYears: e.target.value })
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

export default CourseMasterPage;
