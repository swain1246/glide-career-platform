import axiosInstance from './axiosInstance';
import { ENDPOINTS } from './apiConstants';
import { AuthResponse } from '@/types/auth.types';

// student Dashboard
export const getStudentDashboardData = async () => {
  const response = await axiosInstance.get<AuthResponse>(ENDPOINTS.GET_STUDENT_DASHBOARD_DATA);
  return response.data;
};


// student Profile

export const getStudentProfileData = async () => {
  const response = await axiosInstance.get<AuthResponse>(ENDPOINTS.GET_STUDENT_PROFILE_DATA);
  return response.data;
};

export const UpdateStudentProfileHero = async (data) => {
  console.log("student-profile-hero",data)
  const response = await axiosInstance.post<AuthResponse>(ENDPOINTS.UPDATE_STUDENT_PROFILE_HERO, data);
  return response.data;
};

export const UpdateStudentskills = async (skills: string) => {
  try {
    const response = await axiosInstance.post<AuthResponse>(
      ENDPOINTS.UPDATE_STUDENT_SKILL,
      null, // no body, since Skills is passed as query/body param
      {
        params: { Skills: skills }, // matches API parameter
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};

export const AddUpdateStudentEducation = async (data) => {
  console.log("student-profile-education",data)
  const response = await axiosInstance.post<AuthResponse>(ENDPOINTS.ADD_UPDATE_STUDENT_EDUCATION, data);
  return response.data;
};

export const AddUpdateStudentCertificate = async (data) => {
  console.log("student-profile-Certificate",data)
  const response = await axiosInstance.post<AuthResponse>(ENDPOINTS.ADD_UPDATE_STUDENT_CIRTIFICATE, data);
  return response.data;
};


export const AddUpdateStudentIntership = async (data) => {
  console.log("student-profile-Intership",data)
  const response = await axiosInstance.post<AuthResponse>(ENDPOINTS.ADD_UPDATE_STUDENT_INTERSHIP, data);
  return response.data;
};

export const AddUpdateStudentProject = async (data) => {
  console.log("student-profile-Project",data)
  const response = await axiosInstance.post<AuthResponse>(ENDPOINTS.ADD_UPDATE_STUDENT_PROJECT, data);
  return response.data;
};




// ✅ Delete Student Education
export const DeleteStudentEducation = async (id: number) => {
  console.log("delete_student_education: ",id)
  const response = await axiosInstance.delete<AuthResponse>(ENDPOINTS.DELETE_STUDENT_EDUCATION.replace("{id}", id.toString()));
  return response.data;
};

// ✅ Delete Student Certification
export const DeleteStudentCertification = async (id: number) => {
  const response = await axiosInstance.delete<AuthResponse>(ENDPOINTS.DELETE_STUDENT_CERTIFICATION.replace("{id}", id.toString()));
  return response.data;
};

// ✅ Delete Student Internship
export const DeleteStudentInternship = async (id: number) => {
  const response = await axiosInstance.delete<AuthResponse>(ENDPOINTS.DELETE_STUDENT_INTERNSHIP.replace("{id}", id.toString()));
  return response.data;
};

// ✅ Delete Student Project
export const DeleteStudentProject = async (id: number) => {
  const response = await axiosInstance.delete<AuthResponse>(ENDPOINTS.DELETE_STUDENT_PROJECT.replace("{id}", id.toString()));
  return response.data;
};



// upload student resume
export const UploadStudentResume = async (file: File) => {
  if (!file) throw new Error("No file provided");

  const formData = new FormData();
  formData.append("resumeFile", file); // Must match API parameter name

  const response = await axiosInstance.post<AuthResponse>(
    ENDPOINTS.UPLOAD_STUDENT_RESUME,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


// ✅ Delete Student Resume
export const DeleteStudentResume = async () => {
  try {
    const response = await axiosInstance.delete<AuthResponse>(
      ENDPOINTS.DELETE_STUDENT_RESUME
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to delete resume" };
  }
};