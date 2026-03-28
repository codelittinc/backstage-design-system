import type {
  TimesheetApi,
  TimeEntryResponse,
  ExpectedHoursResponse,
  SaveResponse,
  TimesheetEntry,
} from "./types";

export function createDefaultApi(baseUrl: string = ""): TimesheetApi {
  return {
    async fetchTimeEntries(params): Promise<TimeEntryResponse> {
      const searchParams = new URLSearchParams({
        userId: params.userId.toString(),
        startDate: params.startDate,
        endDate: params.endDate,
        limit: "200",
      });
      const res = await fetch(
        `${baseUrl}/api/time-entries?${searchParams}`
      );
      if (!res.ok) throw new Error("Failed to fetch time entries");
      return res.json();
    },

    async fetchExpectedHours(params): Promise<ExpectedHoursResponse> {
      const searchParams = new URLSearchParams({
        startDate: params.startDate,
        endDate: params.endDate,
      });
      const res = await fetch(
        `${baseUrl}/api/my-timesheets/expected-hours?${searchParams}`
      );
      if (!res.ok) throw new Error("Failed to fetch expected hours");
      return res.json();
    },

    async saveTimesheet(entries: TimesheetEntry[]): Promise<SaveResponse> {
      const res = await fetch(`${baseUrl}/api/my-timesheets/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      return res.json();
    },
  };
}
