"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import { Button } from "./button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { useTransition } from "react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  totalCount?: number,
  pageIndex?: number,
  pageSize?: number,
}

export function DataTable<TData, TValue>({ columns, data, totalCount = 0, pageIndex = 1, pageSize = 10 }: DataTableProps<TData, TValue>) {
  "use no memo";
  const t = useTranslations("src.components.ui.data-table")
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const table = useReactTable({
    columns,
    data,
    state: {
      sorting,
      pagination: {
        pageIndex: pageIndex - 1,
        pageSize,
      },
    },
    pageCount: Math.ceil(totalCount / pageSize),
    manualPagination: true,
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === "function" ? updater(table.getState().pagination) : updater;
      const currentSearchParams = new URLSearchParams(searchParams?.toString() || "");
      currentSearchParams.set("page", String(newPagination.pageIndex + 1));
      currentSearchParams.set("pageSize", String(newPagination.pageSize));
      const search = currentSearchParams.toString();
      startTransition(() => {
        router.replace(`${pathname}?${search}`);
      })
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: pageSize, pageIndex: pageIndex - 1 || 0 } },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="space-y-0">
      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-muted/60 hover:bg-muted/60 border-b-2"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-11 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className={isPending ? "opacity-50 pointer-events-none" : ""}>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, rowIndex) => (
                <TableRow
                  key={row.id}
                  className={
                    rowIndex % 2 === 0
                      ? "border-b border-border/50 hover:bg-muted/30 transition-colors"
                      : "border-b border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors"
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                  {t("noData")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/30">
        {/* Row count badge */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {isPending
            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
            : <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
              {table.getFilteredRowModel().rows.length}
            </span>
          }
          <span>{t("records")}</span>
        </div>

        <div className="flex items-center gap-6">
          {/* Rows per page */}
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground font-medium">{t("rowsPerPage")}</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="h-7 w-[60px] text-xs">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top" position="popper">
                {[10, 20, 30, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`} className="text-xs">
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Page indicator */}
          <div className="text-xs font-medium text-muted-foreground">
            {t("page")}{" "}
            <span className="text-foreground">{table.getState().pagination.pageIndex + 1}</span>
            {" "}/{" "}
            <span className="text-foreground">{table.getPageCount()}</span>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hidden lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">First page</span>
              <ChevronsLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hidden lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Last page</span>
              <ChevronsRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
