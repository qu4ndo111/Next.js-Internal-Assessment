"use client"

import { ColumnDef } from "@tanstack/react-table"

// Tạo type tương ứng với Backend trả về
export type Assessment = {
  id: string
  patientName: string
  amount: number
  status: "PENDING" | "APPROVED" | "REJECTED"
}

export const columns: ColumnDef<Assessment>[] = [
  {
    accessorKey: "id",
    header: "Mã Hồ Sơ",
  },
  {
    accessorKey: "patientName",
    header: "Tên Bệnh Nhân",
  },
  {
    accessorKey: "status",
    header: "Trạng Thái",
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Số Tiền (VND)</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      // Bạn có thể format dữ liệu cục bộ trong hàm cell này
      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount)
 
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
]
