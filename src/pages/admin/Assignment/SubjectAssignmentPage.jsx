/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import AssignmentFilterPanel from "./components/AssignmentFilterPanel.jsx";
import SubjectAssignmentTable from "./components/SubjectAssignmentTable.jsx";
import ExistingAssignmentTable from "./components/ExistingAssignmentTable.jsx";
import ReassignFacultyModal from "./components/ReassignFacultyModal.jsx";
import RemoveAssignmentDialog from "./components/RemoveAssignmentDialog.jsx";
import { getDepartments } from "../../../Services/DepartmentService";
import { getCoursesByDept } from "../../../Services/CourseService";
import { getBranchesByCourse } from "../../../Services/BranchService";
import { getSections } from "../../../Services/SectionService";
import { getSubjects } from "../../../Services/SubjectService.js";
import { getFacultiesByBranch } from "../../../Services/FacultyService.js";
import toast from "react-hot-toast";
import "../../../styles/FacultyAssignment.css";

import {
  getAssignments,
  createAssignment,
  reassignFaculty,
  deleteAssignment,
} from "../../../Services/SubjectAssignmentService.js";
import Loader from "../../../Components/common/Loader.jsx";

export default function SubjectFacultySectionAssignmentPage() {
  const token = localStorage.getItem("token");

  const [filters, setFilters] = useState({
    departmentId: "",
    courseId: "",
    branchId: "",
    semester: "",
    sectionId: "",
  });

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [assignmentToRemove, setAssignmentToRemove] = useState(null);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const res = await getDepartments(token);
      setDepartments(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDepartmentChange = async (departmentId) => {
    setFilters({
      departmentId,
      courseId: "",
      branchId: "",
      semester: "",
      sectionId: "",
    });
    setCourses([]);
    setBranches([]);
    setSections([]);
    setSubjects([]);
    setAssignments([]);

    setLoading(true);
    try {
      const res = await getCoursesByDept(departmentId, token);
      setCourses(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = async (courseId) => {
    setFilters((prev) => ({
      ...prev,
      courseId,
      branchId: "",
      sectionId: "",
    }));
    setBranches([]);
    setSections([]);
    setSubjects([]);
    setAssignments([]);

    setLoading(true);
    try {
      const res = await getBranchesByCourse(courseId, token);
      setBranches(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBranchChange = async (branchId) => {
    setFilters((prev) => ({
      ...prev,
      branchId,
      sectionId: "",
    }));
    setSections([]);
    setSubjects([]);
    setAssignments([]);

    setLoading(true);
    try {
      const facultyRes = await getFacultiesByBranch(branchId, token);
      setFaculties(facultyRes);

      if (filters.semester) {
        await loadSemesterData(branchId, filters.semester);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSemesterData = async (branchId, semester) => {
    try {
      const [sectionRes, subjectRes] = await Promise.all([
        getSections(branchId, semester, token),
        getSubjects(branchId, semester, token),
      ]);

      console.log(subjectRes);
      setSections(sectionRes);
      setSubjects(Array.isArray(subjectRes.data) ? subjectRes.data : []);
    } catch (err) {
      console.error(err);
    }
  };
  const handleSemesterChange = async (semester) => {
    setFilters((prev) => ({
      ...prev,
      semester,
      sectionId: "",
    }));
    setSections([]);
    setSubjects([]);
    setAssignments([]);

    if (filters.branchId) {
      setLoading(true);
      try {
        await loadSemesterData(filters.branchId, semester);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSectionChange = async (sectionId) => {
    setFilters((prev) => ({ ...prev, sectionId }));
    setLoading(true);
    try {
      const data = await getAssignments(sectionId, filters.semester);
      setAssignments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshAssignments = async (sectionId = filters.sectionId) => {
    if (!sectionId) return;
    setLoading(true);
    try {
      const data = await getAssignments(sectionId, filters.semester);
      setAssignments(Array.isArray(data) ? data : []);
    } catch (err) {
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async (assignmentId) => {
    setLoading(true);
    try {
      await deleteAssignment(assignmentId, token);
      toast.success("Assignment removed successfully");
      setShowRemoveDialog(false);
      setAssignmentToRemove(null);
      await refreshAssignments();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to remove assignment",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (payload) => {
    setLoading(true);
    try {
      await createAssignment(payload, token);
      toast.success("Faculty assigned successfully");
      await refreshAssignments(payload.sectionId);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to assign faculty");
    } finally {
      setLoading(false);
    }
  };

  const handleReassignSubmit = async (newFacultyId) => {
    setLoading(true);
    try {
      await reassignFaculty(
        { assignmentId: selectedAssignment.id, newFacultyId },
        token,
      );
      toast.success("Faculty reassigned successfully");
      setShowModal(false);
      setSelectedAssignment(null);
      await refreshAssignments();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to reassign faculty");
    } finally {
      setLoading(false);
    }
  };

  const handleReassign = (assignment) => {
    setSelectedAssignment(assignment);
    setShowModal(true);
  };
  const openRemoveDialog = (assignment) => {
    setAssignmentToRemove(assignment);
    setShowRemoveDialog(true);
  };

  return (
    <div className="erp-page">
      {loading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}
      <div className="erp-card">
        <div className="erp-header">Subject → Faculty → Section Assignment</div>

        <div className="erp-body">
          <AssignmentFilterPanel
            filters={filters}
            departments={departments}
            courses={courses}
            branches={branches}
            sections={sections}
            onDepartmentChange={handleDepartmentChange}
            onCourseChange={handleCourseChange}
            onBranchChange={handleBranchChange}
            onSemesterChange={handleSemesterChange}
            onSectionChange={handleSectionChange}
          />

          {filters.sectionId && (
            <>
              <SubjectAssignmentTable
                subjects={subjects}
                faculties={faculties}
                assignments={assignments}
                filters={filters}
                onAssign={handleAssign}
              />

              <ExistingAssignmentTable
                assignments={assignments}
                onReassign={handleReassign}
                onDelete={openRemoveDialog}
              />
            </>
          )}
        </div>
      </div>

      {showRemoveDialog && (
        <RemoveAssignmentDialog
          assignment={assignmentToRemove}
          onClose={() => {
            setShowRemoveDialog(false);
            setAssignmentToRemove(null);
          }}
          onConfirm={confirmDelete}
        />
      )}

      {showModal && (
        <ReassignFacultyModal
          assignment={selectedAssignment}
          faculties={faculties}
          onClose={() => setShowModal(false)}
          onSubmit={handleReassignSubmit}
        />
      )}
    </div>
  );
}
