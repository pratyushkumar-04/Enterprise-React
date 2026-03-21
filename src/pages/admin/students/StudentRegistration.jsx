import React, { useState, useEffect } from "react";
import { addStudent } from "../../../Services/StudentService";
import "../../../styles/studentRegistration.css";
import Loader from "../../../Components/common/Loader";
import { getDepartments } from "../../../Services/DepartmentService";
import { getCoursesByDept } from "../../../Services/CourseService";
import { getBranchesByCourse } from "../../../Services/BranchService";
import { getSections } from "../../../Services/SectionService";
import toast from "react-hot-toast";


const StudentRegistration = () => {
    const [step, setStep] = useState(1);
    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [branches, setBranches] = useState([]);
    const [sections, setSections] = useState([]);

    const [imagePreview, setImagePreview] = useState(null);
    const [adhaarPreview, setAdhaarPreview] = useState(null);
    const [tenthPreview, setTenthPreview] = useState(null);
    const [twelthPreview, setTwelthPreview] = useState(null);


    const [student, setStudent] = useState({
        name: "",
        phone: "",
        email: "",
        sectionId: "",
        dateOfBirth: "",
        gender: "",
        fatherName: "",
        motherName: "",
        admissionYear: 2026,
        currentSemester: 1,
        departmentId: "",
        courseId: "",
        branchId: "",
        address: {
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            pincode: "",
        },
    });

    const [files, setFiles] = useState({
        image: null,
        adhaar: null,
        tenth: null,
        twelth: null,
    });

    useEffect(() => {
        const loadDepartments = async () => {
            const data = await getDepartments();
            setDepartments(data);
            console.log(data);
        };
        loadDepartments();
    }, []);


    const handleDepartmentChange = async (e) => {
        const deptId = e.target.value;
        console.log(e);

        setStudent(prev => ({
            ...prev,
            departmentId: deptId,
            courseId: "",
            branchId: "",
            sectionId: ""
        }));

        console.log(deptId);
        const courseData = await getCoursesByDept(deptId);
        setCourses(courseData);
        console.log(courseData);
        setBranches([]);
        setSections([]);
    };
    const handleCourseChange = async (e) => {
        const courseId = e.target.value;

        setStudent(prev => ({
            ...prev,
            courseId: courseId,
            branchId: "",
            sectionId: ""
        }));

        const branchData = await getBranchesByCourse(courseId);
        setBranches(branchData);
        setSections([]);
    };

    const handleBranchChange = (e) => {
        setStudent(prev => ({
            ...prev,
            branchId: e.target.value,
            sectionId: ""
        }));
    };
    useEffect(() => {
        const fetchSections = async () => {
            if (student.branchId && student.currentSemester) {
                const data = await getSections(
                    student.branchId,
                    student.currentSemester
                );
                setSections(data);
            }
        };

        fetchSections();
    }, [student.branchId, student.currentSemester]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const name = e.target.name;

        setFiles(prev => ({
            ...prev,
            [name]: file
        }));

        const previewURL = URL.createObjectURL(file);

        switch (name) {
            case "image":
                setImagePreview(previewURL);
                break;
            case "adhaar":
                setAdhaarPreview(previewURL);
                break;
            case "tenth":
                setTenthPreview(previewURL);
                break;
            case "twelth":
                setTwelthPreview(previewURL);
                break;
            default:
                break;
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith("address.")) {
            const field = name.split(".")[1];

            setStudent(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [field]: value
                }
            }));
        } else {
            setStudent(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };


    // const handleFileChange = (e) => {
    //     setFiles({ ...files, [e.target.name]: e.target.files[0] });
    // };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async () => {
        try {
            await addStudent(student, files);
            toast.success("Student Registered Successfully!");
        } catch (err) {
            console.error(err);
            alert("Error registering student");
        }
    };


    return (
        <div className="student-reg-page">
        <div className="registration-container">
            <h2>Student Registration</h2>

            {/* Progress Bar */}
            <div className="progress-bar">
                <div className="progress" style={{ width: `${(step / 3) * 100}%` }}></div>
            </div>

            {/* STEP 1 */}
            {step === 1 && (
                <div className="form-step">
                    <input name="name" placeholder="Full Name" onChange={handleChange} />
                    <input name="fatherName" placeholder="Father Name" onChange={handleChange} />
                    <input name="motherName" placeholder="Mother Name" onChange={handleChange} />
                    <input type="date" name="dateOfBirth" onChange={handleChange} />
                    <input name="phone" placeholder="Phone" onChange={handleChange} />
                    <input name="email" placeholder="Email" onChange={handleChange} />

                    <select name="gender" onChange={handleChange}>
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                    </select>

                    <input name="address.addressLine1" placeholder="Address Line 1" onChange={handleChange} />
                    <input name="address.addressLine2" placeholder="Address Line 2" onChange={handleChange} />
                    <input name="address.city" placeholder="City" onChange={handleChange} />
                    <input name="address.state" placeholder="State" onChange={handleChange} />
                    <input name="address.pincode" placeholder="Pincode" onChange={handleChange} />

                    <button onClick={nextStep}>Next</button>
                </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
                <div className="form-step">

                    <select value={student.departmentId} onChange={handleDepartmentChange}>
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                            <option key={dept.Id} value={dept.Id}>
                                {dept.name}
                            </option>
                        ))}
                    </select>

                    <select value={student.courseId} onChange={handleCourseChange} disabled={!courses.length}>
                        <option value="">Select Course</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>
                                {course.name}
                            </option>
                        ))}
                    </select>

                    <select value={student.branchId} onChange={handleBranchChange} disabled={!branches.length}>
                        <option value="">Select Branch</option>
                        {branches.map(branch => (
                            <option key={branch.id} value={branch.id}>
                                {branch.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        name="currentSemester"
                        placeholder="Current Semester"
                        value={student.currentSemester}
                        onChange={handleChange}
                    />

                    <select
                        value={student.sectionId}
                        onChange={(e) =>
                            setStudent(prev => ({ ...prev, sectionId: e.target.value }))
                        }
                        disabled={!sections.length}
                    >
                        <option value="">Select Section</option>
                        {sections.map(section => (
                            <option key={section.id} value={section.id}>
                                {section.name}
                            </option>
                        ))}
                    </select>
                    <div className="button-group">
                        <button onClick={prevStep}>Previous</button>
                        <button onClick={nextStep}>Next</button>
                    </div>

                </div>

            )}

            {/* STEP 3 */}
            {step === 3 && (
                <div className="form-step">

                    <label>Student Photo</label>
                    <input type="file" name="image" onChange={handleFileChange} />
                    {imagePreview && <img src={imagePreview} className="preview-img" alt="preview" />}

                    <label>Adhaar</label>
                    <input type="file" name="adhaar" onChange={handleFileChange} />
                    {adhaarPreview && <iframe src={adhaarPreview} className="doc-preview" title="adhaar" />}

                    <label>10th Marksheet</label>
                    <input type="file" name="tenth" onChange={handleFileChange} />
                    {tenthPreview && <iframe src={tenthPreview} className="doc-preview" title="tenth" />}

                    <label>12th Marksheet</label>
                    <input type="file" name="twelth" onChange={handleFileChange} />
                    {twelthPreview && <iframe src={twelthPreview} className="doc-preview" title="twelth" />}
                    <div className="button-group">
                        <button onClick={prevStep}>Previous</button>
                        <button onClick={handleSubmit}>Submit</button>
                    </div>


                </div>

            )}
        </div>
        </div>
    );
};

export default StudentRegistration;
