import { fetchApi } from "./apiClient";
import type { VerificationResponseData, APIResponse } from "../types/api";

export const verificationService = {
  verifyRegistrationToken: async (
    token: string
  ): Promise<APIResponse<VerificationResponseData>> => {
    const res = await fetchApi<VerificationResponseData>("/registrations/verify", {
      method: "POST",
      body: JSON.stringify({ token: token.trim() }),
    });

    if (res.success && res.data) {
      return {
        ...res,
        data: {
          ...res.data,
          isValid: res.data.valid ?? res.data.isValid ?? true,
          isAlreadyCheckedIn: res.data.checkedIn ?? res.data.isAlreadyCheckedIn ?? false,
        },
      };
    }

    return res;
  },
};
