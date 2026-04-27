import axios from "./axios";
import instance from "./axios";

export const getAllStudents = async () => {
  try {
    const response = await axios.get("/student");
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

export const updateStudentStatus = async (id, status) => {
  return await axios.patch(`/student/status/${id}`, status);
};
export const addStudent = async (studentData, files) => {
  const formData = new FormData();

  const jsonBlob = new Blob(
    [JSON.stringify(studentData)],
    { type: "application/json" }
  );

  formData.append("student", jsonBlob);



  // Ensure keys match your @RequestPart("...") names exactly
  if (files.image) formData.append("image", files.image);
  if (files.adhaar) formData.append("adhaar", files.adhaar);
  if (files.tenth) formData.append("tenth", files.tenth);
  if (files.twelth) formData.append("twelth", files.twelth);

  return instance.post("/student/add", formData);

};

export const getStudentImage = async (studentId) => {
  return instance.get(`/student/image/${studentId}`, {
    responseType: "blob",
  });
};

export const getStudentDocument = async (studentId, type) => {
  return instance.get(`/student/document/${studentId}/${type}`, {
    responseType: "blob",
  });
};

export const editStudent = async (studentId, studentData) => {
  return instance.put(`/student/edit/${studentId}`, studentData);
};

export const getStudentsBySection = (sectionId) => {
  return instance.get(`/student/section/${sectionId}`);
};

export const generateRollNumbers = (sectionId) => {
  return instance.patch(
    `/student/sections/${sectionId}/generate-roll-numbers`
  );
};

export const getStudentsWithoutRoll = (sectionId) => {
  return instance.get(`/student/section/${sectionId}/unassigned`);
};

export const getMaxRollNumber = (sectionId) => {
  return instance.get(`/student/section/${sectionId}/max-roll`);
};

export const assignRollNumber = (studentId, rollnum) => {
  return instance.patch(`/student/${studentId}/roll-number`, {
    rollnum,
  });
};

export const getStudentById = (studentId) =>{
  return instance.get(`/student/${studentId}`);
}