import React, { useState, useEffect } from "react";
import { addStudent } from "../../../Services/StudentService";
import "../../../styles/studentRegistration.css";
import Loader from "../../../Components/common/Loader";
import { getDepartments } from "../../../Services/DepartmentService";
import { getCoursesByDept } from "../../../Services/CourseService";
import { getBranchesByCourse } from "../../../Services/BranchService";
import { getSections } from "../../../Services/SectionService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const navigate = useNavigate();

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

    setStudent((prev) => ({
      ...prev,
      departmentId: deptId,
      courseId: "",
      branchId: "",
      sectionId: "",
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

    setStudent((prev) => ({
      ...prev,
      courseId: courseId,
      branchId: "",
      sectionId: "",
    }));

    const branchData = await getBranchesByCourse(courseId);
    setBranches(branchData);
    setSections([]);
  };

  const handleBranchChange = (e) => {
    setStudent((prev) => ({
      ...prev,
      branchId: e.target.value,
      sectionId: "",
    }));
  };
  useEffect(() => {
    const fetchSections = async () => {
      if (student.branchId && student.currentSemester) {
        const data = await getSections(
          student.branchId,
          student.currentSemester,
        );
        setSections(data);
      }
    };

    fetchSections();
  }, [student.branchId, student.currentSemester]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;

    setFiles((prev) => ({
      ...prev,
      [name]: file,
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

  // validations
  const validateStep1 = () => {
    if (!student.name.trim()) {
        toast.error("Name is required");
        return false;
    }
    if (!student.fatherName.trim()) {
        toast.error("Father name is required");
        return false;
    }
    if (!student.dateOfBirth) {
        toast.error("Date of birth required");
        return false;
    }
    if (!student.phone || student.phone.length < 10) {
        toast.error("Valid phone required");
        return false;
    }
    if (!student.email.includes("@")) {
        toast.error("Valid email required");
        return false;
    }
    if (!student.gender) {
        toast.error("Select gender");
        return false;
    }
    if (!student.address.addressLine1) {
        toast.error("Address Line 1 required");
        return false;
    }
    if (!student.address.city) {
        toast.error("City required");
        return false;
    }
    if (!student.address.state) {
        toast.error("State required");
        return false;
    }
    if (!student.address.pincode) {
        toast.error("Pincode required");
        return false;
    }

    return true;
};

  const validateStep2 = () => {
    if (!student.departmentId) {
      toast.error("Select Department first");
      return false;
    }

    if (!student.courseId) {
      toast.error("Select Course");
      return false;
    }

    if (!student.branchId) {
      toast.error("Select Branch");
      return false;
    }

    if (!student.currentSemester) {
      toast.error("Enter Semester");
      return false;
    }

    if (!student.sectionId) {
      toast.error("Select Section");
      return false;
    }

    return true;
  };

  const validateStep3 = () => {
    if (!files.image) {
      toast.error("Student photo required");
      return false;
    }

    if (!files.adhaar) {
      toast.error("Adhaar required");
      return false;
    }

    if (!files.tenth) {
      toast.error("10th marksheet required");
      return false;
    }

    if (!files.twelth) {
      toast.error("12th marksheet required");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];

      setStudent((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      setStudent((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((prev) => prev + 1);
  };
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    setShowPreview(true);
  };
  const handleConfirmSubmit = async () => {
    try {
      setLoading(true);
      await addStudent(student, files);
      toast.success("Student Registered Successfully!");
      setShowPreview(false);
      navigate("/admin/students", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error("Error registering student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-reg-page">
      {loading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}
      <div className="registration-container">
        <h2>Student Registration</h2>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="form-step">
            <input
              name="name"
              placeholder="Full Name"
              value={student.name}
              onChange={handleChange}
            />
            <input
              name="fatherName"
              placeholder="Father Name"
              value={student.fatherName}
              onChange={handleChange}
            />
            <input
              name="motherName"
              placeholder="Mother Name"
              value={student.motherName}
              onChange={handleChange}
            />
            <input type="date" name="dateOfBirth" 
            value={student.dateOfBirth}
            onChange={handleChange} />
            <input
              name="phone"
              placeholder="Phone"   
              value={student.phone}
              onChange={handleChange}
            />
            <input
              name="email"
              placeholder="Email"
              value={student.email}
              onChange={handleChange}
            />

            <select
              name="gender"
              value={student.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>

            <input
              name="address.addressLine1"
              placeholder="Address Line 1"
              value={student.address.addressLine1}
              onChange={handleChange}
            />
            <input
              name="address.addressLine2"
              placeholder="Address Line 2"
              value={student.address.addressLine2}
              onChange={handleChange}
            />
            <input
              name="address.city"
              placeholder="City"
              value={student.address.city}
              onChange={handleChange}
            />
            <input
              name="address.state"
              placeholder="State"
              value={student.address.state}
              onChange={handleChange}
            />
            <input
              name="address.pincode"
              placeholder="Pincode"
              value={student.address.pincode}
              onChange={handleChange}
            />

            <button onClick={nextStep}>Next</button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="form-step">
            <select
              value={student.departmentId}
              onChange={handleDepartmentChange}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.Id} value={dept.Id}>
                  {dept.name}
                </option>
              ))}
            </select>

            <select
              value={student.courseId}
              onChange={handleCourseChange}
              disabled={!student.departmentId}
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>

            <select
              value={student.branchId}
              onChange={handleBranchChange}
              disabled={!student.courseId}
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
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
                setStudent((prev) => ({ ...prev, sectionId: e.target.value }))
              }
              disabled={!student.branchId || !student.currentSemester}
            >
              <option value="">Select Section</option>
              {sections.map((section) => (
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
            {imagePreview && (
              <img src={imagePreview} className="preview-img" alt="preview" />
            )}

            <label>Adhaar</label>
            <input type="file" name="adhaar" onChange={handleFileChange} />
            {adhaarPreview && (
              <iframe
                src={adhaarPreview}
                className="doc-preview"
                title="adhaar"
              />
            )}

            <label>10th Marksheet</label>
            <input type="file" name="tenth" onChange={handleFileChange} />
            {tenthPreview && (
              <iframe
                src={tenthPreview}
                className="doc-preview"
                title="tenth"
              />
            )}

            <label>12th Marksheet</label>
            <input type="file" name="twelth" onChange={handleFileChange} />
            {twelthPreview && (
              <iframe
                src={twelthPreview}
                className="doc-preview"
                title="twelth"
              />
            )}
            <div className="button-group">
              <button onClick={prevStep}>Previous</button>
              <button onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        )}

        {showPreview && (
          <div className="preview-overlay">
            <div className="preview-box">
              <h3>Confirm Student Details</h3>

              {/* IMAGE */}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="preview-img-large"
                />
              )}

              {/* BASIC DETAILS */}
              <div className="preview-details">
                <p>
                  <strong>Name:</strong> {student.name}
                </p>
                <p>
                  <strong>Email:</strong> {student.email}
                </p>
                <p>
                  <strong>Phone:</strong> {student.phone}
                </p>
                <p>
                  <strong>Gender:</strong> {student.gender}
                </p>
                <p>
                  <strong>Semester:</strong> {student.currentSemester}
                </p>

                <p>
                  <strong>Department:</strong>{" "}
                  {departments.find((d) => d.Id == student.departmentId)?.name}
                </p>

                <p>
                  <strong>Course:</strong>{" "}
                  {courses.find((c) => c.id == student.courseId)?.name}
                </p>

                <p>
                  <strong>Branch:</strong>{" "}
                  {branches.find((b) => b.id == student.branchId)?.name}
                </p>

                <p>
                  <strong>Section:</strong>{" "}
                  {sections.find((s) => s.id == student.sectionId)?.name}
                </p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="preview-actions">
                <button onClick={() => setShowPreview(false)}>Cancel</button>

                <button onClick={handleConfirmSubmit} disabled={loading}>
                  {loading ? "Submitting..." : "Confirm & Submit"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentRegistration;
