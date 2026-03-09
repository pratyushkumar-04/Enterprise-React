import React, { useEffect, useState } from "react";
import { getAllSections } from "../../../Services/SectionService";
import {
  getStudentsBySection,
  generateRollNumbers,
} from "../../../Services/StudentService";

function GenerateRollNumbers() {
  const [sections, setSections] = useState([]);
  const [sectionId, setSectionId] = useState("");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const data = await getAllSections();
      setSections(data);
    } catch (error) {
      console.error("Error loading sections", error);
    }
  };

  const loadStudents = async () => {
    if (!sectionId) return;

    try {
      const data = await getStudentsBySection(sectionId);
      setStudents(data);
    } catch (error) {
      console.error("Error loading students", error);
    }
  };

  const handleGenerate = async () => {
    if (!window.confirm("Generate roll numbers for this section?")) return;

    try {
      await generateRollNumbers(sectionId);
      alert("Roll numbers generated successfully");
      loadStudents();
    } catch (error) {
      console.error("Error generating roll numbers", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Generate Roll Numbers</h2>

      <div className="row mb-3">
        <div className="col-md-4">
          <select
            className="form-control"
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
          >
            <option value="">Select Section</option>

            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <button className="btn btn-primary" onClick={loadStudents}>
            Load Students
          </button>
        </div>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Admission No</th>
            <th>Name</th>
            <th>Roll Number</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.admissionNumber}</td>
              <td>
                {student.firstName} {student.lastName}
              </td>
              <td>{student.rollNumber || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {students.length > 0 && (
        <button className="btn btn-success" onClick={handleGenerate}>
          Generate Roll Numbers
        </button>
      )}
    </div>
  );
}

export default GenerateRollNumbers;