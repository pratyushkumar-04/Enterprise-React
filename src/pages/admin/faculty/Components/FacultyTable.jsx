import React from "react";
import { changeFacultyStatus } from "../../../../Services/FacultyService";

const FacultyTable = ({ data, onEdit, onRefresh ,imageUrls,onView}) => {

    console.log(imageUrls);
    const handleStatusChange = async (id, status) => {
        try {
            await changeFacultyStatus(id, status);
            onRefresh();
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <table className="erp-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Photo</th>
                    <th>Code</th>
                    <th>Department</th>
                    <th>Branch</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                {data?.map((f) => (
                    <tr key={f.id}>
                        <td>{f.name}</td>
                        <td>
                            <img
                                src={imageUrls[f.id]}
                                alt="faculty"
                                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                            />
                        </td>
                        <td>{f.facultyCode}</td>
                        <td>{f.departmentName}</td>
                        <td>{f.branchName}</td>

                        <td>
                            <select
                                className={`status-select ${f.status.toLowerCase()}`}
                                value={f.status}
                                onChange={(e) =>
                                    handleStatusChange(f.id, e.target.value)
                                }
                            >
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                                <option value="ON_LEAVE">ON LEAVE</option>
                            </select>
                        </td>

                        <td>
                            <button onClick={() => onEdit(f)}>Edit</button>

                            <button onClick={() => onView(f)}>View</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default FacultyTable;