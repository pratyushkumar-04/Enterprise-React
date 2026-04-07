/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-hot-toast";
import Loader from "../../../Components/common/Loader";

import { getDepartments } from "../../../Services/DepartmentService";
import { getCoursesByDept } from "../../../Services/CourseService";
import { getBranchesByCourse } from "../../../Services/BranchService";
import { getSections } from "../../../Services/SectionService";

import { getSectiontimetable } from "../../../Services/TimetableService";

import "../../../styles/AdminSectionTimetable.css";

const days = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const periods = [
  { value: 1, label: "09:00 - 10:00" },
  { value: 2, label: "10:00 - 11:00" },
  { value: 3, label: "11:15 - 12:15" },
  { value: 4, label: "12:15 - 01:15" },
  { value: 5, label: "02:00 - 03:00" },
  { value: 6, label: "03:00 - 04:00" },
  { value: 7, label: "04:00 - 05:00" },
];

const AdminSectionTimetable = () => {
  const [loading, setLoading] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [sections, setSections] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState(null);

  const [filters, setFilters] = useState({
    departmentId: "",
    courseId: "",
    branchId: "",
    semester: "",
    sectionId: "",
  });
  const timetableRef = useRef();

  const [timetable, setTimetable] = useState([]);

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
      setDepartments(res.data || res);
    } catch (error) {
      toast.error("Failed to load departments");
    } finally {
      setLoading(false);
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
    setTimetable([]);
    setSelectedCourse(null);

    if (!departmentId) return;

    try {
      setLoading(true);
      const res = await getCoursesByDept(departmentId);
      setCourses(res.data || res);
    } catch (error) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = async (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    setSelectedCourse(course || null);

    setFilters((prev) => ({
      ...prev,
      courseId,
      branchId: "",
      semester: "",
      sectionId: "",
    }));

    setBranches([]);
    setSections([]);
    setTimetable([]);

    if (!courseId) return;

    try {
      setLoading(true);
      const res = await getBranchesByCourse(courseId);
      setBranches(res.data || res);
    } catch (error) {
      toast.error("Failed to load branches");
    } finally {
      setLoading(false);
    }
  };

  const handleBranchChange = (branchId) => {
    setFilters((prev) => ({
      ...prev,
      branchId,
      semester: "",
      sectionId: "",
    }));

    setSections([]);
    setTimetable([]);
  };

  const handleSemesterChange = async (semester) => {
    setFilters((prev) => ({
      ...prev,
      semester,
      sectionId: "",
    }));

    setSections([]);
    setTimetable([]);

    if (!semester || !filters.branchId) return;

    try {
      setLoading(true);
      const sectionData = await getSections(filters.branchId, semester);
      setSections(sectionData || []);
    } catch (error) {
      toast.error("Failed to load sections");
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = async (sectionId) => {
    setFilters((prev) => ({
      ...prev,
      sectionId,
    }));

    if (!sectionId) {
      setTimetable([]);
      return;
    }

    try {
      setLoading(true);
      const res = await getSectiontimetable(sectionId);
      setTimetable(res.data || res);
    } catch (error) {
      toast.error("Failed to load timetable");
      setTimetable([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const element = timetableRef.current;

      const canvas = await html2canvas(element, {
        scale: 2, // 🔥 improves quality
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("landscape", "mm", "a4");

      const pageWidth = 297; // A4 landscape width
      const pageHeight = 210;

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let y = 10;

      // Add title
      pdf.setFontSize(14);
      pdf.text(`Timetable - Semester ${filters.semester}` , 10, y);

      y += 5;

      pdf.addImage(imgData, "PNG", 0, y, imgWidth, imgHeight);

      pdf.save(`timetable-sem-${filters.semester}.pdf`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to download PDF");
    }
  };

  const getCellData = (day, period) => {
    return timetable.find(
      (item) =>
        item.dayOfWeek === day && Number(item.periodNumber) === Number(period),
    );
  };

  const formatDay = (day) => {
    return day.charAt(0) + day.slice(1).toLowerCase();
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-section-timetable-page">
      <div className="page-container">
        <div className="page-header">
          <h1>Section Timetable</h1>
          <p>Select branch, semester and section to view timetable</p>
        </div>

        <div className="filter-card">
          <div className="filter-grid">
            <div className="field">
              <label>Department</label>
              <select
                value={filters.departmentId}
                onChange={(e) => handleDepartmentChange(e.target.value)}
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.Id} value={d.Id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Course</label>
              <select
                value={filters.courseId}
                onChange={(e) => handleCourseChange(e.target.value)}
                disabled={!filters.departmentId}
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Branch</label>
              <select
                value={filters.branchId}
                onChange={(e) => handleBranchChange(e.target.value)}
                disabled={!filters.courseId}
              >
                <option value="">Select Branch</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Semester</label>
              <select
                value={filters.semester}
                onChange={(e) => handleSemesterChange(e.target.value)}
                disabled={!filters.branchId}
              >
                <option value="">Select Semester</option>

                {Array.from(
                  { length: totalSemesters },
                  (_, index) => index + 1,
                ).map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Section</label>
              <select
                value={filters.sectionId}
                onChange={(e) => handleSectionChange(e.target.value)}
                disabled={!filters.semester}
              >
                <option value="">Select Section</option>
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {filters.sectionId && timetable.length === 0 && (
          <div className="empty-state">No timetable found for this section</div>
        )}

        {filters.sectionId && (
          <div className="timetable-card">
            <div className="timetable-header">
              <h2>
                {branches.find((s) => s.id == filters.branchId)?.name} -
                Semester {filters.semester} - Section{" "}
                {sections.find((s) => s.id === filters.sectionId)?.name}
              </h2>

              <button className="download-btn" onClick={handleDownloadPDF}>
                ⬇ Download PDF
              </button>
            </div>
            <div ref={timetableRef} className="timetable-wrapper">
              <table className="timetable-table">
                <thead>
                  <tr>
                    <th className="time-column">Time</th>
                    {days.map((day) => (
                      <th key={day}>{formatDay(day)}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {periods.map((period) => (
                    <tr key={period.value}>
                      <td className="time-cell">
                        <div className="period-title">
                          Period {period.value}
                        </div>
                        <div className="period-time">{period.label}</div>
                      </td>

                      {days.map((day) => {
                        const slot = getCellData(day, period.value);

                        return (
                          <td key={`${day}-${period.value}`}>
                            {slot ? (
                              <div className="slot-card">
                                <div className="slot-subject">
                                  {slot.subjectName}
                                </div>

                                <div className="slot-meta">
                                  <div className="faculty">
                                    {slot.facultyName}
                                  </div>
                                  <div className="room">
                                    Room: {slot.roomNumber || "—"}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="empty-slot">—</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminSectionTimetable;
