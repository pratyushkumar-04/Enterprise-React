import React, { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaGraduationCap,
  FaIdCard,
  FaEyeSlash,
  FaEye,
} from "react-icons/fa";
import { MdBusiness, MdSchool, MdBadge } from "react-icons/md";
import {
  getFacultyProfile,
  getFacultyImage,
  getCv,
  changePassword,
} from "../../Services/FacultyService";
import "../../styles/FacultyProfile.css";
import toast from "react-hot-toast";
import Loader from "../../Components/common/Loader";

const FacultyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);
  const [cvUrl, setCvUrl] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const facultyId = localStorage.getItem("id");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await getFacultyProfile();
      setProfile(response);

      if (facultyId) {
        const imageRes = await getFacultyImage(facultyId);
        const url = URL.createObjectURL(imageRes.data);
        setImageUrl(url);

        const cvRes = await getCv(facultyId);
        const cvBlobUrl = URL.createObjectURL(cvRes.data);
        setCvUrl(cvBlobUrl);
      }
    } catch (error) {
      console.error("Error loading faculty profile", error);
    } finally {
      setLoading(false);
    }
  };
  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const formatText = (value) => {
    if (!value) return "-";

    return value
      .toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (loading) {
    return <Loader />;
  }

  if (!profile) {
    return (
      <div className="faculty-profile-error">
        Unable to load faculty profile.
      </div>
    );
  }
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handlePasswordSubmit = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      toast.error("All fields are required");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setPasswordLoading(true);

      const payload = {
        username: profile.facultyCode,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      };

      await changePassword(payload);

      toast.success("Password updated successfully!");

      setShowPasswordModal(false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Change password error:", err.response || err.message);

      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="faculty-profile-page">
      <div className="faculty-profile-card">
        {/* Header */}
        <div className="faculty-profile-header">
          <div className="faculty-profile-image-wrapper">
            <img
              src={imageUrl}
              alt={profile.name}
              className="faculty-profile-image"
              onError={(e) => {
                e.target.src =
                  "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(profile.name) +
                  "&background=2563eb&color=fff&size=256";
              }}
            />
          </div>

          <div className="faculty-profile-main">
            <h1>{profile.name}</h1>

            <p className="faculty-designation">
              {formatText(profile.designation)}
            </p>

            <div className="faculty-meta-row">
              <span className="faculty-code-badge">
                <FaIdCard />
                {profile.facultyCode}
              </span>

              <span
                className={`faculty-status-badge ${
                  profile.status?.toLowerCase() === "active"
                    ? "active"
                    : "inactive"
                }`}
              >
                {formatText(profile.status)}
              </span>
            </div>
          </div>

          <div className="faculty-profile-actions">
            <a
              href={cvUrl}
              target="_blank"
              rel="noreferrer"
              className="action-btn secondary"
            >
              View CV
            </a>

            <button
              className="action-btn primary"
              onClick={() => setShowPasswordModal(true)}
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Information Grid */}
        <div className="faculty-info-grid">
          <div className="info-box">
            <div className="info-icon">
              <MdBusiness />
            </div>
            <div>
              <label>Department</label>
              <span>{profile.departmentName || "-"}</span>
            </div>
          </div>

          <div className="info-box">
            <div className="info-icon">
              <MdSchool />
            </div>
            <div>
              <label>Course</label>
              <span>{profile.courseName || "-"}</span>
            </div>
          </div>

          <div className="info-box">
            <div className="info-icon">
              <MdBadge />
            </div>
            <div>
              <label>Branch</label>
              <span>{profile.branchName || "-"}</span>
            </div>
          </div>

          <div className="info-box">
            <div className="info-icon">
              <FaEnvelope />
            </div>
            <div>
              <label>Email</label>
              <span>{profile.email || "-"}</span>
            </div>
          </div>

          <div className="info-box">
            <div className="info-icon">
              <FaPhoneAlt />
            </div>
            <div>
              <label>Phone</label>
              <span>{profile.phone || "-"}</span>
            </div>
          </div>

          <div className="info-box">
            <div className="info-icon">
              <FaGraduationCap />
            </div>
            <div>
              <label>Qualification</label>
              <span>{profile.qualification || "-"}</span>
            </div>
          </div>
        </div>
      </div>
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Change Password</h2>

            <div className="password-field">
              <input
                type={showPassword.old ? "text" : "password"}
                name="oldPassword"
                placeholder="Old Password"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
              />
              <span onClick={() => togglePassword("old")}>
                {showPassword.old ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="password-field">
              <input
                type={showPassword.new ? "text" : "password"}
                name="newPassword"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />
              <span onClick={() => togglePassword("new")}>
                {showPassword.new ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="password-field">
              <input
                type={showPassword.confirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
              />
              <span onClick={() => togglePassword("confirm")}>
                {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowPasswordModal(false)}>
                Cancel
              </button>

              <button onClick={handlePasswordSubmit} disabled={passwordLoading}>
                {passwordLoading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      )}
      {passwordLoading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default FacultyProfile;
