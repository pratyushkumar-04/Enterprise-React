// AssignmentFilterPanel.jsx

import "../../../../styles/FacultyAssignment.css";

export default function AssignmentFilterPanel({
  filters,
  departments,
  courses,
  branches,
  sections,
  onDepartmentChange,
  onCourseChange,
  onBranchChange,
  onSemesterChange,
  onSectionChange,
}) {
  const selectedCourse = courses.find(
    (course) => String(course.id) === String(filters.courseId),
  );

  const totalSemesters = selectedCourse ? selectedCourse.durationYears * 2 : 0;

  return (
    <div className="erp-card erp-filter-card">
      <div className="erp-subheader">
        Select Department / Course / Branch / Semester / Section
      </div>

      <div className="erp-body">
        <div className="erp-grid">
          <div className="erp-field">
            <label className="erp-label">Department</label>
            <select
              className="erp-select"
              value={filters.departmentId}
              onChange={(e) => onDepartmentChange(e.target.value)}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.Id} value={dept.Id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="erp-field">
            <label className="erp-label">Course</label>
            <select
              className="erp-select"
              value={filters.courseId}
              onChange={(e) => onCourseChange(e.target.value)}
              disabled={!filters.departmentId}
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div className="erp-field">
            <label className="erp-label">Branch</label>
            <select
              className="erp-select"
              value={filters.branchId}
              onChange={(e) => onBranchChange(e.target.value)}
              disabled={!filters.courseId}
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div className="erp-field">
            <label className="erp-label">Semester</label>
            <select
              className="erp-select"
              value={filters.semester}
              onChange={(e) => onSemesterChange(e.target.value)}
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

          <div className="erp-field">
            <label className="erp-label">Section</label>
            <select
              className="erp-select"
              value={filters.sectionId}
              onChange={(e) => onSectionChange(e.target.value)}
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
    </div>
  );
}
