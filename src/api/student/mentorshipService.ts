import axiosInstance from "../axiosInstance";
import { ENDPOINTS } from "../apiConstants";
import { apiResponse } from "@/types/api.types";

// Get Student Mentorship Request List
export const GetStudentMentorshipRequestList = async () => {
  console.log("Fetching student mentorship request list...");
  const response = await axiosInstance.get<apiResponse>(
    ENDPOINTS.GET_STUDENT_MENTORSHIP_REQUEST_LIST
  );
  return response.data;
};

// Add or Update Mentorship Request
export const AddUpdateMentorshipRequest = async (data: any) => {
  console.log("mentorship-request-data:", data);
  const response = await axiosInstance.post<apiResponse>(
    ENDPOINTS.ADD_UPDATE_MENTORSHIP_REQUEST,
    data
  );
  return response.data;
};


// Withdraw Mentorship Request
export const WithdrawMentorshipRequest = async (requestId: number) => {
  console.log("withdrawing mentorship request:", requestId);
  const response = await axiosInstance.delete<apiResponse>(
    ENDPOINTS.WITHDRAW_MENTORSHIP_REQUEST.replace("{RequestId}", requestId.toString())
  );
  return response.data;
};
