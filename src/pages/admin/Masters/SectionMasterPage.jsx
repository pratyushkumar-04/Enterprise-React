/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { getDepartments } from "../../../Services/DepartmentService";
import { getCoursesByDept } from "../../../Services/CourseService";
import { getBranchesByCourse } from "../../../Services/BranchService";
import {
  getSections,
  addSection,
  editSection,
} from "../../../Services/SectionService";
import toast from "react-hot-toast";
import "../../../styles/SectionMaster.css";
import Loader from "../../../Components/common/Loader";

const SectionMasterPage = () => {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [sections, setSections] = useState([]);

  const [selectedDept, setSelectedDept] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [semester, setSemester] = useState("");

  const [name, setName] = useState("");

  const [editingSection, setEditingSection] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

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
      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        setCourses([]);
      }
    } catch (err) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const loadBranches = async (courseId) => {
    try {
      setLoading(true);
      const data = await getBranchesByCourse(courseId);
      if (Array.isArray(data)) {
        setBranches(data);
      } else {
        setBranches([]);
      }
    } catch (err) {
      toast.error("Failed to load branches");
    } finally {
      setLoading(false);
    }
  };

  const loadSections = async (branchId, sem) => {
    try {
      setLoading(true);
      const data = await getSections(branchId, sem);
      setSections(data);
    } catch (err) {
      toast.error("Failed to load sections");
    } finally {
      setLoading(false);
    }
  };

  const handleDeptChange = async (e) => {
    const deptId = e.target.value;
    setSelectedDept(deptId);
    setSelectedCourse("");
    setSelectedBranch("");
    setSections([]);

    if (deptId) await loadCourses(deptId);
  };

  const handleCourseChange = async (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    setSelectedBranch("");
    setSections([]);

    if (courseId) await loadBranches(courseId);
  };

  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
    setSections([]);
  };

  const handleSemesterChange = async (e) => {
    const sem = e.target.value;
    setSemester(sem);

    if (selectedBranch && sem) {
      await loadSections(selectedBranch, sem);
    }
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const req = {
        name,
        branchId: selectedBranch,
        semester,
      };
      await addSection(req);
      setName("");
      toast.success("Section Added!");
      await loadSections(selectedBranch, semester);
    } catch (err) {
      toast.error("Failed to add section");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const req = {
        name: editingSection.name,
        active: editingSection.active,
      };
      await editSection(editingSection.id, req);
      setShowModal(false);
      toast.success("Modified Successfully!");
      await loadSections(selectedBranch, semester);
    } catch (err) {
      toast.error("Failed to update section");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (section) => {
    setEditingSection(section);
    setShowModal(true);
  };

  return (
    <div className="section-master-page">
      {loading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}
      <div className="page-container">
        <h2>Section Master</h2>

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
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>
        )}

        {/* Add Section */}

        {semester && (
          <div className="card">
            <h3>Add Section</h3>

            <form onSubmit={handleAddSection}>
              <input
                type="text"
                placeholder="Section Name (A/B/C)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <button type="submit">Add Section</button>
            </form>
          </div>
        )}

        {/* Section Table */}

        {semester && (
          <div className="card">
            <h3>Sections</h3>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Section</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {sections.map((sec) => (
                  <tr key={sec.id}>
                    <td>{sec.id}</td>
                    <td>{sec.name}</td>
                    <td>{sec.active ? "Active" : "Inactive"}</td>

                    <td>
                      <button onClick={() => openEdit(sec)}>Edit</button>
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
              <h3>Edit Section</h3>

              <input
                type="text"
                value={editingSection.name}
                onChange={(e) =>
                  setEditingSection({ ...editingSection, name: e.target.value })
                }
              />

              <label>
                <input
                  type="checkbox"
                  checked={editingSection.active}
                  onChange={(e) =>
                    setEditingSection({
                      ...editingSection,
                      active: e.target.checked,
                    })
                  }
                />
                Active
              </label>

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

export default SectionMasterPage;
