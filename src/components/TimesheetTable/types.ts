export interface TimesheetContract {
  id: number;
  name: string;
  projectName: string;
  customerName: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  projectActive: boolean;
}

export interface TimesheetEntry {
  contractId: number;
  date: string; // YYYY-MM-DD
  hours: number | null;
}

export interface TimeOff {
  id: number;
  type: string;
  startsAt: string;
  endsAt: string;
}

export interface TimeEntryResponse {
  timeEntries: {
    id: number;
    date: string;
    hours: number;
    userId: number;
    contractId: number;
  }[];
}

export interface ExpectedHoursResponse {
  expectedHours: number;
  ptoHours: number;
  timeOffs: TimeOff[];
}

export interface SaveResponse {
  success: boolean;
  upserted: number;
  deleted: number;
  error?: string;
}

export interface TimesheetApi {
  fetchTimeEntries(params: {
    userId: number;
    startDate: string;
    endDate: string;
  }): Promise<TimeEntryResponse>;
  fetchExpectedHours(params: {
    startDate: string;
    endDate: string;
  }): Promise<ExpectedHoursResponse>;
  saveTimesheet(entries: TimesheetEntry[]): Promise<SaveResponse>;
}

export type ViewMode = "weekly" | "monthly";

export type GridData = Record<string, number | null>; // key: `${contractId}::${date}`

export interface TimesheetTableProps {
  userId: number;
  userFullName: string;
  contracts: TimesheetContract[];
  api?: Partial<TimesheetApi>;
  baseUrl?: string;
  apiHeaders?: Record<string, string>;
  defaultView?: ViewMode;
  onViewChange?: (view: ViewMode) => void;
  onNavigate?: (params: Record<string, string>) => void;
  initialWeek?: string; // YYYY-MM-DD
  initialMonth?: string; // YYYY-MM
  title?: string;
  className?: string;
}
