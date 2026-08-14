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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
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

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import DateRangePicker from "@/components/date-range-picker"
import TablePagination from "./table-pagination"
import { data as fallbackData } from "./data"
import { columns, DataProps } from "./columns"
import { apisericecon } from "./apiservice"
import { cn } from "@/lib/utils"
import {
    Check,
    ChevronsUpDown,
    Bell,
    Search,
    ChevronDown,
} from "lucide-react"

const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "open", label: "Open" },
    { value: "in-progress", label: "In Progress" },
    { value: "pending", label: "Pending" },
    { value: "closed", label: "Closed" },
]

const defaultTagOptions = ["VIP", "Priority", "Support", "Sales", "New", "Returning"]

const defaultAgentNames = [
    "Michael Chen",
    "Sarah Kim",
    "David Patel",
    "Jessica Brown",
    "Ryan Thompson",
    "Emily Rodriguez",
    "Christopher Lee",
    "Amanda Wilson",
]

function statusFilterFn(row: Row<DataProps>, columnId: string, filterValue: string) {
    if (!filterValue || filterValue === "all") return true
    return row.getValue(columnId) === filterValue
}

function assignedToFilterFn(row: Row<DataProps>, _columnId: string, filterValue: string) {
    if (!filterValue || filterValue === "all") return true
    if (filterValue === "unassigned") return !row.original.assignedTo?.name
    return row.original.assignedTo?.name === filterValue
}

function tagsFilterFn(row: Row<DataProps>, _columnId: string, filterValue: string[]) {
    if (!filterValue || filterValue.length === 0) return true
    const rowTags: string[] = row.original.tags || []
    return filterValue.some((tag) => rowTags.includes(tag))
}

function unreadFilterFn(row: Row<DataProps>, columnId: string, filterValue: boolean) {
    if (!filterValue) return true
    return (row.getValue(columnId) as number) > 0
}

function customerFilterFn(row: Row<DataProps>, columnId: string, filterValue: string) {
    if (!filterValue || filterValue === "all") return true
    const val = row.getValue<string>(columnId)
    return val?.toLowerCase().includes(filterValue.toLowerCase())
}

const ConversationTable = () => {
    const [conversationData, setConversationData] = React.useState<DataProps[]>([])
    const [loading, setLoading] = React.useState(true)

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const [statusFilter, setStatusFilter] = React.useState<string>("all")
    const [assignedToFilter, setAssignedToFilter] = React.useState<string>("all")
    const [tagsFilter, setTagsFilter] = React.useState<string[]>([])
    const [unreadOnly, setUnreadOnly] = React.useState<boolean>(false)
    const [customerFilter, setCustomerFilter] = React.useState<string>("all")
    const [summaryFilter, setSummaryFilter] = React.useState<string>("all")

    const [customerOpen, setCustomerOpen] = React.useState(false)
    const [assignedOpen, setAssignedOpen] = React.useState(false)
    const [tagsOpen, setTagsOpen] = React.useState(false)

    // Load conversations from API on mount
    React.useEffect(() => {
        async function loadConversation() {
            try {
                const response = await apisericecon()
                const resObj = response as any
                const apiData = resObj?.body ?? resObj?.data ?? response ?? []

                if (Array.isArray(apiData) && apiData.length > 0) {
                    const formattedData: DataProps[] = apiData.map((item: any, index: number) => {
                        const customerName = item.profilename ?? item.customerName ?? item.customer?.name ?? item.name ?? "Unknown Customer"
                        const phone = item.phonenumber ?? item.mobile ?? item.phone ?? ""
                        return {
                            ...item, // Preserve all backend API fields without deleting any field
                            id: item.id ?? item._id ?? index + 1,
                            conversationNo: item.conversationNo ?? `CONV-${1000 + index}`,
                            title: item.title ?? "",
                            profilename: customerName,
                            customerName: customerName,
                            customerImage: item.customerImage ?? item.customer?.image ?? "/images/avatar/avatar-1.png",
                            phonenumber: phone,
                            mobile: phone,
                            tags: Array.isArray(item.tags) ? item.tags : [],
                            assignedTo: {
                                name: item.assignedTo?.name ?? item.assignedToName ?? "",
                                image: item.assignedTo?.image ?? "/images/avatar/avatar-2.png",
                            },
                            department: item.department ?? "",
                            status: item.status ?? "open",
                            createdDate: item.createdDate ?? item.createdAt ?? "",
                            lastMessage: item.lastMessage ?? item.message ?? "",
                            lastActivity: item.lastActivity ?? item.updatedAt ?? "",
                            unread: item.unread ?? 0,
                            isChatbot: Boolean(item.isChatbot),
                            action: null,
                        }
                    })
                    setConversationData(formattedData)
                } else {
                    setConversationData(fallbackData)
                }
            } catch (error) {
                console.error("Failed loading conversations, using fallback data:", error)
                setConversationData(fallbackData)
            } finally {
                setLoading(false)
            }
        }

        loadConversation()
    }, [])

    const effectiveData = React.useMemo(() => {
        return conversationData.length > 0 ? conversationData : fallbackData
    }, [conversationData])

    const customerOptions = React.useMemo(() => {
        const uniqueCustomers = Array.from(new Set(effectiveData.map((d) => d.customerName).filter(Boolean)))
        return [{ value: "all", label: "All Customers" }, ...uniqueCustomers.map((c) => ({ value: c, label: c }))]
    }, [effectiveData])

    const agentOptions = React.useMemo(() => {
        const dynamicAgents = Array.from(new Set(effectiveData.map((d) => d.assignedTo?.name).filter(Boolean)))
        const combined = Array.from(new Set([...defaultAgentNames, ...dynamicAgents]))
        return [
            { value: "all", label: "All Agents" },
            ...combined.map((a) => ({ value: a, label: a })),
            { value: "unassigned", label: "Unassigned" },
        ]
    }, [effectiveData])

    const tagOptions = React.useMemo(() => {
        const dynamicTags = Array.from(new Set(effectiveData.flatMap((d) => d.tags || []).filter(Boolean)))
        return Array.from(new Set([...defaultTagOptions, ...dynamicTags]))
    }, [effectiveData])

    const summaryCounts = React.useMemo(() => {
        const counts = { all: effectiveData.length, open: 0, pending: 0, resolved: 0, closed: 0 }
        effectiveData.forEach((d) => {
            if (d.status === "open") counts.open++
            if (d.status === "pending") counts.pending++
            if (d.status === "in-progress") counts.resolved++
            if (d.status === "closed") counts.closed++
        })
        return counts
    }, [effectiveData])

    React.useEffect(() => {
        const newFilters: ColumnFiltersState = []

        if (summaryFilter !== "all") {
            newFilters.push({ id: "status", value: summaryFilter })
        } else if (statusFilter !== "all") {
            newFilters.push({ id: "status", value: statusFilter })
        }

        if (assignedToFilter !== "all") {
            newFilters.push({ id: "assignedTo", value: assignedToFilter })
        }
        if (tagsFilter.length > 0) {
            newFilters.push({ id: "tags", value: tagsFilter })
        }
        if (unreadOnly) {
            newFilters.push({ id: "unread", value: unreadOnly })
        }
        if (customerFilter !== "all") {
            newFilters.push({ id: "customerName", value: customerFilter })
        }

        setColumnFilters(newFilters)
    }, [statusFilter, assignedToFilter, tagsFilter, unreadOnly, customerFilter, summaryFilter])

    const columnsWithFilters = React.useMemo(() => {
        return columns.map((col) => {
            if ("accessorKey" in col) {
                if (col.accessorKey === "status") return { ...col, filterFn: statusFilterFn }
                if (col.accessorKey === "assignedTo") return { ...col, filterFn: assignedToFilterFn }
                if (col.accessorKey === "tags") return { ...col, filterFn: tagsFilterFn }
                if (col.accessorKey === "unread") return { ...col, filterFn: unreadFilterFn }
                if (col.accessorKey === "customerName") return { ...col, filterFn: customerFilterFn }
            }
            return col
        })
    }, [])

    const table = useReactTable({
        data: effectiveData,
        columns: columnsWithFilters,
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
    })

    if (loading) {
        return (
            <div className="p-5 text-center text-default-500">
                Loading conversations...
            </div>
        )
    }

    return (
        <div className="w-full">
            <div className="flex flex-col gap-4 py-4 px-5">
                {/* Header Title & Summary Cards Dropdown */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex-1 text-xl font-medium text-default-900">Conversations</div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-9 min-w-[160px] justify-between gap-2 px-4 !border !border-default-200 shadow-none bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:ring-transparent hover:border-default-200"
                            >
                                <span className="flex items-center gap-2">
                                    Summary Cards : {summaryFilter === "all" ? "All" : summaryFilter === "in-progress" ? "Resolved" : summaryFilter.charAt(0).toUpperCase() + summaryFilter.slice(1)}
                                    <Badge className="ms-1 h-5 min-w-[22px] rounded-full bg-default-200 text-default-700 px-1.5 text-[10px] font-semibold">
                                        {summaryFilter === "all" && summaryCounts.all}
                                        {summaryFilter === "open" && summaryCounts.open}
                                        {summaryFilter === "pending" && summaryCounts.pending}
                                        {summaryFilter === "in-progress" && summaryCounts.resolved}
                                        {summaryFilter === "closed" && summaryCounts.closed}
                                    </Badge>
                                </span>
                                <ChevronDown className="w-4 h-4 text-default-500" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px] p-1">
                            <DropdownMenuLabel>Summary Cards : </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup
                                value={summaryFilter}
                                onValueChange={(v) => {
                                    setSummaryFilter(v)
                                    if (v !== "all") setStatusFilter("all")
                                }}
                            >
                                <DropdownMenuRadioItem value="all" className="gap-2 py-2 focus:bg-default-100 dark:focus:bg-default-800 focus:text-default-900 dark:focus:text-default-100 data-[state=checked]:focus:bg-default-100 dark:data-[state=checked]:focus:bg-default-800">
                                    All
                                    <Badge className="ms-auto h-5 min-w-[22px] rounded-full bg-default-200 text-default-700 px-1.5 text-[10px] font-semibold">
                                        {summaryCounts.all}
                                    </Badge>
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="open" className="gap-2 py-2 focus:bg-blue-50 dark:focus:bg-blue-950/50 focus:text-blue-900 dark:focus:text-blue-100 data-[state=checked]:focus:bg-blue-50 dark:data-[state=checked]:focus:bg-blue-950/50">
                                    Open
                                    <Badge className="ms-auto h-5 min-w-[22px] rounded-full bg-blue-500/15 text-blue-600 px-1.5 text-[10px] font-semibold">
                                        {summaryCounts.open}
                                    </Badge>
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="pending" className="gap-2 py-2 focus:bg-default-100 dark:focus:bg-default-800 focus:text-default-900 dark:focus:text-default-100 data-[state=checked]:focus:bg-default-100 dark:data-[state=checked]:focus:bg-default-800">
                                    Pending
                                    <Badge className="ms-auto h-5 min-w-[22px] rounded-full bg-default-300/40 text-default-700 px-1.5 text-[10px] font-semibold">
                                        {summaryCounts.pending}
                                    </Badge>
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="in-progress" className="gap-2 py-2 focus:bg-amber-50 dark:focus:bg-amber-950/50 focus:text-amber-900 dark:focus:text-amber-100 data-[state=checked]:focus:bg-amber-50 dark:data-[state=checked]:focus:bg-amber-950/50">
                                    Resolved
                                    <Badge className="ms-auto h-5 min-w-[22px] rounded-full bg-amber-500/15 text-amber-600 px-1.5 text-[10px] font-semibold">
                                        {summaryCounts.resolved}
                                    </Badge>
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="closed" className="gap-2 py-2 focus:bg-emerald-50 dark:focus:bg-emerald-950/50 focus:text-emerald-900 dark:focus:text-emerald-100 data-[state=checked]:focus:bg-emerald-50 dark:data-[state=checked]:focus:bg-emerald-950/50">
                                    Closed
                                    <Badge className="ms-auto h-5 min-w-[22px] rounded-full bg-emerald-500/15 text-emerald-600 px-1.5 text-[10px] font-semibold">
                                        {summaryCounts.closed}
                                    </Badge>
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Filter Controls Row */}
                <div className="flex items-center gap-3 flex-wrap border-t border-default-200 pt-4">
                    {/* Status Dropdown */}
                    <Select
                        value={summaryFilter !== "all" ? summaryFilter : statusFilter}
                        onValueChange={(v) => {
                            setStatusFilter(v)
                            setSummaryFilter("all")
                        }}
                    >
                        <SelectTrigger className="w-[160px] !border !border-default-200 shadow-none bg-background" size="default">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Assigned To Dropdown */}
                    <Popover open={assignedOpen} onOpenChange={setAssignedOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={assignedOpen}
                                className="w-[200px] justify-between h-9 text-sm !border !border-default-200 shadow-none bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:ring-transparent hover:border-default-200"
                            >
                                {assignedToFilter === "all" ? (
                                    <span className="text-default-500">Assigned To</span>
                                ) : (
                                    <span className="text-default-800">{agentOptions.find((a) => a.value === assignedToFilter)?.label || assignedToFilter}</span>
                                )}
                                <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0" align="start">
                            <Command>
                                <CommandInput placeholder="Search agent..." />
                                <CommandList>
                                    <CommandEmpty>No agent found.</CommandEmpty>
                                    <CommandGroup>
                                        {agentOptions.map((opt) => (
                                            <CommandItem
                                                key={opt.value}
                                                value={opt.label}
                                                onSelect={() => {
                                                    setAssignedToFilter(assignedToFilter === opt.value ? "all" : opt.value)
                                                    setAssignedOpen(false)
                                                }}
                                                className="gap-2 data-[selected=true]:bg-default-100 dark:data-[selected=true]:bg-default-800 data-[selected=true]:text-default-900 dark:data-[selected=true]:text-default-100"
                                            >
                                                <Check
                                                    className={cn(
                                                        "h-4 w-4",
                                                        assignedToFilter === opt.value ? "opacity-100" : "opacity-0"
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

                    {/* Tags Dropdown */}
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

                    {/* Date Range Picker */}
                    <div className="flex items-center h-9 px-3 rounded-md border border-default-200 bg-background shrink-0 [&_button]:!bg-transparent [&_button]:!border-0 [&_button]:!shadow-none [&_button]:!h-full [&_button]:!hover:ring-0 [&_button]:!hover:bg-transparent [&_button]:!px-0 [&_button]:!justify-start [&_button]:!text-default-600 [&_button]:!text-sm [&_button]:!font-normal">
                        <DateRangePicker className="h-full gap-0 [&>div]:gap-0" />
                    </div>

                    {/* Unread Switch */}
                    <div className="flex items-center gap-2 h-9 px-3 rounded-md border border-default-200 bg-background shrink-0">
                        <Bell className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-default-700 whitespace-nowrap">Unread</span>
                        <Switch
                            checked={unreadOnly}
                            onCheckedChange={setUnreadOnly}
                            color="primary"
                            size="sm"
                        />
                    </div>

                    {/* Search Customer Combobox Dropdown */}
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
                                            ? "Search Customer"
                                            : customerFilter}
                                    </span>
                                </span>
                                <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[260px] p-0" align="start">
                            <Command>
                                <CommandInput placeholder="Search customer..." />
                                <CommandList>
                                    <CommandEmpty>No customer found.</CommandEmpty>
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

                    {/* Search Conversations Text Input */}
                    <Input
                        placeholder="Search conversations..."
                        value={(table.getColumn("customerName")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("customerName")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm h-9 !border !border-default-200 shadow-none bg-background focus-visible:!ring-0 focus-visible:!border-default-300"
                    />
                </div>
            </div>

            {/* Table */}
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
                                No results found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <TablePagination table={table} />
        </div>
    )
}

export default ConversationTable
