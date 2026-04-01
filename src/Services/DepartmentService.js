import instance from "./axios";
import axios from "./axios";

export const getDepartments = async () => {
  const res = await axios.get("/department");
  return res.data;
}

export const addDepartment = async (deptdata) => {
  return instance.post("/department", deptdata);
}
export const editDepartment = async(id,req)=>{
  return instance.put(`/department/${id}/edit`,req);
}