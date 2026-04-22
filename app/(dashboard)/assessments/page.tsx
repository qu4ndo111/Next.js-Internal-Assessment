import React from "react";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";

export default function AssessmentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hồ sơ thẩm định</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý và xét duyệt các yêu cầu bồi thường bảo hiểm.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Tạo hồ sơ mới
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm theo mã hồ sơ, tên khách hàng..."
              className="pl-9 bg-background"
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2 bg-background border-dashed">
                <SlidersHorizontal className="h-4 w-4" />
                Lọc nâng cao
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Bộ lọc tìm kiếm</SheetTitle>
                <SheetDescription>
                  Thu hẹp danh sách hồ sơ cần thẩm định dựa trên các tiêu chí sau.
                </SheetDescription>
              </SheetHeader>
              <div className="py-6 space-y-4">
                {/* Khu vực bạn sẽ code Filter logic sau này */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Trạng thái</label>
                  <Input placeholder="Ví dụ: PENDING, APPROVED..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Loại bồi thường</label>
                  <Input placeholder="Ví dụ: MEDICAL, ACCIDENT..." />
                </div>
                <Button className="w-full mt-4">Áp dụng bộ lọc</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="border border-dashed rounded-lg p-8">
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Search className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Chưa có Bảng dữ liệu</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Khu vực này dành cho Data Table. Vui lòng làm theo hướng dẫn trong cửa sổ chat để tự build Data Table với Shadcn + Tanstack Table.
          </p>
        </div>
      </div>
    </div>
  );
}
