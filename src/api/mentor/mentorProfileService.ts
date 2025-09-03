import axiosInstance from "../axiosInstance";
import { ENDPOINTS } from "../apiConstants";
import { apiResponse } from "@/types/api.types";


// ✅ Update Mentor Profile Hero
export const UpdateMentorProfileHero = async (data) => {
  console.log("mentor-profile-hero", data);
  const response = await axiosInstance.post<apiResponse>(ENDPOINTS.UPDATE_MENTOR_PROFILE_HERO, data);
  return response.data;
};