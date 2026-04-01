import instance from "./axios";

export const createAssignment = async (payload) => {
  const res = await instance.post("/faculty-assignment", payload);
  return res.data;
};

// Get assignments by section and semester
export const getAssignments = async (sectionId, semester) => {
  const res = await instance.get(
    `/faculty-assignment/section/${sectionId}/semester/${semester}`
  );
  return res.data;
};

// Reassign faculty
export const reassignFaculty = async (payload) => {
  const res = await instance.put("/faculty-assignment/reassign", payload);
  return res.data;
};

// Delete an assignment
export const deleteAssignment = async (id) => {
  const res = await instance.delete(`/faculty-assignment/${id}`);
  return res.data;
};
