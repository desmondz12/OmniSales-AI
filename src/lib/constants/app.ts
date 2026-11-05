/**
 * Application-wide constants.
 * Keep environment-specific values in .env files, not here.
 */

export const APP_NAME = "OmniSales AI";
export const APP_DESCRIPTION =
  "AI-powered sales, CRM and collections platform";
export const APP_VERSION = "0.1.0";

/**
 * Route paths used across the application.
 * Centralised here to avoid magic strings.
 */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  DASHBOARD: "/dashboard",
} as const;
