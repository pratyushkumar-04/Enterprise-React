/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  getAllStudents, updateStudentStatus, getStudentDocument,
  getStudentImage, editStudent
} from "../../../Services/StudentService";
import { getDepartments } from "../../../Services/DepartmentService";
import { getCoursesByDept } from "../../../Services/CourseService";
import { getBranchesByCourse } from "../../../Services/BranchService";
import "../../../styles/StudentList.css"
import Dashboard from "../Dashboard"
import Loader from "../../../Components/common/Loader";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [semesterFilter, setSemesterFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 2;
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [imageUrls, setImageUrls] = useState({});
  const [editStudentData, setEditStudentData] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [sections, setSections] = useState([]);


  useEffect(() => {
    fetchStudents();
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const res = await getDepartments();
      setDepartments(res);
    } catch (err) {
      console.error("Failed to load departments");
    }
  };


  const fetchStudents = async () => {
    try {
      const data = await getAllStudents();
      console.log("API RESPONSE:", data);
      setStudents(data);
      loadImages(data);
    } catch (err) {
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocument = async (studentId, type) => {
    try {
      const response = await getStudentDocument(studentId, type);

      const blob = new Blob([response.data], { type: "application/pdf" });

      const fileURL = window.URL.createObjectURL(blob);

      window.open(fileURL, "_blank");
    } catch (error) {
      console.error("Error opening document:", error);
    }
  };

  const loadImages = async (studentsList) => {
    const urls = {};

    for (const student of studentsList) {
      try {
        const res = await getStudentImage(student.id);
        const imageUrl = URL.createObjectURL(res.data);
        urls[student.id] = imageUrl;
      } catch (err) {
        console.error("Image load error:", err);
      }
    }

    setImageUrls(urls);
  };

  const handleDepartmentChange = async (e) => {
    const deptId = e.target.value;

    setEditStudentData({
      ...editStudentData,
      departmentId: deptId,
      courseId: "",
      branchId: ""
    });

    setCourses([]);
    setBranches([]);

    if (deptId) {
      try {
        const res = await getCoursesByDept(deptId);
        setCourses(res);
      } catch (err) {
        console.error("Failed to load courses", err);
      }
    }
  };

  const handleCourseChange = async (e) => {
    const courseId = e.target.value;

    setEditStudentData({
      ...editStudentData,
      courseId: courseId,
      branchId: ""
    });

    setBranches([]);

    if (courseId) {
      try {
        const res = await getBranchesByCourse(courseId);
        setBranches(res);
      } catch (err) {
        console.error("Failed to load branches", err);
      }
    }
  };

  const handleBranchChange = (e) => {
    const branchId = e.target.value;

    setEditStudentData({
      ...editStudentData,
      branchId: branchId
    });
  };

  const filteredStudents = students
    .filter((student) => {
      return (
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .filter((student) => {
      return (
        (semesterFilter ? student.currentSemester === Number(semesterFilter) : true) &&
        (courseFilter ? student.courseName === courseFilter : true) &&
        (statusFilter ? student.status === statusFilter : true)
      );
    });

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handleSave = async () => {
    try {
      if (!editStudentData.name || !editStudentData.email) {
        alert("Name and Email are required");
        return;
      }

      // Construct clean payload (important for nested address safety)
      const payload = {
        name: editStudentData.name,
        email: editStudentData.email,
        phone: editStudentData.phone,
        fatherName: editStudentData.fatherName,
        motherName: editStudentData.motherName,
        gender: editStudentData.gender,
        dateOfBirth: editStudentData.dateOfBirth,
        currentSemester: editStudentData.currentSemester,
        departmentId: editStudentData.departmentId,
        courseId: editStudentData.courseId,
        branchId: editStudentData.branchId,
        sectionId: editStudentData.sectionId,
        address: {
          addressLine1: editStudentData.address?.addressLine1 || "",
          addressLine2: editStudentData.address?.addressLine2 || "",
          city: editStudentData.address?.city || "",
          state: editStudentData.address?.state || "",
          pincode: editStudentData.address?.pincode || "",
        },
      };

      await editStudent(editStudentData.id, payload);

      setEditStudentData(null);
      fetchStudents();

      setToast("Student updated successfully");
      setTimeout(() => setToast(null), 3000);

    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed");
    }
  };


  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;

  return (
    <div className="student-container">
      {/* <h2>Student Master</h2> */}
      {loading && <Loader overlay={true} />}

      <div className="top-bar">
        <input
          type="text"
          placeholder="Search by name, email, admission..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <div className="filters">
          <div className="filter-bar">
            <select onChange={(e) => setSemesterFilter(e.target.value)}>
              <option value="">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>

            <select onChange={(e) => setCourseFilter(e.target.value)}>
              <option value="">All Courses</option>
              <option value="B.Tech">B.Tech</option>
              <option value="BBA">BBA</option>
            </select>

            <select onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="SUSPENDED">SUSPENDED</option>
              <option value="DROPPED">DROPPED</option>
              <option value="PASSED">PASSED</option>
            </select>

          </div>
        </div>
      </div>


      <table className="student-table">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Admission No</th>
            <th>Course</th>
            <th>Semester</th>
            <th>Section</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.length > 0 ? (
            currentStudents.map((student) => (
              <tr key={student.id}>
                <td>
                  <img
                    src={imageUrls[student.id]}
                    alt="profile"
                    className="student-avatar"
                  />
                </td>

                <td>{student.name}</td>
                <td>{student.admissionNumber}</td>
                <td>
                  {student.courseName} - {student.branchName}
                </td>
                <td>{student.currentSemester}</td>
                <td>{student.sectionname}</td>
                <td>{student.phone}</td>


                <td>
                  <span className={`status-badge ${student.status.toLowerCase()}`}>
                    {student.status}
                  </span>

                </td>

                <td>
                  <select
                    value={student.status}
                    onChange={(e) => {
                      setConfirmDialog({
                        studentId: student.id,
                        newStatus: e.target.value
                      });
                    }}

                    className="status-select"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="DROPPED">DROPPED</option>
                    <option value="PASSED">PASSED</option>
                  </select>

                  <button onClick={() => setSelectedStudent(student)} className="action-btn view-btn">
                    View
                  </button>

                  <button
                    className="action-btn edit-btn"
                    onClick={() => setEditStudentData(student)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No Students Found</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active-page" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>




      {selectedStudent && (
        <div className="modal-overlay">
          <div className="modal-card">

            {/* 1. Image Section (Full width at top) */}
            <div className="card-image-container">
              <img
                src={imageUrls[selectedStudent.id]}
                alt={selectedStudent.name}
                className="card-hero-image"
              />
              {/* Floating Close Button */}
              <button
                className="card-close-btn"
                onClick={() => setSelectedStudent(null)}
              >
                ✕
              </button>
            </div>

            {/* 2. Content Section */}
            <div className="card-content">
              <h2 className="student-name">{selectedStudent.name}</h2>
              <p className="student-role">{selectedStudent.courseName} Student</p>

              <div className="divider"></div>

              <div className="info-list">
                <div className="info-item">
                  <span className="label">ID No.</span>
                  <span className="value">{selectedStudent.admissionNumber}</span>
                </div>
                <div className="info-item">
                  <span className="label">Branch</span>
                  <span className="value">{selectedStudent.branchName}</span>
                </div>
                <div className="info-item">
                  <span className="label">Semester</span>
                  <span className="value">{selectedStudent.currentSemester}</span>
                </div>
                <div className="info-item">
                  <span className="label">Contact</span>
                  <span className="value">{selectedStudent.phone}</span>
                </div>
                <div className="info-item">
                  <span className="label">Email</span>
                  <span className="value">{selectedStudent.email}</span>
                </div>
                <div className="divider"></div>

                <h3 className="document-title">Documents</h3>

                <div className="document-buttons">
                  <button
                    onClick={() => handleViewDocument(selectedStudent.id, "adhaar")}
                    className="doc-btn"
                  >
                    View Adhaar
                  </button>

                  <button
                    onClick={() => handleViewDocument(selectedStudent.id, "tenth")}
                    className="doc-btn"
                  >
                    View 10th Marksheet
                  </button>

                  <button
                    onClick={() => handleViewDocument(selectedStudent.id, "twelth")}
                    className="doc-btn"
                  >
                    View 12th Marksheet
                  </button>
                </div>
              </div>

              {/* Optional Status Footer */}
              <div className={`status-bar ${selectedStudent.status.toLowerCase()}`}>
                Currently {selectedStudent.status}
              </div>
            </div>

          </div>
        </div>
      )}

      {editStudentData && (
        <div className="modal-overlay">
          <div className="edit-modal-card">

            <div className="edit-modal-header">
              <h2>Edit Student</h2>

              <button
                className="edit-close-icon"
                onClick={() => setEditStudentData(null)}
              >
                ✕
              </button>
            </div>

            <div className="edit-form-grid">

              {/* Basic Info */}
              <input
                type="text"
                placeholder="Name"
                value={editStudentData.name || ""}
                onChange={(e) =>
                  setEditStudentData({
                    ...editStudentData,
                    name: e.target.value
                  })
                }
              />

              <input
                type="email"
                placeholder="Email"
                value={editStudentData.email || ""}
                onChange={(e) =>
                  setEditStudentData({
                    ...editStudentData,
                    email: e.target.value
                  })
                }
              />

              <input
                type="text"
                placeholder="Phone"
                value={editStudentData.phone || ""}
                onChange={(e) =>
                  setEditStudentData({
                    ...editStudentData,
                    phone: e.target.value
                  })
                }
              />

              {/* Gender */}
              <select
                value={editStudentData.gender || ""}
                onChange={(e) =>
                  setEditStudentData({
                    ...editStudentData,
                    gender: e.target.value
                  })
                }
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>

              {/* DOB */}
              <input
                type="date"
                value={editStudentData.dateOfBirth || ""}
                onChange={(e) =>
                  setEditStudentData({
                    ...editStudentData,
                    dateOfBirth: e.target.value
                  })
                }
              />

              {/* Semester */}
              <select
                value={editStudentData.currentSemester || ""}
                onChange={(e) =>
                  setEditStudentData({
                    ...editStudentData,
                    currentSemester: Number(e.target.value)
                  })
                }
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>

              {/* Department */}
              <select
                value={editStudentData.departmentId || ""}
                onChange={handleDepartmentChange}
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.Id} value={d.Id}>
                    {d.name}
                  </option>

                ))}
              </select>

              {/* Course */}
              <select
                disabled={!editStudentData.departmentId}
                value={editStudentData.courseId || ""}
                onChange={handleCourseChange}
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Branch */}
              <select
                disabled={!editStudentData.courseId}
                value={editStudentData.branchId || ""}
                onChange={handleBranchChange}
              >
                <option value="">Select Branch</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>

              {/* Address */}
              <h4>Address</h4>

              <input
                type="text"
                placeholder="Address Line 1"
                value={editStudentData.address?.addressLine1 || ""}
                onChange={(e) =>
                  setEditStudentData({
                    ...editStudentData,
                    address: {
                      ...editStudentData.address,
                      addressLine1: e.target.value
                    }
                  })
                }
              />

              <input
                type="text"
                placeholder="City"
                value={editStudentData.address?.city || ""}
                onChange={(e) =>
                  setEditStudentData({
                    ...editStudentData,
                    address: {
                      ...editStudentData.address,
                      city: e.target.value
                    }
                  })
                }
              />

              <input
                type="text"
                placeholder="State"
                value={editStudentData.address?.state || ""}
                onChange={(e) =>
                  setEditStudentData({
                    ...editStudentData,
                    address: {
                      ...editStudentData.address,
                      state: e.target.value
                    }
                  })
                }
              />

              <input
                type="text"
                placeholder="Pincode"
                value={editStudentData.address?.pincode || ""}
                onChange={(e) =>
                  setEditStudentData({
                    ...editStudentData,
                    address: {
                      ...editStudentData.address,
                      pincode: e.target.value
                    }
                  })
                }
              />

              {/* Actions */}
              <div className="edit-modal-actions">
                <button className="save-btn" onClick={handleSave}>
                  Save Student
                </button>

              </div>
            </div>
          </div>
        </div>
      )}


      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}

      {confirmDialog && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <h3>Confirm Status Change</h3>
            <p>
              Are you sure you want to change status to
              <strong> {confirmDialog.newStatus}</strong>?
            </p>

            <div className="confirm-actions">
              <button
                className="cancel-btn"
                onClick={() => setConfirmDialog(null)}
              >
                Cancel
              </button>

              <button
                className="confirm-btn"
                onClick={async () => {
                  try {
                    setUpdating(true);
                    await updateStudentStatus(confirmDialog.studentId, {
                      status: confirmDialog.newStatus
                    });

                    setConfirmDialog(null);
                    setToast("Status updated successfully");
                    fetchStudents();
                    setTimeout(() => setToast(null), 3000);
                  }
                  finally {
                    setUpdating(false);
                    setConfirmDialog(null);
                  }
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}



    </div>
  );
};

export default StudentList;
