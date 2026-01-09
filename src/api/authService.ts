// src/api/authService.ts
import axiosInstance from './axiosInstance';
import { ENDPOINTS } from './apiConstants';
import { studentRegisterRequest, LoginRequest, AuthResponse } from '../types/auth.types';

export const StudentRegister = async (data) => {
  const response = await axiosInstance.post<AuthResponse>(ENDPOINTS.STUDENT_REGISTER, data);
  return response.data;
};

export const companyRegister = async (data) => {
  const response = await axiosInstance.post<AuthResponse>(ENDPOINTS.COMPANY_REGISTER, data);
  return response.data;
};

export const mentorRegister = async (data) => {
  const response = await axiosInstance.post<AuthResponse>(ENDPOINTS.MENTOR_REGISTER, data);
  return response.data;
};

export const reSendRegistrationOtp = async (email) => {
  const response = await axiosInstance.post<AuthResponse>(`${ENDPOINTS.SEND_REGISTRATION_OTP}?Email=${encodeURIComponent(email)}`);
  return response.data;
};

export const VerifyRegisterOTP = async (data) => {
  const response = await axiosInstance.post<AuthResponse>(ENDPOINTS.VERIFY_REGISTRATION_OTP, data);
  return response.data;
};

export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(ENDPOINTS.LOGIN, data);
  return response.data;
};


export const readToken = async (): Promise<AuthResponse> => {
  const response = await axiosInstance.get<AuthResponse>(ENDPOINTS.READ_TOKEN);
  return response.data;
};

export const sendForgotPasswordOTP = async (email) => {
  const response = await axiosInstance.post<AuthResponse>(`${ENDPOINTS.SEND_FORGOT_PASSWORD_OTP}?Email=${encodeURIComponent(email)}`);
  return response.data;
};

export const verifyForgotPasswordOTP = async (data) => {
  const response = await axiosInstance.post<AuthResponse>(ENDPOINTS.VERIFY_FORGOT_PASSWORD_OTP, data);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await axiosInstance.post<AuthResponse>(ENDPOINTS.FORGOT_PASSWORD, data);
  return response.data;
};

export const Logout = async () => {
  console.log("logging out...");
  const response = await axiosInstance.post<AuthResponse>(ENDPOINTS.LOGOUT, {});
  return response.data;
};