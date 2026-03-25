import instance from "./axios";

export const getFaculties = async () => {
    const res = await instance.get("/faculty");
    return res.data;
};

export const getFacultiesByDepartment = async (id) => {
    const res = await instance.get(`/faculty/department/${id}`);
    return res.data;
};

export const changeFacultyStatus = async (id, status) => {
    return await instance.patch(`/faculty/status/${id}`, {
         status: status 
    });
};

export const getCv = async (facultyId) => {
  return instance.get(`/faculty/${facultyId}/cv`, {
    responseType: "blob",
  });
};

export const updateFaculty = async (id, req) => {
    return instance.put(`/faculty/${id}`, req);
};

export const getFacultyImage = async (Id) => {
  return instance.get(`/faculty/image/${Id}`, {
    responseType: "blob",
  });
};

export const addFaculty = async (facultydata, files) => {
  const formData = new FormData();

  const jsonBlob = new Blob(
    [JSON.stringify(facultydata)],
    { type: "application/json" }
  );
  formData.append("faculty", jsonBlob);
  if (files.image) formData.append("image", files.image);
  if (files.cv) formData.append("cv", files.cv);

  return instance.post("/faculty", formData);
};