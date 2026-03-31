import "../../../../styles/FacultyAssignment.css"


export default function ExistingAssignmentTable({
  assignments =[],
  onReassign,
  onDelete,
}) {
  // return (
  //   <div className="card mt-4 border-0 shadow-sm">
  //     <div className="card-header bg-light fw-bold">
  //       Existing Assignments
  //     </div>

  //     <div className="table-responsive">
  //       <table className="table table-bordered table-striped mb-0 align-middle">
  //         <thead className="table-dark">
  //           <tr>
  //             <th>Subject Code</th>
  //             <th>Subject</th>
  //             <th>Faculty</th>
  //             <th>Section</th>
  //             <th>Semester</th>
  //             <th width="180">Actions</th>
  //           </tr>
  //         </thead>

  //         <tbody>
  //           {assignments.length === 0 ? (
  //             <tr>
  //               <td colSpan="6" className="text-center py-4 text-muted">
  //                 No assignments found
  //               </td>
  //             </tr>
  //           ) : (
  //             assignments.map((item) => (
  //               <tr key={item.id}>
  //                 <td>{item.subjectCode}</td>
  //                 <td>{item.subjectName}</td>
  //                 <td>{item.facultyName}</td>
  //                 <td>{item.sectionName}</td>
  //                 <td>{item.semester}</td>
  //                 <td>
  //                   <div className="d-flex gap-2">
  //                     <button
  //                       className="btn btn-warning btn-sm"
  //                       onClick={() => onReassign(item)}
  //                     >
  //                       Reassign
  //                     </button>

  //                     <button
  //                       className="btn btn-danger btn-sm"
  //                       onClick={() => onDelete(item)}
  //                     >
  //                       Remove
  //                     </button>
  //                   </div>
  //                 </td>
  //               </tr>
  //             ))
  //           )}
  //         </tbody>
  //       </table>
  //     </div>
  //   </div>
  // );

  return (
  <div className="erp-card">

    <div className="erp-subheader">
      Existing Assignments
    </div>

    <div className="erp-table-wrapper">
      <table className="erp-table">
        <thead>
          <tr>
            <th>Subject Code</th>
            <th>Subject</th>
            <th>Faculty</th>
            <th>Section</th>
            <th>Semester</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {assignments.length === 0 ? (
            <tr>
              <td colSpan="6" className="erp-empty">
                No assignments found
              </td>
            </tr>
          ) : (
            assignments.map((item) => (
              <tr key={item.id}>
                <td className="erp-code">{item.subjectCode}</td>
                <td className="erp-subject">{item.subjectName}</td>
                <td>{item.facultyName}</td>
                <td>{item.sectionName}</td>
                <td>{item.semester}</td>

                <td>
                  <div className="erp-actions">
                    <button
                      className="erp-btn warning"
                      onClick={() => onReassign(item)}
                    >
                      Reassign
                    </button>

                    <button
                      className="erp-btn danger"
                      onClick={() => onDelete(item)}
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

}