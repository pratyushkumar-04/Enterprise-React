import instance from "./axios";

export const addSubject = async (req) => {
    return instance.post("/subjects", req);
}

export const getSubjects = async (branchId, sem) => {
    return instance.get(`/subjects/by-branch/${branchId}/semester/${sem}`);
}

export const modifySubject = async (id, req) => {
    return instance.put(`/subjects/update/${id}`, req);
}

export const updateSubjectStatus = async (id, req) => {
    return instance.patch(`/subjects/status/${id}`, {
        status: req
    }).then(res => res.data);
};