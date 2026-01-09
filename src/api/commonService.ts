import axiosInstance from "./axiosInstance";
import { ENDPOINTS } from "./apiConstants";
import { apiResponse } from "@/types/api.types";



// Bind Technical Stacks 
export const BindTechnicalStacks = async () => {
  console.log("Fetching technical stacks...");
  const response = await axiosInstance.get<apiResponse>(
    ENDPOINTS.BIND_TECHNICAL_STACKS
  );
  return response.data;
};