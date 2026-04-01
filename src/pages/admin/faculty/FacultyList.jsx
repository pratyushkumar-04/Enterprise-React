import React, { useEffect, useState } from "react";
import FacultyTable from "./Components/FacultyTable";
import FacultyFilters from "./Components/FacultyFilters";
import FacultyEditModal from "./Components/FacultyEditModal";
import FacultyViewModal from "./Components/FacultyViewModal";
import "../../../styles/FacultyList.css"

import {
    getFaculties,
    getFacultiesByDepartment,
    getFacultyImage
} from "../../../Services/FacultyService";

const FacultyList = () => {
    const [faculties, setFaculties] = useState([]);
    const [imageUrls, setImageUrls] = useState({});
    const [viewFaculty, setViewFaculty] = useState(null);
    const [filters, setFilters] = useState({
        departmentId: "",
        search: "",
    });

    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const loadImages = async (facultyList) => {
        const urls = {};

        for (const f of facultyList) {
            try {
                const res = await getFacultyImage(f.id);

                const imageUrl = URL.createObjectURL(res.data);

                urls[f.id] = imageUrl;
            } catch (err) {
                console.error("Image load error:", err);
            }
            console.log(imageUrls);
        }

        setImageUrls(urls);
    };

    const fetchFaculties = async () => {
        try {
            let res;
            if (filters.departmentId) {
                console.log("FILTER ID:", filters.departmentId);
                res = await getFacultiesByDepartment(filters.departmentId);
            } else {
                res = await getFaculties();
            }

            setFaculties(res); // ✅ clean
            loadImages(res);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchFaculties();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    return (
        <div className="page-container">
            <h2>Faculty Master</h2>

            <FacultyFilters filters={filters} setFilters={setFilters} />

            <FacultyTable
                data={faculties}
                onEdit={(faculty) => {
                    setSelectedFaculty(faculty);
                    setShowEditModal(true);
                }}
                onRefresh={fetchFaculties}
                imageUrls={imageUrls}
                onView={(f) => setViewFaculty(f)}

            />

            {showEditModal && (
                <FacultyEditModal
                    faculty={selectedFaculty}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={fetchFaculties}
                />
            )}

            {viewFaculty && (
                <FacultyViewModal
                    faculty={viewFaculty}
                    imageUrls={imageUrls}
                    onClose={() => setViewFaculty(null)}
                />
            )}
        </div>
    );
};

export default FacultyList;