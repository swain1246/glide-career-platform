// src/types/auth.types.ts
export interface studentRegisterRequest {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
    gender: string,
    college: string,
    degree: string,
    registrationNumber: string,
    yearOfPassing: number
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success:boolean;
  message:string;
  data:any;
  statusCode:number;
}
