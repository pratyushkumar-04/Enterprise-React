import axios from "./axios";
import instance from "./axios";

export const getCoursesByDept = async (deptId) => {
  const res = await axios.get(`/courses/by-deptId/${deptId}`);
  return res.data;
};

export const addCourse = async (req) => {
  return instance.post("/courses", req);
};

export const editCourse = async (id, req) => {
  return instance.put(`/courses/${id}/edit`, req);
};