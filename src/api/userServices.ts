import axiosInstance from './axiosInstance';
import { ENDPOINTS } from './apiConstants';
import { AuthResponse } from '@/types/auth.types';
import { apiResponse } from '@/types/api.types';

export const UploadProfileImage = async (file: File) => {
  console.log("Uploading profile image:", file);

  const formData = new FormData();
  formData.append("file", file); // "file" must match parameter name in API method

  const response = await axiosInstance.post<AuthResponse>(ENDPOINTS.UPLOAD_PROFILE_IMAGE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const GetUserDetails = async (UserId) =>{
  const response = await axiosInstance.get<AuthResponse>(ENDPOINTS.GET_USER_DETAILS+`/${UserId}`)
  return response.data
}


export const GetProfileImage = async (fileName: string): Promise<Blob> => {
  try {
    const response = await axiosInstance.get<Blob>(
      `${ENDPOINTS.GET_PROFILE_IMAGE}?fileName=${encodeURIComponent(fileName)}`,
      {
        responseType: "blob", // important for binary (image) data
      }
    );

    return response.data; // this will be a Blob object (image binary)
  } catch (error) {
    console.error("Error fetching profile image:", error);
    throw error;
  }
};


// Delete logged-in user's profile image
export const DeleteUserProfileImage = async () => {
  console.log("delete_user_profile_image request");

  const response = await axiosInstance.delete<AuthResponse>(
    ENDPOINTS.DELETE_USER_PROFILE_IMAGE
  );

  return response.data;
};

//Change Password of user account
export const ChangePassword = async (data) => {
  console.log("change-password request:", data);
  const response = await axiosInstance.put<apiResponse>(
    ENDPOINTS.CHANGE_PASSWORD,
    data
  );
  return response.data;
};