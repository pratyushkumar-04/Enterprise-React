import instance from "./axios";

export const getCurrentClass = async (facultyId) => {
  const response = await instance.get(
    `/attendance/current-class/${facultyId}`
  );

  return response.data;
};

export const createAttendanceSession = async (payload) => {
  const response = await instance.post(
    "/attendance/session",
    payload
  );

  return response.data;
};

export const getStudentsForAttendance = async (sessionId) => {
  const response = await instance.get(
    `/attendance/${sessionId}/students`
  );

  return response.data;
};

export const markAttendance = async (payload) => {
  const response = await instance.post(
    "/attendance/mark",
    payload
  );

  return response.data;
};

export const getFacultyClassesForAttendance = async (
  facultyId,
  date
) => {
  const response = await instance.get(
    `/attendance/faculty/${facultyId}/classes`,
    {
      params: { date }
    }
  );

  return response.data;
};

export const getFacultyAttendanceSessions = async (
  facultyId,
  fromDate,
  toDate
) => {
  const response = await instance.get(
    `/attendance/faculty/${facultyId}/sessions`,
    {
      params: { fromDate, toDate }
    }
  );

  return response.data;
};