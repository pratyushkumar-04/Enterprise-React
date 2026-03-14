import axios from "./axios";
import instance from "./axios";


export const getSections = async (branchId, semester) => {
  const res = await axios.get(
    `/section/branchsem?branchId=${branchId}&semester=${semester}`
  );
  return res.data;
};
export const getAllSections = () => {
  return instance.get("/section");
};