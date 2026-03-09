import axios from "./axios";

export const getCoursesByDept = async (deptId) => {
  const res = await axios.get(`/courses/by-deptId/${deptId}`);
  return res.data;
};