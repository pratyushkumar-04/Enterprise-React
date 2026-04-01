/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { getAllSections } from "../../../Services/SectionService";
import {
  getStudentsBySection,
  generateRollNumbers,
  getStudentImage,
  getStudentsWithoutRoll,
  assignRollNumber,
  getMaxRollNumber,
} from "../../../Services/StudentService";
import "../../../styles/GenerateRollNumbers.css";
import toast from "react-hot-toast";
import Loader from "../../../Components/common/Loader";

function GenerateRollNumbers() {
  const [sections, setSections] = useState([]);
  const [sectionId, setSectionId] = useState("");
  const [students, setStudents] = useState([]);
  const [studentImages, setStudentImages] = useState({});
  const [message, setMessage] = useState("");
  const [selectedSection, setSelectedSection] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [studentsWithoutRoll, setStudentsWithoutRoll] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const response = await getAllSections();
      console.log("Actual Array:", response.data);
      setSections(response.data);
    } catch (error) {
      console.error("Error loading sections", error);
    }
  };

  const loadStudentImages = async (studentsList) => {
    const imagePromises = studentsList.map(async (student) => {
      try {
        const response = await getStudentImage(student.id);
        return {
          id: student.id,
          url: URL.createObjectURL(response.data),
        };
      } catch {
        return { id: student.id, url: null };
      }
    });

    const results = await Promise.all(imagePromises);

    const images = {};
    results.forEach((r) => {
      if (r.url) images[r.id] = r.url;
    });

    setStudentImages(images);
  };

  const loadStudents = async () => {
    if (!sectionId) {
      toast("Please select a section first", { icon: "⚠️" });
      return;
    }

    try {
      setLoading(true);
      const response = await getStudentsBySection(sectionId);
      const data = response.data;

      setStudents(data);

      if (!data || data.length === 0) {
        toast("No students found in this section", { icon: "⚠️" });
      } else {
        loadStudentImages(data);
      }
    } catch (error) {
      toast.error("Failed to load students");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadStudentsWithoutRoll = async () => {
    if (!sectionId) {
      toast("Please select a section", { icon: "⚠️" });
      return;
    }

    try {
      setLoading(true);
      const response = await getStudentsWithoutRoll(sectionId);
      const data = response.data;

      setStudentsWithoutRoll(data);

      if (data.length === 0) {
        toast("All students already have roll numbers", { icon: "ℹ️" });
      }

      loadStudentImages(data);
    } catch (err) {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRoll = async (studentId) => {
    try {
      setLoading(true);
      const maxRoll = await getMaxRollNumber(sectionId);
      const nextRoll = (maxRoll.data || 0) + 1;

      await assignRollNumber(studentId, nextRoll);

      toast.success("Roll number assigned");

      await loadStudentsWithoutRoll(); // make sure it waits
    } catch (error) {
      toast.error("Failed to assign roll number");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      await generateRollNumbers(sectionId);
      toast.success("Roll numbers generated successfully");
      await loadStudents();
    } catch (error) {
      toast.error("Failed to generate roll numbers");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="roll-page container mt-4">
      {loading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}
      <h2>Generate Roll Numbers</h2>
      <div className="mode-toggle">
        <button
          className={!manualMode ? "mode-btn active" : "mode-btn"}
          onClick={() => setManualMode(false)}
        >
          Bulk Generate
        </button>

        <button
          className={manualMode ? "mode-btn active" : "mode-btn"}
          onClick={() => setManualMode(true)}
        >
          Manual Assign
        </button>
      </div>

      <div className="row mb-3">
        <div className="col-md-4">
          <select
            className="form-control"
            value={sectionId}
            onChange={(e) => {
              const id = e.target.value;
              setSectionId(id);

              const sectionObj = sections.find((s) => s.Id === id);
              setSelectedSection(sectionObj);
            }}
          >
            <option value="">Select Section</option>

            {Array.isArray(sections) &&
              sections.map((section) => (
                <option key={section.Id} value={section.Id}>
                  {section.branch.code}_{section.semester}_{section.name}
                </option>
              ))}
          </select>
        </div>

        {showConfirm && (
          <div className="modal-overlay">
            <div className="modal-box">
              <div className="modal-header">
                <h3>Generate Roll Numbers</h3>
              </div>

              <div className="modal-body">
                This will assign roll numbers sequentially for students in the
                selected section.
              </div>

              <div className="modal-actions">
                <button
                  className="modal-btn cancel"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>

                <button
                  className="modal-btn confirm"
                  onClick={async () => {
                    setShowConfirm(false);
                    await handleGenerate();
                  }}
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        )}

        {message && <div className="alert alert-warning mt-3">{message}</div>}

        {selectedSection && (
          <div className="section-summary">
            <h5>
              Section: {selectedSection.branch.code} - Semester{" "}
              {selectedSection.semester} - Section {selectedSection.name}
            </h5>

            <span className="student-count">Students: {students.length}</span>
          </div>
        )}

        {/* Table Section */}

        <div className="table-section">
          <div className="table-header">
            <h5>Students List</h5>

            <button
              className="load-btn"
              onClick={manualMode ? loadStudentsWithoutRoll : loadStudents}
            >
              Load Students
            </button>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="table-container">
              <table className="student-table">
                <thead>
                  <tr>
                    <th>Sl No</th>
                    <th>Photo</th>
                    <th>Admission No</th>
                    <th>Name</th>
                    <th>Branch</th>
                    <th>Semester</th>
                    <th>Phone</th>
                    <th>Roll Number</th>
                  </tr>
                </thead>

                <tbody>
                  {manualMode
                    ? studentsWithoutRoll.map((student, index) => (
                        <tr key={student.id}>
                          <td>{index + 1}</td>

                          <td>
                            {studentImages[student.id] ? (
                              <img
                                src={studentImages[student.id]}
                                alt="student"
                                className="student-avatar"
                              />
                            ) : (
                              <div className="avatar-placeholder">👤</div>
                            )}
                          </td>

                          <td>{student.admissionNumber}</td>

                          <td>{student.name}</td>

                          <td>{student.branchName}</td>

                          <td>{student.currentSemester}</td>

                          <td>{student.phone}</td>

                          <td>
                            <button
                              className="assign-btn"
                              onClick={() => handleAssignRoll(student.id)}
                            >
                              Assign
                            </button>
                          </td>
                        </tr>
                      ))
                    : students.map((student, index) => (
                        <tr key={student.id}>
                          <td>{index + 1}</td>
                          <td>
                            {studentImages[student.id] ? (
                              <img
                                src={studentImages[student.id]}
                                alt="student"
                                className="student-avatar"
                              />
                            ) : (
                              <div className="avatar-placeholder">👤</div>
                            )}
                          </td>

                          <td>{student.admissionNumber}</td>
                          <td>{student.name}</td>
                          <td>{student.branchName}</td>
                          <td>{student.currentSemester}</td>
                          <td>{student.phone}</td>
                          <td>{student.rollnumber ?? "-"}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          )}
          {!manualMode &&
            students.some(
              (s) => s.rollnumber === null || s.rollnumber === undefined,
            ) && (
              <div className="generate-btn-container">
                <button
                  className="generate-btn"
                  onClick={() => setShowConfirm(true)}
                >
                  Generate Roll Numbers
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default GenerateRollNumbers;
