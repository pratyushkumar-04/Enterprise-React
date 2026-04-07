import instance from "./axios";

export const getFacultyTimetable = async (facultyId) => {
    return instance.get(`/timetable/faculty/${facultyId}`);
}

export const createTimetableEntry = async(payload)=>{
    return instance.post(`/timetable`,payload);
}

export const getSectiontimetable = async (sectionId) =>{
    return instance.get(`/timetable/section/${sectionId}`)
}