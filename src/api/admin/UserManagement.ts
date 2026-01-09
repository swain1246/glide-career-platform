import axiosInstance from "../axiosInstance";
import { ENDPOINTS } from "../apiConstants";
import { apiResponse } from "@/types/api.types";

// Pagination request type
export interface PaginationEntity {
  pageNumber: number;
  pageSize: number;
  userType: number;
}

// ✅ Get User List
export const GetUsersList = async (params: PaginationEntity) => {
  console.log("get_users_list params:", params);

  const response = await axiosInstance.get<apiResponse>(
    ENDPOINTS.GET_USERS_LIST,
    {params}
  );

  return response.data;
};

// ✅ Get User View Profile details
export const GetViewProfileDetails = async (userId: number) => {
  console.log("Fetching view profile details for userId:", userId);
  const response = await axiosInstance.get<apiResponse>(
    `${ENDPOINTS.GET_VIEW_PROFILE_DETAILS}?UserId=${userId}`
  );
  return response.data;
};
