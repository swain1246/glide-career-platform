// src/api/apiConstants.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://careerglide.onrender.com/api/';

export const ENDPOINTS = {
  STUDENT_REGISTER: '/auth/StudentRegister',
  MENTOR_REGISTER: '/auth/MentorRegister',
  COMPANY_REGISTER: '/auth/CompanyRegister',
  SEND_REGISTRATION_OTP :'/auth/ResendOTP',
  VERIFY_REGISTRATION_OTP:'/auth/VerifyRegisterOTP',
  LOGIN: '/auth/login',
  READ_TOKEN:'/user/read-token',
  SEND_FORGOT_PASSWORD_OTP :'/auth/SendForgotPasswordMail',
  VERIFY_FORGOT_PASSWORD_OTP:'/auth/VerifyForgotPasswordOTP',
  FORGOT_PASSWORD:'/auth/ForgotPassword',
  LOGOUT: "/auth/Logout",

  // User

  UPLOAD_PROFILE_IMAGE: "/user/UploadProfileImage",
  GET_PROFILE_IMAGE:"/user/GetProfileImage",
  DELETE_USER_PROFILE_IMAGE:"/user/DeleteUserProfileImage",
  GET_USER_DETAILS:"/user/GetUserDetails",
  CHANGE_PASSWORD: "/user/ChangePassword",


  // Student Dashboard

  GET_STUDENT_DASHBOARD_DATA:'/student/GetStudentDashboardData',


  // student profile

  GET_STUDENT_PROFILE_DATA:'/student/GetStudentProfileDetails',
  UPDATE_STUDENT_PROFILE_HERO:'/student/UpdateStudentProfileHero',
  ADD_UPDATE_STUDENT_EDUCATION:'/student/AddUpdateStudentEducation',
  ADD_UPDATE_STUDENT_CIRTIFICATE:'/student/AddUpdateStudentCertification',
  ADD_UPDATE_STUDENT_INTERSHIP:'/student/AddUpdateStudentInternship',
  ADD_UPDATE_STUDENT_PROJECT:'/student/AddUpdateStudentProject',
  UPDATE_STUDENT_SKILL:'/student/UpdateStudentProfileSkills',
  UPLOAD_STUDENT_RESUME:"/student/UploadStudentResume",

  DELETE_STUDENT_EDUCATION: "/Student/DeleteStudentEducation/{id}",
  DELETE_STUDENT_CERTIFICATION: "/Student/DeleteStudentCertification/{id}",
  DELETE_STUDENT_INTERNSHIP: "/Student/DeleteStudentInternship/{id}",
  DELETE_STUDENT_PROJECT: "/Student/DeleteStudentProject/{id}",
  DELETE_STUDENT_RESUME:"/Student/DeleteStudentResume",

  // mentor profile
  
  GET_MENTOR_PROFILE_DATA:"/mentor/GetMentorProfileDetails",
  UPDATE_MENTOR_PROFILE_HERO:"/mentor/UpdateMentorProfileHero",
  ADD_UPDATE_MENTOR_TYPES:"/mentor/AddUpdateMentorTypes",
  ACTIVE_INACTIVE_MENTOR_TYPES: "/mentor/ActiveInactiveMentorTypes",
  ADD_UPDATE_MENTOR_EDUCATION: "/mentor/AddUpdateMentorEducation",
  ADD_UPDATE_MENTOR_PROFESSIONAL_DETAILS: "/mentor/AddUpdateMentorPerfessionalDetails",
  UPDATE_MENTOR_SKILLS: "/mentor/UpdateMentorSkills",

  DELETE_MENTOR_EDUCATION: "/mentor/DeleteMentorEducation/{id}",
  DELETE_MENTOR_PROFESSIONAL_DETAIL: "/mentor/DeleteMentorPerfessionalDetail/{id}",


  // Admin

  //User Management
  GET_USERS_LIST: "/admin/GetUsersList",
};



