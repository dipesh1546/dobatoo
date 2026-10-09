import type { APIResponse } from "../types/api";

/**
 * Normalizes the API base URL and endpoint to guarantee /api/v1 is added exactly once.
 */
export function buildApiUrl(endpoint: string): string {
  const envUrl = (import.meta.env.VITE_API_BASE_URL || "").trim();
  const rawBase = envUrl || (import.meta.env.DEV ? "http://localhost:3000/api/v1" : "/api/v1");
  const baseWithoutTrailingSlash = rawBase.replace(/\/+$/, "");

  let normalizedBase = baseWithoutTrailingSlash;
  if (normalizedBase && !normalizedBase.endsWith("/api/v1") && !normalizedBase.includes("/api/v1")) {
    normalizedBase = `${normalizedBase}/api/v1`;
  }

  let cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  if (cleanEndpoint.startsWith("/api/v1/")) {
    cleanEndpoint = cleanEndpoint.substring("/api/v1".length);
  }

  return `${normalizedBase}${cleanEndpoint}`;
}

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<APIResponse<T>> {
  const fullUrl = buildApiUrl(endpoint);

  try {
    const response = await fetch(fullUrl, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    const status = response.status;
    let data: any = {};

    try {
      data = await response.json();
    } catch {
      // Non-JSON response payload
    }

    if (!response.ok) {
      if (import.meta.env.DEV) {
        console.warn("[DOBATO API HTTP Error]", {
          url: fullUrl,
          endpoint,
          status,
          response: data,
        });
      }

      const backendDetails = Array.isArray(data?.error?.details)
        ? data.error.details.join(". ")
        : (Array.isArray(data?.details) ? data.details.join(". ") : null);

      const backendMsg = backendDetails || (
        Array.isArray(data?.message)
          ? data.message.join(". ")
          : (typeof data?.message === "string" && data.message !== "Validation error"
            ? data.message
            : null)
      );

      let message = backendMsg || "An unexpected error occurred.";

      switch (status) {
        case 400:
          message = backendMsg || "Invalid request. Please check your input and try again.";
          break;
        case 401:
          message = backendMsg || "Your session has expired. Please sign in again.";
          // Clear admin session on expired token response when accessing admin endpoints
          if (endpoint.startsWith("/admin") && typeof window !== "undefined") {
            localStorage.removeItem("dobato_admin_token");
            localStorage.removeItem("dobato_admin_user");
            if (window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login") {
              window.location.href = "/admin/login";
            }
          }
          break;
        case 403:
          message = backendMsg || "You do not have permission to access this page or perform this action.";
          break;
        case 404:
          message = backendMsg || "The requested page or resource could not be found.";
          break;
        case 409:
          message = backendMsg || "It looks like this email or phone number is already registered.";
          break;
        case 422:
          message = backendMsg || "Please check the entered details and correct any errors.";
          break;
        case 429:
          message = backendMsg || "Too many requests. Please wait a moment and try again.";
          break;
        case 500:
        case 502:
        case 503:
          message = backendMsg || "Something went wrong on our side. Please try again.";
          break;
        default:
          message = backendMsg || "Something went wrong. Please try again.";
      }

      return {
        success: false,
        statusCode: status,
        message,
        data: data.data,
        errors: data.errors,
      };
    }

    return {
      success: true,
      statusCode: status,
      message: data.message || "Operation successful.",
      data: data.data !== undefined ? data.data : data,
      pagination: data.pagination,
      ...data,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("[DOBATO API Network Failure]", {
        url: fullUrl,
        endpoint,
        status: 503,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    const isOffline = typeof navigator !== "undefined" && !navigator.onLine;

    return {
      success: false,
      statusCode: 503,
      message: isOffline
        ? "You are currently offline. Please check your internet connection and try again."
        : "Network error or backend service unavailable. Please check your internet connection and try again.",
    };
  }
}
