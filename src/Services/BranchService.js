import axios from "./axios";

export const getBranchesByCourse = async (courseId) => {
  const res = await axios.get(`/branches/by-course/${courseId}`);
  return res.data;
};
