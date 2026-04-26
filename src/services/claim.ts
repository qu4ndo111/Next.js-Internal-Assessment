import { FAKE_CLAIMS } from "../data/claims";
import { Claim } from "../types/claim";

export async function getClaimById(id: string): Promise<Claim | null> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const claim = FAKE_CLAIMS.find((c) => c.id === id);
  return claim || null;
}
