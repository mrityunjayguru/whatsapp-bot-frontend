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
  Row,
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
import DateRangePicker from "@/components/date-range-picker";
import TablePagination from "@/app/[locale]/(protected)/contacts/contacts-table/table-pagination";

import { data as initialData, TagProps } from "./data";
import { getColumns } from "./columns";
import { ViewTagDialog } from "./view-tag-dialog";
import { CreateTagDialog } from "./create-tag-dialog";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronsUpDown,
  Plus,
  Search,
  Tag,
  SlidersHorizontal,
  PlusCircle,
} from "lucide-react";

function statusFilterFn(row: Row<TagProps>, columnId: string, filterValue: string) {
  if (!filterValue || filterValue === "all") return true;
  return row.getValue<string>(columnId) === filterValue;
}

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const TagsTable = () => {
  const [tableData, setTableData] = React.useState<TagProps[]>(initialData);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [statusOpen, setStatusOpen] = React.useState(false);

  const [searchTagFilter, setSearchTagFilter] = React.useState<string>("all");
  const [searchTagOpen, setSearchTagOpen] = React.useState(false);

  // Dialog states
  const [viewTag, setViewTag] = React.useState<TagProps | null>(null);
  const [isViewOpen, setIsViewOpen] = React.useState(false);

  const [editTag, setEditTag] = React.useState<TagProps | null>(null);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  const tagSearchOptions = React.useMemo(() => {
    const uniqueTags = Array.from(new Set(tableData.map((d) => d.tagName)));
    return [{ value: "all", label: "All Tags" }, ...uniqueTags.map((t) => ({ value: t, label: t }))];
  }, [tableData]);

  React.useEffect(() => {
    const newFilters: ColumnFiltersState = [];

    if (statusFilter !== "all") {
      newFilters.push({ id: "status", value: statusFilter });
    }
    if (searchTagFilter !== "all") {
      newFilters.push({ id: "tagName", value: searchTagFilter });
    }

    setColumnFilters(newFilters);
  }, [statusFilter, searchTagFilter]);

  const handleView = (tag: TagProps) => {
    setViewTag(tag);
    setIsViewOpen(true);
  };

  const handleEdit = (tag: TagProps) => {
    setEditTag(tag);
    setIsCreateOpen(true);
  };

  const handleDelete = (tag: TagProps) => {
    setTableData((prev) => prev.filter((item) => item.id !== tag.id));
  };

  const handleCreateOrUpdate = (tagData: Partial<TagProps>) => {
    if (editTag) {
      // Update
      setTableData((prev) =>
        prev.map((item) =>
          item.id === editTag.id
            ? {
                ...item,
                ...tagData,
                updatedAt: "Just now",
              }
            : item
        )
      );
      setEditTag(null);
    } else {
      // Create new tag
      const newTag: TagProps = {
        id: String(Date.now()),
        tagId: `TAG-0${tableData.length + 1}`,
        tagName: tagData.tagName || "New Tag",
        description: tagData.description || "",
        numberOfContacts: 0,
        createdBy: "Current User",
        createdByAvatar: "/images/avatar/avatar-1.jpg",
        createdAt: "Just now",
        updatedAt: "Just now",
        status: tagData.status || "Active",
      };
      setTableData((prev) => [newTag, ...prev]);
    }
  };

  const columns = React.useMemo(
    () =>
      getColumns({
        onView: handleView,
      }),
    []
  );

  const table = useReactTable({
    data: tableData,
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
    filterFns: {
      status: statusFilterFn,
    },
  });

  return (
    <div className="w-full">
      {/* Header & Controls Section */}
      <div className="flex flex-col gap-4 py-4 px-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-default-900">Tags</h1>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Search Tag Combobox */}
            <Popover open={searchTagOpen} onOpenChange={setSearchTagOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={searchTagOpen}
                  className="w-[180px] justify-between h-9 text-sm !border !border-default-200 shadow-none bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:border-default-200"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span className={cn("truncate", searchTagFilter === "all" ? "text-default-500" : "text-default-800")}>
                      {searchTagFilter === "all" ? "Search Tag" : searchTagFilter}
                    </span>
                  </span>
                  <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search tag..." />
                  <CommandList>
                    <CommandEmpty>No tag found.</CommandEmpty>
                    <CommandGroup>
                      {tagSearchOptions.map((opt) => (
                        <CommandItem
                          key={opt.value}
                          value={opt.label}
                          onSelect={() => {
                            setSearchTagFilter(searchTagFilter === opt.value ? "all" : opt.value);
                            setSearchTagOpen(false);
                          }}
                          className="gap-2"
                        >
                          <Check
                            className={cn(
                              "h-4 w-4",
                              searchTagFilter === opt.value ? "opacity-100" : "opacity-0"
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

            {/* + Create Tag Button */}
            <Button
              color="primary"
              className="h-9 gap-1.5 shadow-sm"
              onClick={() => {
                setEditTag(null);
                setIsCreateOpen(true);
              }}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Tag</span>
            </Button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex items-center gap-3 flex-wrap border-t border-default-200 pt-4">
          {/* Status Filter */}
          <Popover open={statusOpen} onOpenChange={setStatusOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={statusOpen}
                className="w-[150px] justify-between h-9 text-sm gap-2 !border !border-default-200 shadow-none bg-background hover:bg-transparent hover:text-inherit hover:border-default-200"
              >
                <span className="truncate flex items-center gap-1.5">
                  <span className={statusFilter === "all" ? "text-default-500" : "text-default-800 font-medium"}>
                    {statusOptions.find((s) => s.value === statusFilter)?.label || "Status"}
                  </span>
                </span>
                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[170px] p-1" align="start">
              {statusOptions.map((opt) => (
                <div
                  key={opt.value}
                  className={cn(
                    "flex items-center justify-between rounded-sm px-2.5 py-1.5 text-sm cursor-pointer hover:bg-default-100 dark:hover:bg-default-800 transition-colors",
                    statusFilter === opt.value && "font-semibold text-primary"
                  )}
                  onClick={() => {
                    setStatusFilter(opt.value);
                    setStatusOpen(false);
                  }}
                >
                  <span>{opt.label}</span>
                  {statusFilter === opt.value && <Check className="w-4 h-4 text-primary" />}
                </div>
              ))}
            </PopoverContent>
          </Popover>

          {/* Created Date Range Picker */}
          <div className="flex items-center h-9 px-3 rounded-md border border-default-200 bg-background shrink-0 [&_button]:!bg-transparent [&_button]:!border-0 [&_button]:!shadow-none [&_button]:!h-full [&_button]:!hover:ring-0 [&_button]:!hover:bg-transparent [&_button]:!px-0 [&_button]:!justify-start [&_button]:!text-default-600 [&_button]:!text-sm [&_button]:!font-normal">
            <span className="text-sm text-default-500 mr-2">Created Date</span>
            <DateRangePicker className="h-full gap-0 [&>div]:gap-0" />
          </div>

          <div className="flex-1" />

          {/* Search Input */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-default-400 pointer-events-none" />
            <Input
              placeholder="Search..."
              value={(table.getColumn("tagName")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("tagName")?.setFilterValue(event.target.value)
              }
              className="ps-9 h-9 !border !border-default-200 shadow-none bg-background focus-visible:!ring-0 focus-visible:!border-default-300"
            />
          </div>
        </div>
      </div>

      {/* Table Body */}
      <Table>
        <TableHeader className="bg-default-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
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
                No tags found matching criteria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Table Pagination */}
      <TablePagination table={table} />

      {/* View Tag Dialog */}
      <ViewTagDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        tag={viewTag}
        onEdit={(tag) => {
          setEditTag(tag);
          setIsCreateOpen(true);
        }}
      />

      {/* Create / Edit Tag Dialog */}
      <CreateTagDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        tagToEdit={editTag}
        onSave={handleCreateOrUpdate}
      />
    </div>
  );
};

export default TagsTable;
