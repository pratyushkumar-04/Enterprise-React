import React, { useEffect, useState } from "react";
import { addStudent } from "../../../Services/StudentService";
import Loader from "../../../Components/common/Loader";
import "../../../styles/AddStudent.css"
import { getDepartments } from "../../../Services/DepartmentService";
import { getCoursesByDept } from "../../../Services/CourseService";
import { getBranchesByCourse } from "../../../Services/BranchService";
import { getSections } from "../../../Services/SectionService";

const AddStudent = () => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [sections, setSections] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    fatherName: "",
    motherName: "",
    gender: "",
    dateOfBirth: "",
    admissionYear: "",
    currentSemester: "",
    departmentId: "",
    courseId: "",
    branchId: "",
    sectionId: "",
    address: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
    },
  });


  useEffect(() => {
    const loadDepartments = async () => {
      const data = await getDepartments();
      setDepartments(data);
    };

    loadDepartments();
  }, []);

  useEffect(() => {
    const fetchSections = async () => {
      if (formData.branchId && formData.currentSemester) {
        const data = await getSections(
          formData.branchId,
          formData.currentSemester
        );
        setSections(data);
      }
    };
    fetchSections();
  }, [formData.branchId, formData.currentSemester]);


  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await addStudent(formData, imageFile);

      alert("Student Added Successfully");
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Error adding student");
    } finally {
      setLoading(false);
    }
  };

  const handleSemesterChange = async (e) => {
    const semester = e.target.value;
    console.log("semester =", semester);

    setFormData(prev => ({
      ...prev,
      currentSemester: semester
    }));
  };

  const handleDepartmentChange = async (e) => {
    const deptId = e.target.value;

    setFormData(prev => ({
      ...prev,
      departmentId: deptId,
      courseId: "",
      branchId: ""
    }));

    const courseData = await getCoursesByDept(deptId);
    console.log(courseData);
    setCourses(courseData);
    setBranches([]);
  };

  const handleCourseChange = async (e) => {
    const courseId = e.target.value;

    setFormData(prev => ({
      ...prev,
      courseId: courseId,
      branchId: ""
    }));

    const branchData = await getBranchesByCourse(courseId);
    console.log(branchData);
    setBranches(branchData);
  };

  const handleBranchChange = (e) => {
    setFormData(prev => ({
      ...prev,
      branchId: e.target.value
    }));
  };


  if (loading) return <Loader />;

  return (
    <div className="form-container">
      <h2>Add Student</h2>


      <form onSubmit={handleSubmit}>
        <div className="form-grid">

          <input name="name" placeholder="Full Name" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input name="phone" placeholder="Phone" onChange={handleChange} required />

          <input name="fatherName" placeholder="Father Name" onChange={handleChange} />
          <input name="motherName" placeholder="Mother Name" onChange={handleChange} />

          <select name="gender" onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="MALE">MALE</option>
            <option value="FEMALE">FEMALE</option>
            <option value="OTHER">OTHER</option>
          </select>

          <input type="date" name="dateOfBirth" onChange={handleChange} required />

          <input name="admissionYear" placeholder="Admission Year" onChange={handleChange} required />

          <select value={formData.currentSemester} onChange={handleSemesterChange} required>
            <option value="">Select Semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>

          <select
            value={formData.departmentId}
            onChange={handleDepartmentChange}
            required
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept.Id} value={dept.Id}>
                {dept.name}
              </option>
            ))}
          </select>


          <select value={formData.courseId} onChange={handleCourseChange} required>
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>

          <select value={formData.branchId} onChange={handleBranchChange} required>
            <option value="">Select Branch</option>
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>

          <select
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                sectionId: e.target.value
              }))
            }
            required
          >
            <option value="">Select Section</option>
            {sections.map(section => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </select>

        </div>
        <h3>Address Details</h3>

        <div className="form-grid">
          <input name="address.addressLine1" placeholder="Address Line 1" onChange={handleChange} />
          <input name="address.addressLine2" placeholder="Address Line 2" onChange={handleChange} />
          <input name="address.city" placeholder="City" onChange={handleChange} />
          <input name="address.state" placeholder="State" onChange={handleChange} />
          <input name="address.pincode" placeholder="Pincode" onChange={handleChange} />
        </div>
        <div className="image-upload">
          <input type="file" accept="image/*" onChange={handleImageChange} required />
          {imagePreview && (
            <img src={imagePreview} alt="preview" className="preview-img" />
          )}
        </div>

        <button type="submit" className="submit-btn">
          Add Student
        </button>
      </form>
    </div>
  );
};

export default AddStudent;