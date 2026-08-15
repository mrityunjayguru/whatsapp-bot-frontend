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

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "@/components/navigation";
import DateRangePicker from "@/components/date-range-picker";
import TablePagination from "./table-pagination";
import { initialChatbots, ChatbotDataProps } from "./data";
import { getChatbotColumns } from "./columns";
import { ChatbotSettingsSheet } from "./chatbot-settings-sheet";
import { TestChatbotDialog } from "./test-chatbot-dialog";
import { cn } from "@/lib/utils";
import {
  ChevronsUpDown,
  Search,
  Bot,
  Play,
  Plus,
  Sparkles,
  PlusCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

const statusOptions = ["Active", "Inactive"];
const modeOptions = ["Chatbot", "Human", "Hybrid"];

function statusFilterFn(row: Row<ChatbotDataProps>, _columnId: string, filterValue: string[]) {
  if (!filterValue || filterValue.length === 0) return true;
  return filterValue.includes(row.original.status);
}

function modeFilterFn(row: Row<ChatbotDataProps>, _columnId: string, filterValue: string[]) {
  if (!filterValue || filterValue.length === 0) return true;
  return filterValue.includes(row.original.currentMode);
}

function handoverFilterFn(row: Row<ChatbotDataProps>, _columnId: string, filterValue: boolean) {
  if (!filterValue) return true;
  return row.original.humanHandoverEnabled;
}

const ChatbotTable = () => {
  const [data, setData] = React.useState<ChatbotDataProps[]>(initialChatbots);

  // Load from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("chatbots_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setData(parsed);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [statusFilter, setStatusFilter] = React.useState<string[]>([]);
  const [modeFilter, setModeFilter] = React.useState<string[]>([]);
  const [handoverOnly, setHandoverOnly] = React.useState<boolean>(false);

  const [statusOpen, setStatusOpen] = React.useState(false);
  const [modeOpen, setModeOpen] = React.useState(false);

  // Modals state
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [selectedBotForSettings, setSelectedBotForSettings] = React.useState<ChatbotDataProps | null>(null);

  const [testOpen, setTestOpen] = React.useState(false);
  const [selectedBotForTest, setSelectedBotForTest] = React.useState<ChatbotDataProps | null>(null);

  // Callbacks for table actions
  const handleOpenSettings = (bot: ChatbotDataProps) => {
    setSelectedBotForSettings(bot);
    setSettingsOpen(true);
  };

  const handleOpenTest = (bot: ChatbotDataProps) => {
    setSelectedBotForTest(bot);
    setTestOpen(true);
  };

  const handleToggleEnable = (botId: string, enabled: boolean) => {
    const updated = data.map((item) =>
      item.id === botId ? { ...item, enabled } : item
    );
    setData(updated);
    localStorage.setItem("chatbots_data", JSON.stringify(updated));
    const bot = data.find((b) => b.id === botId);
    toast.success(`"${bot?.name || "Chatbot"}" ${enabled ? "enabled" : "disabled"}`);
  };

  const handleToggleHandover = (botId: string, handover: boolean) => {
    const updated = data.map((item) =>
      item.id === botId ? { ...item, humanHandoverEnabled: handover } : item
    );
    setData(updated);
    localStorage.setItem("chatbots_data", JSON.stringify(updated));
    const bot = data.find((b) => b.id === botId);
    toast.success(`Human Handover ${handover ? "enabled" : "disabled"} for "${bot?.name}"`);
  };

  const handleSaveBotSettings = (updatedBot: ChatbotDataProps) => {
    const updated = data.map((item) => (item.id === updatedBot.id ? updatedBot : item));
    setData(updated);
    localStorage.setItem("chatbots_data", JSON.stringify(updated));
  };

  React.useEffect(() => {
    const newFilters: ColumnFiltersState = [];

    if (statusFilter.length > 0) {
      newFilters.push({ id: "status", value: statusFilter });
    }
    if (modeFilter.length > 0) {
      newFilters.push({ id: "currentMode", value: modeFilter });
    }
    if (handoverOnly) {
      newFilters.push({ id: "humanHandoverEnabled", value: handoverOnly });
    }

    setColumnFilters(newFilters);
  }, [statusFilter, modeFilter, handoverOnly]);

  const columns = React.useMemo(
    () =>
      getChatbotColumns({
        onOpenSettings: handleOpenSettings,
        onOpenTest: handleOpenTest,
        onToggleEnable: handleToggleEnable,
        onToggleHandover: handleToggleHandover,
      }),
    [data]
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
    filterFns: {
      status: statusFilterFn as any,
      currentMode: modeFilterFn as any,
      humanHandoverEnabled: handoverFilterFn as any,
    },
  });

  const activeCount = data.filter((b) => b.status === "Active").length;
  const inactiveCount = data.filter((b) => b.status === "Inactive").length;

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 py-4 px-5">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-medium text-default-900">Chatbot</h1>
            <div className="flex items-center gap-1.5">
              <Badge className="bg-emerald-500/15 text-emerald-600 border-0 text-xs px-2.5 py-0.5 font-medium">
                {activeCount} Active
              </Badge>
              <Badge className="bg-slate-500/15 text-slate-600 border-0 text-xs px-2.5 py-0.5 font-medium">
                {inactiveCount} Inactive
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
         
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2 !border !border-default-200 shadow-none bg-background hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-600 hover:text-emerald-700 hover:border-emerald-500/30"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Test Chatbot</span>
            </Button>
            <Button
            color="primary"
            size="sm"
            className="h-9 gap-1.5 shadow-none"
            onClick={() => {
              // router.push("/faqs/create");
            }}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Chatbot</span>
          </Button>
          </div>
        </div>

        {/* Toolbar / Filters matching Contacts Table */}
        <div className="flex items-center gap-3 flex-wrap border-t border-default-200 pt-4">
          {/* Chatbot Status Filter */}
          <Popover open={statusOpen} onOpenChange={setStatusOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={statusOpen}
                className="w-[180px] justify-between h-9 text-sm gap-2 !border !border-default-200 shadow-none bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:ring-transparent hover:border-default-200"
              >
                <span className="truncate flex items-center gap-1.5">
                  {statusFilter.length === 0 ? (
                    <span className="text-default-500">Chatbot Status</span>
                  ) : (
                    <>
                      <span className="text-default-800">{statusFilter.length} selected</span>
                      {statusFilter.slice(0, 1).map((s) => (
                        <Badge key={s} className="h-4 rounded-full px-1.5 text-[9px] font-medium bg-default-200 text-default-700">
                          {s}
                        </Badge>
                      ))}
                    </>
                  )}
                </span>
                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2" align="start">
              <div className="space-y-1">
                <div className="px-2 py-1 text-xs font-semibold text-default-500">
                  Select Chatbot Status
                </div>
                {statusOptions.map((st) => (
                  <div
                    key={st}
                    className="flex items-center gap-2 w-full rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-default-100 dark:hover:bg-default-800 transition-colors"
                    onClick={() => {
                      setStatusFilter((prev) =>
                        prev.includes(st)
                          ? prev.filter((item) => item !== st)
                          : [...prev, st]
                      );
                    }}
                  >
                    <Checkbox
                      checked={statusFilter.includes(st)}
                      className="pointer-events-none"
                    />
                    <span>{st}</span>
                  </div>
                ))}
                {statusFilter.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs text-default-500 hover:text-destructive h-8 px-2 mt-1"
                    onClick={() => setStatusFilter([])}
                  >
                    Clear filter
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Current Mode Filter */}
          <Popover open={modeOpen} onOpenChange={setModeOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={modeOpen}
                className="w-[180px] justify-between h-9 text-sm gap-2 !border !border-default-200 shadow-none bg-background hover:bg-transparent hover:text-inherit hover:ring-0 hover:ring-transparent hover:border-default-200"
              >
                <span className="truncate flex items-center gap-1.5">
                  {modeFilter.length === 0 ? (
                    <span className="text-default-500">Current Mode</span>
                  ) : (
                    <>
                      <span className="text-default-800">{modeFilter.length} selected</span>
                      {modeFilter.slice(0, 1).map((m) => (
                        <Badge key={m} className="h-4 rounded-full px-1.5 text-[9px] font-medium bg-default-200 text-default-700">
                          {m}
                        </Badge>
                      ))}
                    </>
                  )}
                </span>
                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2" align="start">
              <div className="space-y-1">
                <div className="px-2 py-1 text-xs font-semibold text-default-500">
                  Select Current Mode
                </div>
                {modeOptions.map((md) => (
                  <div
                    key={md}
                    className="flex items-center gap-2 w-full rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-default-100 dark:hover:bg-default-800 transition-colors"
                    onClick={() => {
                      setModeFilter((prev) =>
                        prev.includes(md)
                          ? prev.filter((item) => item !== md)
                          : [...prev, md]
                      );
                    }}
                  >
                    <Checkbox
                      checked={modeFilter.includes(md)}
                      className="pointer-events-none"
                    />
                    <span>{md}</span>
                  </div>
                ))}
                {modeFilter.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs text-default-500 hover:text-destructive h-8 px-2 mt-1"
                    onClick={() => setModeFilter([])}
                  >
                    Clear filter
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Date Picker */}
          <div className="flex items-center h-9 px-3 rounded-md border border-default-200 bg-background shrink-0 [&_button]:!bg-transparent [&_button]:!border-0 [&_button]:!shadow-none [&_button]:!h-full [&_button]:!hover:ring-0 [&_button]:!hover:bg-transparent [&_button]:!px-0 [&_button]:!justify-start [&_button]:!text-default-600 [&_button]:!text-sm [&_button]:!font-normal">
            <span className="text-sm text-default-500 mr-2">Created Date</span>
            <DateRangePicker className="h-full gap-0 [&>div]:gap-0" />
          </div>

          {/* Human Handover Filter Toggle */}
          <div className="flex items-center gap-2 h-9 px-3 rounded-md border border-default-200 bg-background shrink-0">
            <span className="text-sm text-default-700 whitespace-nowrap">Handover Enabled</span>
            <Switch
              checked={handoverOnly}
              onCheckedChange={setHandoverOnly}
              color="primary"
              size="sm"
            />
          </div>

          <div className="flex-1" />

          {/* Search Input */}
          <Input
            placeholder="Search chatbot name, number..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm h-9 !border !border-default-200 shadow-none bg-background focus-visible:!ring-0 focus-visible:!border-default-300"
          />
        </div>
      </div>

      {/* Table Component */}
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
                className="hover:bg-default-100/50 transition-colors"
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
                No chatbots found matching criteria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <TablePagination table={table} />

      {/* Slide-over Sheet for Open Chatbot Settings */}
      <ChatbotSettingsSheet
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        bot={selectedBotForSettings}
        onSave={handleSaveBotSettings}
      />

      {/* Modal for Test Chatbot */}
      <TestChatbotDialog
        open={testOpen}
        onOpenChange={setTestOpen}
        bot={selectedBotForTest}
        allBots={data}
      />
    </div>
  );
};

export default ChatbotTable;
