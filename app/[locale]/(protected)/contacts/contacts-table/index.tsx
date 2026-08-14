"use client"

import * as React from "react"
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
} from "@tanstack/react-table"

import { Input } from "@/components/ui/input"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import DateRangePicker from "@/components/date-range-picker"

import TablePagination from "./table-pagination"
import { data } from "./data"
import { columns, DataProps } from "./columns"
import { cn } from "@/lib/utils"
import {
    Check,
    ChevronsUpDown,
    Search,
} from "lucide-react"

const tagOptions = ["VIP", "Priority", "Support", "Sales", "New", "Returning"]

function tagsFilterFn(row: Row<DataProps>, _columnId: string, filterValue: string[]) {
    if (!filterValue || filterValue.length === 0) return true
    const rowTags: string[] = row.original.tags || []
    return filterValue.some((tag) => rowTags.includes(tag))
}

function customerFilterFn(row: Row<DataProps>, columnId: string, filterValue: string) {
    if (!filterValue || filterValue === "all") return true
    return row.getValue<string>(columnId) === filterValue
}

function hasEmailFilterFn(row: Row<DataProps>, columnId: string, filterValue: boolean) {
    if (!filterValue) return true
    return !!row.original.email;
}

function hasTagsFilterFn(row: Row<DataProps>, columnId: string, filterValue: boolean) {
    if (!filterValue) return true
    return row.original.tags && row.original.tags.length > 0;
}

const ContactTable = () => {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const [tagsFilter, setTagsFilter] = React.useState<string[]>([])
    const [hasEmailOnly, setHasEmailOnly] = React.useState<boolean>(false)
    const [hasTagsOnly, setHasTagsOnly] = React.useState<boolean>(false)
    const [customerFilter, setCustomerFilter] = React.useState<string>("all")

    const [customerOpen, setCustomerOpen] = React.useState(false)
    const [tagsOpen, setTagsOpen] = React.useState(false)

    const customerOptions = React.useMemo(() => {
        const uniqueCustomers = Array.from(new Set(data.map((d) => d.customerName)))
        return [{ value: "all", label: "All Contacts" }, ...uniqueCustomers.map((c) => ({ value: c, label: c }))]
    }, [])

    React.useEffect(() => {
        const newFilters: ColumnFiltersState = []

        if (tagsFilter.length > 0) {
            newFilters.push({ id: "tags", value: tagsFilter })
        }
        if (hasEmailOnly) {
            newFilters.push({ id: "email", value: hasEmailOnly })
        }
        if (hasTagsOnly) {
            newFilters.push({ id: "hasTags", value: hasTagsOnly }) // using dummy id to trigger filter
        }
        if (customerFilter !== "all") {
            newFilters.push({ id: "customerName", value: customerFilter })
        }

        setColumnFilters(newFilters)
    }, [tagsFilter, hasEmailOnly, hasTagsOnly, customerFilter])

    const table = useReactTable({
        data: data,
        columns: columns,
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
            tags: tagsFilterFn,
            customerName: customerFilterFn,
            email: hasEmailFilterFn as any,
            hasTags: hasTagsFilterFn as any,
        },
    })

    return (
        <div className="w-full">
            <div className="flex flex-col gap-4 py-4 px-5">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex-1 text-xl font-medium text-default-900">Contacts</div>
                </div>

                <div className="flex items-center gap-3 flex-wrap border-t border-default-200 pt-4">
                    <Popover open={tagsOpen} onOpenChange={setTagsOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={tagsOpen}
                                className="w-[180px] justify-between h-9 text-sm gap-2 !border !border-default-200 shadow-none bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:ring-transparent hover:border-default-200"
                            >
                                <span className="truncate flex items-center gap-1.5">
                                    {tagsFilter.length === 0 ? (
                                        <span className="text-default-500">Tags</span>
                                    ) : (
                                        <>
                                            <span className="text-default-800">{tagsFilter.length} selected</span>
                                            {tagsFilter.slice(0, 1).map((t) => (
                                                <Badge key={t} className="h-4 rounded-full px-1.5 text-[9px] font-medium bg-default-200 text-default-700">
                                                    {t}
                                                </Badge>
                                            ))}
                                            {tagsFilter.length > 1 && (
                                                <Badge className="h-4 rounded-full px-1.5 text-[9px] font-medium bg-default-200 text-default-700">
                                                    +{tagsFilter.length - 1}
                                                </Badge>
                                            )}
                                        </>
                                    )}
                                </span>
                                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[220px] p-1" align="start">
                            <div className="space-y-0.5">
                                <div className="px-2 py-1.5 text-xs font-semibold text-default-500">
                                    Select Tags
                                </div>
                                {tagOptions.map((tag) => (
                                    <DropdownMenuCheckboxItem
                                        key={tag}
                                        asChild
                                    >
                                        <div
                                            className="flex items-center gap-2 w-full rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-default-100 dark:hover:bg-default-800 transition-colors"
                                            onClick={() => {
                                                setTagsFilter((prev) =>
                                                    prev.includes(tag)
                                                        ? prev.filter((t) => t !== tag)
                                                        : [...prev, tag]
                                                )
                                            }}
                                        >
                                            <Checkbox
                                                checked={tagsFilter.includes(tag)}
                                                color="primary"
                                                className="pointer-events-none"
                                            />
                                            <span>{tag}</span>
                                        </div>
                                    </DropdownMenuCheckboxItem>
                                ))}
                                {tagsFilter.length > 0 && (
                                    <>
                                        <DropdownMenuSeparator className="my-1" />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-start text-xs text-default-500 hover:text-destructive h-8 px-2 hover:bg-destructive/5 dark:hover:bg-destructive/10"
                                            onClick={() => setTagsFilter([])}
                                        >
                                            Clear tags
                                        </Button>
                                    </>
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>

                    <div className="flex items-center h-9 px-3 rounded-md border border-default-200 bg-background shrink-0 [&_button]:!bg-transparent [&_button]:!border-0 [&_button]:!shadow-none [&_button]:!h-full [&_button]:!hover:ring-0 [&_button]:!hover:bg-transparent [&_button]:!px-0 [&_button]:!justify-start [&_button]:!text-default-600 [&_button]:!text-sm [&_button]:!font-normal">
                        <span className="text-sm text-default-500 mr-2">Created Date</span>
                        <DateRangePicker className="h-full gap-0 [&>div]:gap-0" />
                    </div>

                    <div className="flex items-center h-9 px-3 rounded-md border border-default-200 bg-background shrink-0 [&_button]:!bg-transparent [&_button]:!border-0 [&_button]:!shadow-none [&_button]:!h-full [&_button]:!hover:ring-0 [&_button]:!hover:bg-transparent [&_button]:!px-0 [&_button]:!justify-start [&_button]:!text-default-600 [&_button]:!text-sm [&_button]:!font-normal">
                        <span className="text-sm text-default-500 mr-2">Last Conversation</span>
                        <DateRangePicker className="h-full gap-0 [&>div]:gap-0" />
                    </div>

                    <div className="flex items-center gap-2 h-9 px-3 rounded-md border border-default-200 bg-background shrink-0">
                        <span className="text-sm text-default-700 whitespace-nowrap">Has Email</span>
                        <Switch
                            checked={hasEmailOnly}
                            onCheckedChange={setHasEmailOnly}
                            color="primary"
                            size="sm"
                        />
                    </div>

                    <div className="flex items-center gap-2 h-9 px-3 rounded-md border border-default-200 bg-background shrink-0">
                        <span className="text-sm text-default-700 whitespace-nowrap">Has Tags</span>
                        <Switch
                            checked={hasTagsOnly}
                            onCheckedChange={setHasTagsOnly}
                            color="primary"
                            size="sm"
                        />
                    </div>

                    <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={customerOpen}
                                className="w-[220px] justify-between h-9 text-sm !border !border-default-200 shadow-none bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:ring-transparent hover:border-default-200"
                            >
                                <span className="flex items-center gap-2 min-w-0">
                                    <Search className="w-3.5 h-3.5 text-default-500 shrink-0" />
                                    <span className={cn("truncate", customerFilter === "all" ? "text-default-500" : "text-default-800")}>
                                        {customerFilter === "all"
                                            ? "Search Contact"
                                            : customerFilter}
                                    </span>
                                </span>
                                <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[260px] p-0" align="start">
                            <Command>
                                <CommandInput placeholder="Search contact..." />
                                <CommandList>
                                    <CommandEmpty>No contact found.</CommandEmpty>
                                    <CommandGroup>
                                        {customerOptions.map((opt) => (
                                            <CommandItem
                                                key={opt.value}
                                                value={opt.label}
                                                onSelect={() => {
                                                    setCustomerFilter(customerFilter === opt.value ? "all" : opt.value)
                                                    setCustomerOpen(false)
                                                }}
                                                className="gap-2 data-[selected=true]:bg-default-100 dark:data-[selected=true]:bg-default-800 data-[selected=true]:text-default-900 dark:data-[selected=true]:text-default-100"
                                            >
                                                <Check
                                                    className={cn(
                                                        "h-4 w-4",
                                                        customerFilter === opt.value ? "opacity-100" : "opacity-0"
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

                    <div className="flex-1" />

                    <Input
                        placeholder="Search contacts..."
                        value={(table.getColumn("customerName")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("customerName")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm h-9 !border !border-default-200 shadow-none bg-background focus-visible:!ring-0 focus-visible:!border-default-300"
                    />
                </div>
            </div>

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
                                )
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
                                className="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <TablePagination table={table} />
        </div>
    )
}
export default ContactTable;
