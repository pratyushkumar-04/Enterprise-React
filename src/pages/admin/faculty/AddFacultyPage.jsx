import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { getDepartments } from "../../../Services/DepartmentService";
import { getCoursesByDept } from "../../../Services/CourseService";
import { getBranchesByCourse } from "../../../Services/BranchService";
import { addFaculty } from "../../../Services/FacultyService";
import "../../../styles/AddFaculty.css";

const DESIGNATIONS = ["PROFESSOR", "ASSOCIATE_PROFESSOR", "ASSISTANT_PROFESSOR", "HOD", "LAB_INSTRUCTOR"];

const STEPS = [
  { id: 1, label: "Personal", icon: "👤" },
  { id: 2, label: "Academic", icon: "🎓" },
  { id: 3, label: "Media", icon: "📁" },
];

export default function AddFaculty() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    designation: "", departmentId: "", courseId: "", branchId: "", qualification: "",
  });

  const [image, setImage] = useState(null);
  const [cv, setCv] = useState(null);
  const [previews, setPreviews] = useState({ img: null, cvUrl: null });
  
  const [data, setData] = useState({ depts: [], courses: [], branches: [] });
  const imgInputRef = useRef();
  const cvInputRef = useRef();

  useEffect(() => { getDepartments().then(d => setData(prev => ({...prev, depts: d}))); }, []);
  
  useEffect(() => {
    if (!form.departmentId) { setData(p => ({...p, courses: [], branches: []})); return; }
    getCoursesByDept(form.departmentId).then(c => setData(prev => ({...prev, courses: c})));
  }, [form.departmentId]);

  useEffect(() => {
    if (!form.courseId) { setData(p => ({...p, branches: []})); return; }
    getBranchesByCourse(form.courseId).then(b => setData(prev => ({...prev, branches: b})));
  }, [form.courseId]);

  const handleFile = (file, type) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === 'img') {
      setImage(file);
      setPreviews(prev => ({ ...prev, img: url }));
    } else {
      setCv(file);
      setPreviews(prev => ({ ...prev, cvUrl: url }));
    }
    toast.success(`${type === 'img' ? 'Photo' : 'CV'} attached`);
  };

  const validate = () => {
    if (step === 1) {
      if (!form.name.trim()) return "Name is required";
      if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Invalid email format";
      if (!/^\d{10}$/.test(form.phone)) return "Phone must be exactly 10 digits";
    }
    if (step === 2) {
      if (!form.departmentId || !form.courseId || !form.branchId) return "Please complete all academic fields";
      if (!form.qualification.trim()) return "Qualification is required";
    }
    return null;
  };

  const finalSubmit = async () => {
    setSubmitting(true);
    try {
      await addFaculty(form, { image, cv });
      toast.success("Faculty added successfully!");
      // Redirecting specifically to the admin path as requested
      setTimeout(() => navigate("/admin/faculty"), 1500);
    } catch (err) {
      toast.error("Error saving faculty data");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="faculty-form-container">
      <Toaster position="top-right" />
      
      <header className="form-header">
        <h1>Staff Registration</h1>
        <div className="header-underline"></div>
      </header>

      <div className="stepper-wrapper">
        {STEPS.map((s, i) => (
          <div key={s.id} className={`step-item ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}>
            <div className="step-bubble">{step > s.id ? "✓" : s.icon}</div>
            <span className="step-label">{s.label}</span>
            <div className="step-line" />
          </div>
        ))}
      </div>

      <div className="form-card">
        {step === 1 && (
          <div className="input-grid">
            <div className="field-group full-width">
              <label>Full Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Dr. Robert Aris" />
            </div>
            <div className="field-group">
              <label>Email Address</label>
              <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="staff@university.edu" />
            </div>
            <div className="field-group">
              <label>Phone Number</label>
              <input type="number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="10 Digit Mobile" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="input-grid">
            <div className="field-group">
              <label>Designation</label>
              <select value={form.designation} onChange={e => setForm({...form, designation: e.target.value})}>
                <option value="">Select Role</option>
                {DESIGNATIONS.map(d => <option key={d} value={d}>{d.replace(/_/g, " ")}</option>)}
              </select>
            </div>
            <div className="field-group">
              <label>Department</label>
              <select value={form.departmentId} onChange={e => setForm({...form, departmentId: e.target.value})}>
                <option value="">Select Dept</option>
                {data.depts.map(d => <option key={d.Id} value={d.Id}>{d.name}</option>)}
              </select>
            </div>
            <div className="field-group">
              <label>Course</label>
              <select value={form.courseId} onChange={e => setForm({...form, courseId: e.target.value})} disabled={!form.departmentId}>
                <option value="">Select Course</option>
                {data.courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="field-group">
              <label>Branch</label>
              <select value={form.branchId} onChange={e => setForm({...form, branchId: e.target.value})} disabled={!form.courseId}>
                <option value="">Select Branch</option>
                {data.branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="field-group full-width">
              <label>Qualification</label>
              <input value={form.qualification} onChange={e => setForm({...form, qualification: e.target.value})} placeholder="e.g. Ph.D. in Computer Science" />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="upload-container">
            <div className="drop-zone" onClick={() => imgInputRef.current.click()} onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0], 'img') }} onDragOver={e => e.preventDefault()}>
              <input type="file" hidden ref={imgInputRef} accept="image/*" onChange={e => handleFile(e.target.files[0], 'img')} />
              {previews.img ? <img src={previews.img} className="rect-preview" alt="Profile" /> : <div><span className="lg-icon">📸</span><p>Add Profile Photo</p></div>}
            </div>

            <div className="drop-zone" onClick={() => cvInputRef.current.click()} onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0], 'cv') }} onDragOver={e => e.preventDefault()}>
              <input type="file" hidden ref={cvInputRef} accept=".pdf" onChange={e => handleFile(e.target.files[0], 'cv')} />
              {previews.cvUrl ? (
                 <embed src={previews.cvUrl} type="application/pdf" className="rect-preview" />
              ) : <div><span className="lg-icon">📄</span><p>Upload CV (PDF)</p></div>}
            </div>
          </div>
        )}

        <div className="form-footer">
          {step > 1 && <button className="secondary-btn" onClick={() => setStep(s => s - 1)}>Back</button>}
          <button className="primary-btn" onClick={() => {
            const err = validate();
            if (err) return toast.error(err);
            step === 3 ? setShowConfirm(true) : setStep(s => s + 1);
          }}>
            {step === 3 ? "Review Details" : "Continue"}
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="modal-overlay">
          <div className="confirm-card">
            <div className="id-strip"></div>
            <div className="confirm-content">
              <img src={previews.img || 'https://via.placeholder.com/150'} className="confirm-avatar" alt="User" />
              <h3>{form.name}</h3>
              <span className="badge">{form.designation.replace(/_/g, " ")}</span>
              <div className="detail-grid">
                <div><label>Phone</label><p>{form.phone}</p></div>
                <div><label>Qualification</label><p>{form.qualification || "N/A"}</p></div>
                <div style={{ gridColumn: 'span 2' }}><label>Dept</label><p>{data.depts.find(d => d.Id === form.departmentId)?.name || "N/A"}</p></div>
              </div>
              <div className="modal-actions">
                <button className="secondary-btn" onClick={() => setShowConfirm(false)}>Edit</button>
                <button className="primary-btn" onClick={finalSubmit} disabled={submitting}>
                   {submitting ? "Finalizing..." : "Confirm & Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}