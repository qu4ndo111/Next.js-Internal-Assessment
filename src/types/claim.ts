import { ClaimType } from "./assessment";

export interface Claim {
  id: string; // "CLM-2024-999"
  contractNo: string;
  insuredName: string;
  claimType: ClaimType;
  claimedAmount: number;
  incidentDate: string;
  description: string;
  status: "NEW" | "PROCESSING" | "CLOSED";
}
