import { Claim } from "../types/claim";

export const FAKE_CLAIMS: Claim[] = [
  {
    id: "CLM-2024-901",
    contractNo: "CON-00901",
    insuredName: "Trịnh Văn X",
    claimType: "MEDICAL",
    claimedAmount: 25000000,
    incidentDate: "2024-04-20T08:00:00Z",
    description: "Nhập viện mổ ruột thừa cấp cứu tại bệnh viện Đa khoa Tỉnh",
    status: "NEW"
  },
  {
    id: "CLM-2024-902",
    contractNo: "CON-00902",
    insuredName: "Phan Thị Y",
    claimType: "PROPERTY",
    claimedAmount: 150000000,
    incidentDate: "2024-04-22T14:30:00Z",
    description: "Xe ô tô bị cây đè bẹp nóc do mưa bão",
    status: "NEW"
  },
  {
    id: "CLM-2024-903",
    contractNo: "CON-00903",
    insuredName: "Đinh Văn Z",
    claimType: "ACCIDENT",
    claimedAmount: 5000000,
    incidentDate: "2024-04-25T09:15:00Z",
    description: "Ngã xe máy xước xát phần mềm, đã điều trị ngoại trú",
    status: "NEW"
  }
];
