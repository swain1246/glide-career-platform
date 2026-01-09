import axiosInstance from "../axiosInstance";
import { ENDPOINTS } from "../apiConstants";
import { apiResponse } from "@/types/api.types";

// ✅ Get Mentor Profile Data
export const getMenterProfileData = async () => {
  const response = await axiosInstance.get<apiResponse>(ENDPOINTS.GET_MENTOR_PROFILE_DATA);
  return response.data;
};

// ✅ Update Mentor Profile Hero
export const UpdateMentorProfileHero = async (data) => {
  const response = await axiosInstance.post<apiResponse>(ENDPOINTS.UPDATE_MENTOR_PROFILE_HERO, data);
  return response.data;
};

// ✅ Add / Update Mentor Types
export const AddUpdateMentorTypes = async (data) => {
  console.log("Mentor type",data)
  const response = await axiosInstance.post<apiResponse>(
    ENDPOINTS.ADD_UPDATE_MENTOR_TYPES,
    data
  );
  return response.data;
};

// ✅ Activate / Deactivate Mentor Types
export const ActiveInactiveMentorTypes = async (mentorType: string, isActive: number) => {
  console.log("active_inactive_mentor_type:", { mentorType, isActive });

  const response = await axiosInstance.post<apiResponse>(
  `${ENDPOINTS.ACTIVE_INACTIVE_MENTOR_TYPES}?MentorType=${mentorType}&IsActive=${isActive}`
);
  return response.data;
};

// ✅ Add / Update Mentor Professional Details
export const AddUpdateMentorProfessionalDetails = async (data) => {
  const response = await axiosInstance.post<apiResponse>(
    ENDPOINTS.ADD_UPDATE_MENTOR_PROFESSIONAL_DETAILS,
    data
  );
  return response.data;
};

// ✅ Add / Update Mentor Education
export const AddUpdateMentorEducation = async (data) => {
  const response = await axiosInstance.post<apiResponse>(
    ENDPOINTS.ADD_UPDATE_MENTOR_EDUCATION,
    data
  );
  return response.data;
};

// ✅ Update Mentor Skills
export const UpdateMentorSkills = async (skills: string) => {

  // since backend expects plain string (not object), send as query string
  const response = await axiosInstance.post<apiResponse>(
    `${ENDPOINTS.UPDATE_MENTOR_SKILLS}?Skills=${encodeURIComponent(skills)}`
  );

  return response.data;
};

// ✅ Delete Mentor Type Details
export const DeleteMentorTypeDetails = async (id: number) => {
  console.log("delete_mentor_type_details:", id);

  const response = await axiosInstance.delete<apiResponse>(
    ENDPOINTS.DELETE_MENTOR_TYPE_DETAILS.replace("{id}", id.toString())
  );

  return response.data;
};


// ✅ Delete Mentor Education
export const DeleteMentorEducation = async (id: number) => {
  console.log("delete_mentor_education:", id);

  const response = await axiosInstance.delete<apiResponse>(
    ENDPOINTS.DELETE_MENTOR_EDUCATION.replace("{id}", id.toString())
  );

  return response.data;
};

// ✅ Delete Mentor Professional Details
export const DeleteMentorPerfessionalDetail = async (id: number) => {
  console.log("delete_mentor_professional_detail:", id);

  const response = await axiosInstance.delete<apiResponse>(
    ENDPOINTS.DELETE_MENTOR_PROFESSIONAL_DETAIL.replace("{id}", id.toString())
  );

  return response.data;
};