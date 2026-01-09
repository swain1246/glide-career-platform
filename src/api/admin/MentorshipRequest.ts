import axiosInstance from "../axiosInstance";
import { ENDPOINTS } from "../apiConstants";
import { apiResponse } from "@/types/api.types";

export interface RequestParameters {
  pageNumber: number;
  pageSize: number;
  type?: string;
  domainId?: number;
  stackId?: number;
  status?: string;
}

export interface AcceptDenideUndoMentorshipRequest {
  requestId: number;
  remark: string;
  deniedMessage?: string;
}


// Get mentorship request stars data
export const GetStudentMentorshipRequestsCount = async () => {
  console.log("Fetching student mentorship requests count...");

  const response = await axiosInstance.get<apiResponse>(
    ENDPOINTS.GET_STUDENT_MENTORSHIP_REQUESTS_COUNT
  );

  return response.data;
};

// Get student mentorship request list
export const GetMentorshipRequestList = async (params: RequestParameters) => {
  console.log("Fetching mentorship request list with params:", params);

  const response = await axiosInstance.get<apiResponse>(
    ENDPOINTS.GET_MENTORSHIP_REQUEST_LIST,
    { params } // axios automatically adds query string
  );

  return response.data;
};

// Accept/Denie/Undo Student Mentorship Request
  export const AcceptDenieUndoStudentMentorshipRequest = async (
    params: AcceptDenideUndoMentorshipRequest
  ) => {
    console.log("accept/denie/undo mentorship request params:", params);

    const response = await axiosInstance.put<apiResponse>(
      ENDPOINTS.ACCEPT_DENIE_UNDO_STUDENT_MENTORSHIP_REQUEST,
      null, // body is null since params are sent as query string
      { params }
    );

    return response.data;
  };


  // Get view student profile Details
  export const ViewStudentProfileDetails = async (studentId: number) => {
  console.log("view_student_profile_details:", studentId);

  const response = await axiosInstance.get<apiResponse>(
    ENDPOINTS.VIEW_STUDENT_PROFILE_DETAILS,
    {
      params: { StudentId: studentId },
    }
  );

  return response.data;
};