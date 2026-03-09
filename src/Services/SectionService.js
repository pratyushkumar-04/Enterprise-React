import axios from "./axios";

export const getSections = async (branchId, semester) => {
  const res = await axios.get(
    `/section/branchsem?branchId=${branchId}&semester=${semester}`
  );
  return res.data;
};