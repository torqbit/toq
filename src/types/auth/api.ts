export interface AuthAPIResponse {
  success: boolean;
  message?: string;
  error?: string;
  body?: any;
}

export const AuthConstants = {
  googleClientId: "GOOGLE_CLIENT_ID",
  googleSecretId: "GOOGLE_SECRET_ID",
};
