import { shouldSimulateError } from "../actions/error-simulator.action";
import { FAKE_CLAIMS } from "../data/claims";
import { Claim } from "../types/claim";

export async function getClaimById(id: string): Promise<Claim | null> {
  const sim = await shouldSimulateError()
  if (sim) throw new Error("Simulated error in getClaimById")
  
  await new Promise((resolve) => setTimeout(resolve, 800));

  const claim = FAKE_CLAIMS.find((c) => c.id === id);
  return claim || null;
}
