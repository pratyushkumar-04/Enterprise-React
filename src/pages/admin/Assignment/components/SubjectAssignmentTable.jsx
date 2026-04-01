import { useState } from "react";
import "../../../../styles/FacultyAssignment.css"

export default function SubjectAssignmentTable({
  subjects = [],
  faculties= [],
  assignments=[],
  filters,
  onAssign,
}) {
  const [selectedFaculty, setSelectedFaculty] = useState({});

  // return (
  //   <div className="card mt-4 border-0 shadow-sm">
  //     <div className="card-header bg-light fw-bold">
  //       Available Subjects
  //     </div>

  //     <div className="table-responsive">
  //       <table className="table table-bordered table-hover mb-0 align-middle">
  //         <thead className="table-primary">
  //           <tr>
  //             <th>Code</th>
  //             <th>Subject</th>
  //             <th>Faculty</th>
  //             <th width="120">Action</th>
  //           </tr>
  //         </thead>

  //         <tbody>
  //           {subjects.map((subject) => {
  //             const existing = assignments.find(
  //               (a) => a.subjectId === subject.Id
  //             );

  //             return (
  //               <tr key={subject.Id}>
  //                 <td>{subject.code}</td>
  //                 <td>{subject.name}</td>

  //                 <td>
  //                   {existing ? (
  //                     <span className="badge bg-success px-3 py-2">
  //                       {existing.facultyName}
  //                     </span>
  //                   ) : (
  //                     <select
  //                       className="form-select"
  //                       value={selectedFaculty[subject.Id] || ""}
  //                       onChange={(e) =>
  //                         setSelectedFaculty((prev) => ({
  //                           ...prev,
  //                           [subject.Id]: e.target.value,
  //                         }))
  //                       }
  //                     >
  //                       <option value="">Select Faculty</option>
  //                       {faculties.map((faculty) => (
  //                         <option key={faculty.id} value={faculty.id}>
  //                           {faculty.name}
  //                         </option>
  //                       ))}
  //                     </select>
  //                   )}
  //                 </td>

  //                 <td>
  //                   {!existing && (
  //                     <button
  //                       className="btn btn-primary btn-sm w-100"
  //                       disabled={!selectedFaculty[subject.Id]}
  //                       onClick={() =>
  //                         onAssign({
  //                           sectionId: filters.sectionId,
  //                           subjectId: subject.Id,
  //                           facultyId: selectedFaculty[subject.Id],
  //                           semester: filters.semester,
  //                           academicYear: "2025-26",
  //                         })
  //                       }
  //                     >
  //                       Assign
  //                     </button>
  //                   )}
  //                 </td>
  //               </tr>
  //             );
  //           })}
  //         </tbody>
  //       </table>
  //     </div>
  //   </div>
  // );
return (
  <div className="erp-card">
    
    <div className="erp-subheader">
      Available Subjects
    </div>

    <div className="erp-table-wrapper">
      <table className="erp-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Subject</th>
            <th>Faculty</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {subjects.map((subject) => {
            const existing = assignments.find(
              (a) => a.subjectId === subject.Id
            );

            return (
              <tr key={subject.Id}>
                <td className="erp-code">{subject.code}</td>
                <td className="erp-subject">{subject.name}</td>

                <td>
                  {existing ? (
                    <span className="erp-badge success">
                      {existing.facultyName}
                    </span>
                  ) : (
                    <select
                      className="erp-select"
                      value={selectedFaculty[subject.Id] || ""}
                      onChange={(e) =>
                        setSelectedFaculty((prev) => ({
                          ...prev,
                          [subject.Id]: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select Faculty</option>
                      {faculties.map((faculty) => (
                        <option key={faculty.id} value={faculty.id}>
                          {faculty.name}
                        </option>
                      ))}
                    </select>
                  )}
                </td>

                <td className="text-center">
                  {!existing && (
                    <button
                      className="erp-btn primary"
                      disabled={!selectedFaculty[subject.Id]}
                      onClick={() =>
                        onAssign({
                          sectionId: filters.sectionId,
                          subjectId: subject.Id,
                          facultyId: selectedFaculty[subject.Id],
                          semester: filters.semester,
                          academicYear: "2025-26",
                        })
                      }
                    >
                      Assign
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);
}