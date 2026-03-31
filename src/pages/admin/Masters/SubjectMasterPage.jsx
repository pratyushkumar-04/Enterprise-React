/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { getDepartments } from "../../../Services/DepartmentService";
import { getCoursesByDept } from "../../../Services/CourseService";
import { getBranchesByCourse } from "../../../Services/BranchService";
import {
  getSubjects,
  addSubject,
  modifySubject,
  updateSubjectStatus,
} from "../../../Services/SubjectService.js";

import toast from "react-hot-toast";
import "../../../styles/SubjectMaster.css";
import Loader from "../../../Components/common/Loader.jsx";

const SubjectMasterPage = () => {
  // ================= STATE =================
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [confirmData, setConfirmData] = useState({
    show: false,
    subject: null,
  });

  const [selectedDept, setSelectedDept] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [selectedCourseObj, setSelectedCourseObj] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    credits: "",
    type: "THEORY",
  });

  const [editingSubject, setEditingSubject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ================= LOAD INITIAL =================
  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const data = await getDepartments();
      setDepartments(data);
    } catch (err) {
      toast.error("Failed to load departments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async (deptId) => {
    try {
      setLoading(true);
      const data = await getCoursesByDept(deptId);
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load courses");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadBranches = async (courseId) => {
    try {
      setLoading(true);
      const data = await getBranchesByCourse(courseId);
      setBranches(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load branches");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSubjects = async (branchId, sem) => {
    try {
      setLoading(true);
      const data = await getSubjects(branchId, sem);
      if (Array.isArray(data)) setSubjects(data);
      else if (Array.isArray(data?.data)) setSubjects(data.data);
      else setSubjects([]);
    } catch (err) {
      toast.error("Failed to load subjects");
      console.error(err);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= HANDLERS =================
  const handleDeptChange = async (e) => {
    const deptId = e.target.value;
    setSelectedDept(deptId);
    setSelectedCourse("");
    setSelectedBranch("");
    setSubjects([]);

    if (deptId) await loadCourses(deptId);
  };

  const handleCourseChange = async (e) => {
    const courseId = e.target.value;

    setSelectedCourse(courseId);
    setSelectedBranch("");
    setSubjects([]);

    const selected = courses.find((c) => c.id == courseId);
    setSelectedCourseObj(selected);

    if (courseId) await loadBranches(courseId);
  };

  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
    setSubjects([]);
  };

  const handleSemesterChange = async (e) => {
    const sem = e.target.value;
    setSemester(sem);

    if (selectedBranch && sem) {
      await loadSubjects(selectedBranch, sem);
    }
  };

  const getSemesters = () => {
    if (!selectedCourseObj || !selectedCourseObj.durationYears) return [];

    const totalSem = selectedCourseObj.durationYears * 2;

    return Array.from({ length: totalSem }, (_, i) => i + 1);
  };

  // ================= ADD SUBJECT =================
  const handleAddSubject = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const req = {
        name: formData.name,
        code: formData.code,
        credits: Number(formData.credits),
        type: formData.type,
        semester: Number(semester),
        status: "ACTIVE",
        branchId: selectedBranch,
      };
      await addSubject(req);
      toast.success("Subject Added!");
      setFormData({ name: "", code: "", credits: "", type: "THEORY" });
      await loadSubjects(selectedBranch, semester);
    } catch (err) {
      toast.error("Failed to add subject");
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT =================
  const openEdit = (sub) => {
    setEditingSubject(sub);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const req = {
        name: editingSubject.name,
        credits: Number(editingSubject.credits),
        type: editingSubject.type,
      };
      await modifySubject(editingSubject.Id, req);
      toast.success("Updated Successfully!");
      setShowModal(false);
      await loadSubjects(selectedBranch, semester);
    } catch (err) {
      toast.error("Failed to update subject");
    } finally {
      setLoading(false);
    }
  };

  // ================= STATUS =================
  // This just opens our custom dialog
  const toggleStatus = (sub) => {
    setConfirmData({ show: true, subject: sub });
  };

  // This actually calls the API
  const executeToggle = async () => {
    try {
      setLoading(true);
      const { subject } = confirmData;
      const newStatus = subject.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await updateSubjectStatus(subject.Id, newStatus);
      toast.success(`Subject ${newStatus.toLowerCase()}d!`);
      setConfirmData({ show: false, subject: null });
      await loadSubjects(selectedBranch, semester);
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="subject-master-page">
      {loading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}
      <div className="page-container">
        <h2>Subject Master</h2>

        {/* Department */}
        <select value={selectedDept} onChange={handleDeptChange}>
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.Id} value={d.Id}>
              {d.name}
            </option>
          ))}
        </select>

        {/* Course */}
        {selectedDept && (
          <select value={selectedCourse} onChange={handleCourseChange}>
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )}

        {/* Branch */}
        {selectedCourse && (
          <select value={selectedBranch} onChange={handleBranchChange}>
            <option value="">Select Branch</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        )}

        {/* Semester */}
        {selectedBranch && (
          <select value={semester} onChange={handleSemesterChange}>
            <option value="">Select Semester</option>

            {getSemesters().map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>
        )}

        {/* CUSTOM CONFIRMATION DIALOG */}
        {confirmData.show && (
          <div className="modal-overlay">
            <div className="modal confirm-modal">
              <h3>Change Status?</h3>
              <p>
                Are you sure you want to{" "}
                <strong>
                  {confirmData.subject.status === "ACTIVE"
                    ? "Inactivate"
                    : "Activate"}
                </strong>
                <br />"{confirmData.subject.name}"?
              </p>
              <div
                className="modal-actions"
                style={{ justifyContent: "center" }}
              >
                <button
                  onClick={executeToggle}
                  style={{
                    backgroundColor:
                      confirmData.subject.status === "ACTIVE"
                        ? "#e53e3e"
                        : "#38a169",
                    color: "white",
                  }}
                >
                  Yes, Proceed
                </button>
                <button
                  onClick={() => setConfirmData({ show: false, subject: null })}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ADD SUBJECT */}
        {semester && (
          <div className="card">
            <h3>Add Subject</h3>

            <form onSubmit={handleAddSubject}>
              <input
                type="text"
                placeholder="Subject Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="Subject Code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                required
              />

              <input
                type="number"
                placeholder="Credits"
                value={formData.credits}
                onChange={(e) =>
                  setFormData({ ...formData, credits: e.target.value })
                }
                required
              />

              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="THEORY">Theory</option>
                <option value="LAB">Lab</option>
                <option value="SEMINAR">Seminar</option>
                <option value="PROJECT">Project</option>
                <option value="ELECTIVE">Elective</option>
              </select>

              <button type="submit">Add Subject</button>
            </form>
          </div>
        )}

        {/* SUBJECT TABLE */}
        {semester && (
          <div className="card">
            <h3>Subjects</h3>

            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Credits</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {(Array.isArray(subjects) ? subjects : []).map((sub) => (
                  <tr key={sub.Id}>
                    <td>{sub.code}</td>
                    <td>{sub.name}</td>
                    <td>{sub.credits}</td>
                    <td>{sub.type}</td>
                    <td>{sub.status}</td>

                    <td>
                      <button onClick={() => openEdit(sub)}>Edit</button>

                      <button onClick={() => toggleStatus(sub)}>
                        {sub.status === "ACTIVE" ? "Inactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* EDIT MODAL */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Edit Subject</h3>

              <input
                type="text"
                value={editingSubject.name}
                onChange={(e) =>
                  setEditingSubject({
                    ...editingSubject,
                    name: e.target.value,
                  })
                }
              />

              <input
                type="number"
                value={editingSubject.credits}
                onChange={(e) =>
                  setEditingSubject({
                    ...editingSubject,
                    credits: e.target.value,
                  })
                }
              />

              <select
                value={editingSubject.type}
                onChange={(e) =>
                  setEditingSubject({
                    ...editingSubject,
                    type: e.target.value,
                  })
                }
              >
                <option value="THEORY">Theory</option>
                <option value="LAB">Lab</option>
                <option value="SEMINAR">Seminar</option>
                <option value="PROJECT">Project</option>
                <option value="ELECTIVE">Elective</option>
              </select>

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

export default SubjectMasterPage;
