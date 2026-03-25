import React, { useEffect, useState } from "react";
import { getDepartments } from "../../../../Services/DepartmentService";

const FacultyFilters = ({ filters, setFilters }) => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
  const fetchDepartments = async () => {
    try {
      const data = await getDepartments();
      console.log("Departments:", data); // <-- log here
      setDepartments(data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchDepartments();
}, []);

  return (
    <div className="filters" style={{ display: "flex", gap: "10px" }}>
      <select
        value={filters.departmentId}
        onChange={(e) =>
          setFilters({ ...filters, departmentId: e.target.value })
        }
      >
        <option value="">All Departments</option>

        {departments.map((d) => (
          <option key={d.Id} value={d.Id}>
            {d.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Search name/email"
        onChange={(e) =>
          setFilters({ ...filters, search: e.target.value })
        }
      />
    </div>
  );
};

export default FacultyFilters;