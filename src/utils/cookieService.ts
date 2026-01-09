// src/utils/cookieService.ts

// Get cookie value by name
export const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
};

// Check if JWT token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp;
    return Math.floor(Date.now() / 1000) >= expiry;
  } catch (e) {
    return true; // If there's an error, assume it's expired
  }
};

// Get user info from JWT token
export const getUserFromToken = (token: string): { email: string; userId: string } | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      email: payload.email,
      userId: payload.userId
    };
  } catch (e) {
    return null;
  }
};