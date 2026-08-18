"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DateRangePicker from "@/components/date-range-picker";
import TablePagination from "./table-pagination";
import { FAQDataProps } from "./data";
import { getColumns } from "./columns";
import { AddEditFAQDialog } from "./add-edit-faq-dialog";
import { ViewFAQDialog } from "./view-faq-dialog";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Search, Plus, RefreshCw, PlusCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "@/components/navigation";
import { listFaqSources, deleteFaqSource, FAQSource, mapSourceToFaqRow } from "../faq-api-service";

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "General", label: "General" },
  { value: "Products", label: "Products" },
  { value: "Services", label: "Services" },
  { value: "Pricing", label: "Pricing" },
  { value: "Payment", label: "Payment" },
  { value: "Delivery", label: "Delivery" },
  { value: "Support", label: "Support" },
  { value: "Returns & Refunds", label: "Returns & Refunds" },
  { value: "Other", label: "Other" },
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const matchTypeOptions = [
  { value: "all", label: "All Match Types" },
  { value: "Exact Match", label: "Exact Match" },
  { value: "Partial Match", label: "Partial Match" },
  { value: "AI Semantic", label: "AI Semantic" },
  { value: "Keyword Match", label: "Keyword Match" },
];

export default function FAQTable() {
  const router = useRouter();
  const [data, setData] = React.useState<FAQDataProps[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadFaqs = React.useCallback(() => {
    setLoading(true);
    listFaqSources()
      .then((sources: FAQSource[]) => {
        setData(sources.map(mapSourceToFaqRow));
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load FAQs — check the backend connection");
      })
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    loadFaqs();
  }, [loadFaqs]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Filter States
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [matchTypeFilter, setMatchTypeFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Popover Open States
  const [categoryOpen, setCategoryOpen] = React.useState(false);
  const [statusOpen, setStatusOpen] = React.useState(false);
  const [matchTypeOpen, setMatchTypeOpen] = React.useState(false);

  // Dialog States
  const [addEditOpen, setAddEditOpen] = React.useState(false);
  const [editingFaq, setEditingFaq] = React.useState<FAQDataProps | null>(null);

  const [viewOpen, setViewOpen] = React.useState(false);
  const [viewingFaq, setViewingFaq] = React.useState<FAQDataProps | null>(null);

  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deletingFaq, setDeletingFaq] = React.useState<FAQDataProps | null>(null);

  // Filter Sync
  React.useEffect(() => {
    const newFilters: ColumnFiltersState = [];

    if (categoryFilter !== "all") {
      newFilters.push({ id: "category", value: categoryFilter });
    }
    if (statusFilter !== "all") {
      newFilters.push({ id: "status", value: statusFilter });
    }
    if (matchTypeFilter !== "all") {
      newFilters.push({ id: "matchType", value: matchTypeFilter });
    }
    if (searchQuery.trim() !== "") {
      newFilters.push({ id: "question", value: searchQuery });
    }

    setColumnFilters(newFilters);
  }, [categoryFilter, statusFilter, matchTypeFilter, searchQuery]);

  // Handlers for Row Actions
  const handleView = (faq: FAQDataProps) => {
    setViewingFaq(faq);
    setViewOpen(true);
  };

  const handleEdit = (faq: FAQDataProps) => {
    setEditingFaq(faq);
    setAddEditOpen(true);
  };

  // NOTE: the live backend has no "update" endpoint for a FAQ source yet -
  // toggling status here only changes it in this browser's view, it is not
  // persisted to the server or reflected in what the bot actually uses.
  const handleToggleStatus = (faq: FAQDataProps) => {
    const newStatus: "Active" | "Inactive" = faq.status === "Active" ? "Inactive" : "Active";
    setData((prev) => prev.map((item) => (item.id === faq.id ? { ...item, status: newStatus } : item)));
    toast.success(`FAQ ${faq.faqId} status set to ${newStatus} (display only — not saved to server)`);
  };

  const handleDeletePrompt = (faq: FAQDataProps) => {
    setDeletingFaq(faq);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingFaq) return;
    try {
      await deleteFaqSource(deletingFaq.id);
      setData((prev) => prev.filter((item) => item.id !== deletingFaq.id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete FAQ from the server");
    }
  };

  // NOTE: same as handleToggleStatus above - editing an existing FAQ's text
  // here is display-only until the backend gets an update endpoint. Use the
  // "Add FAQ" flow (which really does hit the live API) for real changes,
  // and delete + recreate in the meantime for edits that must be live.
  const handleSaveFAQ = (faqDataInput: Partial<FAQDataProps>) => {
    if (editingFaq) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editingFaq.id
            ? ({
                ...item,
                ...faqDataInput,
                updatedAt: new Date().toISOString().split("T")[0],
              } as FAQDataProps)
            : item
        )
      );
      toast.success("FAQ updated (display only — not saved to server)");
    }
  };

  const columns = React.useMemo(
    () =>
      getColumns({
        onView: handleView,
        onEdit: handleEdit,
        onToggleStatus: handleToggleStatus,
        onDelete: handleDeletePrompt,
      }),
    []
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const resetAllFilters = () => {
    setCategoryFilter("all");
    setStatusFilter("all");
    setMatchTypeFilter("all");
    setSearchQuery("");
  };

  const hasActiveFilters =
    categoryFilter !== "all" ||
    statusFilter !== "all" ||
    matchTypeFilter !== "all" ||
    searchQuery !== "";

  return (
    <div className="w-full">
      {/* Top Header & Filters Section (Matches Contacts & Team headers exactly) */}
      <div className="flex flex-col gap-4 py-4 px-5">
        {/* Title & Action Button Row */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex-1 text-xl font-medium text-default-900">FAQ</div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5"
              onClick={loadFaqs}
              disabled={loading}
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              <span>Refresh</span>
            </Button>
            <Button
              color="primary"
              size="sm"
              className="h-9 gap-1.5 shadow-none"
              onClick={() => {
                router.push("/faqs/create");
              }}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add FAQ</span>
            </Button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex items-center gap-3 flex-wrap border-t border-default-200 pt-4">
          {/* Category Filter */}
          <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={categoryOpen}
                className="w-[180px] justify-between h-9 text-sm !border !border-default-200 shadow-none bg-background hover:bg-transparent"
              >
                <span className="truncate text-default-700">
                  {categoryFilter === "all"
                    ? "Category"
                    : categoryFilter}
                </span>
                <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Filter category..." />
                <CommandList>
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup>
                    {categoryOptions.map((opt) => (
                      <CommandItem
                        key={opt.value}
                        value={opt.label}
                        onSelect={() => {
                          setCategoryFilter(opt.value);
                          setCategoryOpen(false);
                        }}
                        className="gap-2 cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "h-4 w-4",
                            categoryFilter === opt.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {opt.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Status Filter */}
          <Popover open={statusOpen} onOpenChange={setStatusOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={statusOpen}
                className="w-[140px] justify-between h-9 text-sm !border !border-default-200 shadow-none bg-background hover:bg-transparent"
              >
                <span className="truncate text-default-700">
                  {statusFilter === "all"
                    ? "Status"
                    : statusFilter}
                </span>
                <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[160px] p-0" align="start">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {statusOptions.map((opt) => (
                      <CommandItem
                        key={opt.value}
                        value={opt.label}
                        onSelect={() => {
                          setStatusFilter(opt.value);
                          setStatusOpen(false);
                        }}
                        className="gap-2 cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "h-4 w-4",
                            statusFilter === opt.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {opt.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Match Type Filter */}
          <Popover open={matchTypeOpen} onOpenChange={setMatchTypeOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={matchTypeOpen}
                className="w-[170px] justify-between h-9 text-sm !border !border-default-200 shadow-none bg-background hover:bg-transparent"
              >
                <span className="truncate text-default-700">
                  {matchTypeFilter === "all"
                    ? "Match Type"
                    : matchTypeFilter}
                </span>
                <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[190px] p-0" align="start">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {matchTypeOptions.map((opt) => (
                      <CommandItem
                        key={opt.value}
                        value={opt.label}
                        onSelect={() => {
                          setMatchTypeFilter(opt.value);
                          setMatchTypeOpen(false);
                        }}
                        className="gap-2 cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "h-4 w-4",
                            matchTypeFilter === opt.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {opt.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Created Date Picker */}
          <div className="flex items-center h-9 px-3 rounded-md border border-default-200 bg-background shrink-0 [&_button]:!bg-transparent [&_button]:!border-0 [&_button]:!shadow-none [&_button]:!h-full [&_button]:!px-0 [&_button]:!text-default-600 [&_button]:!text-sm [&_button]:!font-normal">
            <span className="text-sm text-default-500 mr-2">Created Date</span>
            <DateRangePicker className="h-full gap-0 [&>div]:gap-0" />
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetAllFilters}
              className="h-9 px-2.5 text-xs text-default-500 hover:text-destructive gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </Button>
          )}

          <div className="flex-1 min-w-[20px]" />

          {/* Right Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-default-400" />
            <Input
              placeholder="Search FAQ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs !border !border-default-200 shadow-none bg-background focus-visible:!ring-0 focus-visible:!border-default-300"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-auto">
        <Table>
          <TableHeader className="bg-default-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-default-500"
                >
                  Loading FAQs…
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-default-500"
                >
                  No FAQs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Table Pagination */}
      <TablePagination table={table} />

      {/* Action Dialogs */}
      <AddEditFAQDialog
        open={addEditOpen}
        onOpenChange={setAddEditOpen}
        faq={editingFaq}
        onSave={handleSaveFAQ}
      />

      <ViewFAQDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        faq={viewingFaq}
      />

      <DeleteConfirmationDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        toastMessage="FAQ deleted successfully"
      />
    </div>
  );
}
