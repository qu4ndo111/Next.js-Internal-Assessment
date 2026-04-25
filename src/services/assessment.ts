import { FAKE_ASSESSMENTS } from "../data/assessments";
import { Assessment } from "../types/assessment";

export async function getAssessments(filters?: { status?: string; type?: string; search?: string }): Promise<Assessment[]> {
  // Giả lập độ trễ mạng 500ms
  await new Promise((resolve) => setTimeout(resolve, 500));

  let data = [...FAKE_ASSESSMENTS];

  // Logic filter giả lập (Trong thực tế việc này do Backend làm)
  if (filters?.status) {
    data = data.filter((item) => item.status === filters.status);
  }
  if (filters?.type) {
    data = data.filter((item) => item.claimType === filters.type);
  }
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    data = data.filter((item) => 
      item.id.toLowerCase().includes(s) || 
      item.insuredName.toLowerCase().includes(s)
    );
  }

  return data;
}
