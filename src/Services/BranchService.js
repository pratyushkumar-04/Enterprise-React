import axios from "./axios";
import instance from "./axios";

export const getBranchesByCourse = async (courseId) => {
  const res = await axios.get(`/branches/by-course/${courseId}`);
  return res.data;
};
export const addBranch = async (req) => {
  return instance.post("/branches", req);
};

export const editBranch = async (id, req) => {
  return instance.put(`/branches/${id}/edit`, req);
};
