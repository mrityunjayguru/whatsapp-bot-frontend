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
import { initialFaqData, FAQDataProps } from "./data";
import { getColumns } from "./columns";
import { AddEditFAQDialog } from "./add-edit-faq-dialog";
import { ViewFAQDialog } from "./view-faq-dialog";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Search, Plus, RefreshCw, PlusCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "@/components/navigation";

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
  const [data, setData] = React.useState<FAQDataProps[]>(initialFaqData);

  React.useEffect(() => {
    const saved = localStorage.getItem("faqs_data");
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      localStorage.setItem("faqs_data", JSON.stringify(initialFaqData));
    }
  }, []);

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

  const handleToggleStatus = (faq: FAQDataProps) => {
    const newStatus: "Active" | "Inactive" = faq.status === "Active" ? "Inactive" : "Active";
    setData((prev) => {
      const updated = prev.map((item) => (item.id === faq.id ? { ...item, status: newStatus } : item));
      localStorage.setItem("faqs_data", JSON.stringify(updated));
      return updated;
    });
    toast.success(`FAQ ${faq.faqId} status set to ${newStatus}`);
  };

  const handleDeletePrompt = (faq: FAQDataProps) => {
    setDeletingFaq(faq);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingFaq) {
      setData((prev) => {
        const updated = prev.filter((item) => item.id !== deletingFaq.id);
        localStorage.setItem("faqs_data", JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleSaveFAQ = (faqDataInput: Partial<FAQDataProps>) => {
    if (editingFaq) {
      // Update
      setData((prev) => {
        const updated = prev.map((item) =>
          item.id === editingFaq.id
            ? ({
                ...item,
                ...faqDataInput,
                updatedAt: new Date().toISOString().split("T")[0],
              } as FAQDataProps)
            : item
        );
        localStorage.setItem("faqs_data", JSON.stringify(updated));
        return updated;
      });
      toast.success("FAQ updated successfully!");
    } else {
      // Create
      const newId = (data.length + 1).toString();
      const newFaqId = `FAQ-10${data.length + 1}`;
      const newFaq: FAQDataProps = {
        id: newId,
        faqId: newFaqId,
        question: faqDataInput.question || "",
        category: faqDataInput.category || "General",
        keywords: faqDataInput.keywords || [],
        answerPreview: faqDataInput.answerPreview || "",
        fullAnswer: faqDataInput.fullAnswer || "",
        attachment: faqDataInput.attachment || null,
        url: faqDataInput.url || "",
        matchType: faqDataInput.matchType || "Exact Match",
        priority: faqDataInput.priority || "Medium",
        status: faqDataInput.status || "Active",
        createdBy: {
          name: "Kathryn Murphy",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kathryn",
        },
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };
      setData((prev) => {
        const updated = [newFaq, ...prev];
        localStorage.setItem("faqs_data", JSON.stringify(updated));
        return updated;
      });
      toast.success("New FAQ added successfully!");
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
      <div className="overflow-x-auto">
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
            {table.getRowModel().rows?.length ? (
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
