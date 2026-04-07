/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import Loader from "../../../Components/common/Loader";
import { getDepartments } from "../../../Services/DepartmentService";
import { getCoursesByDept } from "../../../Services/CourseService";
import { getBranchesByCourse } from "../../../Services/BranchService";
import { getSections } from "../../../Services/SectionService";
import { createAssignment } from "../../../Services/SubjectAssignmentService";
import { getFacultiesByBranch } from "../../../Services/FacultyService";

import { getSubjects } from "../../../Services/SubjectService";

import { getAssignments } from "../../../Services/SubjectAssignmentService";

import { createTimetableEntry } from "../../../Services/TimetableService";

import "../../../styles/CreateTimetable.css";

const days = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const periods = [
  {
    value: 1,
    label: "Period 1 (09:00 - 10:00)",
    start: "09:00:00",
    end: "10:00:00",
  },
  {
    value: 2,
    label: "Period 2 (10:00 - 11:00)",
    start: "10:00:00",
    end: "11:00:00",
  },
  {
    value: 3,
    label: "Period 3 (11:15 - 12:15)",
    start: "11:15:00",
    end: "12:15:00",
  },
  {
    value: 4,
    label: "Period 4 (12:15 - 01:15)",
    start: "12:15:00",
    end: "13:15:00",
  },
  {
    value: 5,
    label: "Period 5 (02:00 - 03:00)",
    start: "14:00:00",
    end: "15:00:00",
  },
  {
    value: 6,
    label: "Period 6 (03:00 - 04:00)",
    start: "15:00:00",
    end: "16:00:00",
  },
  {
    value: 7,
    label: "Period 7 (04:00 - 05:00)",
    start: "16:00:00",
    end: "17:00:00",
  },
];

const CreateTimetable = () => {
  const [loading, setLoading] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assignedFaculties, setAssignedFaculties] = useState([]);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [facultyList, setFacultyList] = useState([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState("");

  const [selectedCourse, setSelectedCourse] = useState(null);

  const [form, setForm] = useState({
    departmentId: "",
    courseId: "",
    branchId: "",
    semester: "",
    sectionId: "",
    subjectId: "",
    assignmentId: "",
    dayOfWeek: "",
    periodNumber: "",
    roomNumber: "",
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  const totalSemesters = useMemo(() => {
    if (!selectedCourse) return 0;
    return selectedCourse.durationYears * 2;
  }, [selectedCourse]);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const res = await getDepartments();
      setDepartments(res);
      console.log(res);
    } catch (error) {
      toast.error("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentChange = async (departmentId) => {
    setForm({
      departmentId,
      courseId: "",
      branchId: "",
      sectionId: "",
      semester: "",
      subjectId: "",
      assignmentId: "",
      dayOfWeek: "",
      periodNumber: "",
      roomNumber: "",
    });

    setSelectedCourse(null);
    setCourses([]);
    setBranches([]);
    setSections([]);
    setSubjects([]);
    setAssignedFaculties([]);

    if (!departmentId) return;

    try {
      setLoading(true);
      const res = await getCoursesByDept(departmentId);
      setCourses(res);
    } catch (error) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = async (courseId) => {
    const course = courses.find((c) => c.id === courseId);

    setSelectedCourse(course || null);

    setForm((prev) => ({
      ...prev,
      courseId,
      branchId: "",
      sectionId: "",
      semester: "",
      subjectId: "",
      assignmentId: "",
    }));

    setBranches([]);
    setSections([]);
    setSubjects([]);
    setAssignedFaculties([]);

    if (!courseId) return;

    try {
      setLoading(true);
      const res = await getBranchesByCourse(courseId);
      setBranches(res);
    } catch (error) {
      toast.error("Failed to load branches");
    } finally {
      setLoading(false);
    }
  };

  const handleBranchChange = (branchId) => {
    setForm((prev) => ({
      ...prev,
      branchId,
      semester: "",
      sectionId: "",
      subjectId: "",
      assignmentId: "",
    }));

    setSections([]);
    setSubjects([]);
    setAssignedFaculties([]);
  };

  const handleSectionChange = async (sectionId) => {
    setForm((prev) => ({
      ...prev,
      sectionId,
      subjectId: "",
      assignmentId: "",
    }));

    setAssignedFaculties([]);
  };

  const handleSemesterChange = async (semester) => {
    setForm((prev) => ({
      ...prev,
      semester,
      sectionId: "",
      subjectId: "",
      assignmentId: "",
    }));

    setSections([]);
    setSubjects([]);
    setAssignedFaculties([]);

    if (!semester || !form.branchId) return;

    try {
      setLoading(true);

      const [sectionRes, subjectRes] = await Promise.all([
        getSections(form.branchId, semester),
        getSubjects(form.branchId, semester),
      ]);

      console.log(sectionRes);
      console.log(subjectRes.data);

      setSections(sectionRes);
      setSubjects(Array.isArray(subjectRes.data) ? subjectRes.data : []);
    } catch (error) {
      toast.error("Failed to load sections and subjects");
    } finally {
      setLoading(false);
    }
  };
  const handleSubjectChange = async (subjectId) => {
    setForm((prev) => ({
      ...prev,
      subjectId,
      assignmentId: "",
    }));

    setAssignedFaculties([]);

    if (!subjectId || !form.sectionId || !form.semester) return;

    try {
      setLoading(true);

      const res = await getAssignments(form.sectionId, form.semester);

      console.log("Assignments API:", res);

      const assignments = Array.isArray(res)
        ? res
        : Array.isArray(res.data)
          ? res.data
          : [];

      const filteredAssignments = assignments.filter(
        (a) => String(a.subjectId) === String(subjectId) && a.active,
      );

      setAssignedFaculties(filteredAssignments);

      if (!filteredAssignments.length) {
        toast.warning("No faculty assigned for selected subject and section");
      }
    } catch (error) {
      console.error("Assignment error:", error); // 👈 ADD THIS
      toast.error("Failed to load assigned faculties");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.assignmentId || !form.dayOfWeek || !form.periodNumber) {
      toast.warning("Please fill all required fields");
      return;
    }

    const selectedPeriod = periods.find(
      (p) => p.value === Number(form.periodNumber),
    );

    const payload = {
      assignmentId: form.assignmentId,
      dayOfWeek: form.dayOfWeek,
      periodNumber: Number(form.periodNumber),
      startTime: selectedPeriod.start,
      endTime: selectedPeriod.end,
      roomNumber: form.roomNumber,
    };

    try {
      setLoading(true);

      await createTimetableEntry(payload);

      toast.success("Timetable entry created successfully");

      setForm((prev) => ({
        ...prev,
        assignmentId: "",
        dayOfWeek: "",
        periodNumber: "",
        roomNumber: "",
      }));
    } catch (error) {
      toast.error(error?.response?.data || "Failed to create timetable entry");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-timetable-page">
      <div className="page-header">
        <h1>Create Timetable Entry</h1>
        <p>Select Branch → Semester → Section → Subject → Assigned Faculty</p>
      </div>

      <div className="timetable-form-card">
        <div className="form-grid">
          <div className="field">
            <label>Department</label>
            <select
              value={form.departmentId}
              onChange={(e) => handleDepartmentChange(e.target.value)}
            >
              <option value="">Select Department</option>

              {departments.map((department) => (
                <option key={department.Id} value={department.Id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Course</label>
            <select
              value={form.courseId}
              onChange={(e) => handleCourseChange(e.target.value)}
              disabled={!form.departmentId}
            >
              <option value="">Select Course</option>

              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Branch</label>
            <select
              value={form.branchId}
              onChange={(e) => handleBranchChange(e.target.value)}
              disabled={!form.courseId}
            >
              <option value="">Select Branch</option>

              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Semester</label>
            <select
              value={form.semester}
              onChange={(e) => handleSemesterChange(e.target.value)}
              disabled={!form.branchId}
            >
              <option value="">Select Semester</option>

              {Array.from(
                { length: totalSemesters },
                (_, index) => index + 1,
              ).map((semester) => (
                <option key={semester} value={semester}>
                  Semester {semester}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Section</label>
            <select
              value={form.sectionId}
              onChange={(e) => handleSectionChange(e.target.value)}
              disabled={!form.semester}
            >
              <option value="">Select Section</option>

              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Subject</label>
            <select
              value={form.subjectId}
              onChange={(e) => handleSubjectChange(e.target.value)}
              disabled={!form.semester}
            >
              <option value="">Select Subject</option>

              {subjects.map((subject) => (
                <option key={subject.Id} value={subject.Id}>
                  {subject.code} - {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field full-width">
            <label>Assigned Faculty</label>

            <div className="faculty-select-row">
              <select
                value={form.assignmentId}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    assignmentId: e.target.value,
                  }))
                }
                disabled={!form.subjectId}
              >
                <option value="">Select Faculty</option>

                {assignedFaculties.map((assignment) => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.facultyName} ({assignment.facultyCode})
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="assign-btn"
                onClick={async () => {
                  if (!form.branchId || !form.subjectId || !form.sectionId) {
                    toast.warning(
                      "Please select branch, semester, section and subject first",
                    );
                    return;
                  }

                  try {
                    setAssignLoading(true);

                    const facultyData = await getFacultiesByBranch(
                      form.branchId,
                    );

                    setFacultyList(facultyData || []);
                    setShowAssignModal(true);
                  } catch (error) {
                    toast.error("Failed to load faculty list");
                  } finally {
                    setAssignLoading(false);
                  }
                }}
              >
                Assign Faculty
              </button>
            </div>
          </div>

          <div className="field">
            <label>Day</label>
            <select
              value={form.dayOfWeek}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  dayOfWeek: e.target.value,
                }))
              }
            >
              <option value="">Select Day</option>

              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Period</label>
            <select
              value={form.periodNumber}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  periodNumber: e.target.value,
                }))
              }
            >
              <option value="">Select Period</option>

              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Room Number</label>
            <input
              type="text"
              placeholder="Ex: C-204"
              value={form.roomNumber}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  roomNumber: e.target.value,
                }))
              }
            />
          </div>
        </div>

        {form.assignmentId && (
          <div className="selected-summary">
            {(() => {
              const selected = assignedFaculties.find(
                (a) => a.id === form.assignmentId,
              );

              if (!selected) return null;

              return (
                <>
                  <h3>Selected Timetable Entry</h3>

                  <p>
                    <strong>{selected.subjectName}</strong> -{" "}
                    {selected.facultyName} ({selected.facultyCode})
                  </p>

                  <span>
                    Section {selected.sectionName} | Semester{" "}
                    {selected.semester} | {selected.academicYear}
                  </span>
                </>
              );
            })()}
          </div>
        )}

        <div className="actions">
          <button className="create-btn" onClick={handleCreate}>
            Create Timetable Entry
          </button>
        </div>
      </div>

      {showAssignModal && (
        <div className="modal-overlay">
          <div className="assign-modal">
            <div className="assign-modal-header">
              <h2>Assign Faculty</h2>

              <button
                className="close-btn"
                onClick={() => setShowAssignModal(false)}
              >
                ×
              </button>
            </div>

            <div className="assign-modal-body">
              <div className="field">
                <label>Select Faculty</label>

                <select
                  value={selectedFacultyId}
                  onChange={(e) => setSelectedFacultyId(e.target.value)}
                >
                  <option value="">Select Faculty</option>

                  {facultyList.map((faculty) => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name} - {faculty.designation} (
                      {faculty.facultyCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="selected-summary">
                <p>
                  Subject:{" "}
                  {
                    subjects.find(
                      (s) => String(s.Id) === String(form.subjectId),
                    )?.name
                  }
                </p>

                <p>
                  Section:{" "}
                  {
                    sections.find(
                      (s) => String(s.id) === String(form.sectionId),
                    )?.name
                  }
                </p>

                <p>Semester: {form.semester}</p>
              </div>
            </div>

            <div className="assign-modal-footer">
              <button
                className="secondary-btn"
                onClick={() => setShowAssignModal(false)}
              >
                Cancel
              </button>

              <button
                className="create-btn"
                onClick={async () => {
                  if (!selectedFacultyId) {
                    toast.warning("Please select a faculty");
                    return;
                  }

                  try {
                    setAssignLoading(true);

                    await createAssignment({
                      facultyId: selectedFacultyId,
                      subjectId: form.subjectId,
                      sectionId: form.sectionId,
                      semester: Number(form.semester),
                    });

                    toast.success("Faculty assigned successfully");

                    const assignments = await getAssignments(
                      form.sectionId,
                      form.semester,
                    );

                    const filteredAssignments = assignments.filter(
                      (a) => a.subjectId === form.subjectId && a.active,
                    );

                    setAssignedFaculties(filteredAssignments);
                    setShowAssignModal(false);
                    setSelectedFacultyId("");
                  } catch (error) {
                    toast.error(
                      error?.response?.data || "Failed to assign faculty",
                    );
                  } finally {
                    setAssignLoading(false);
                  }
                }}
              >
                {assignLoading ? "Assigning..." : "Assign Faculty"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { CreateTimetable };
