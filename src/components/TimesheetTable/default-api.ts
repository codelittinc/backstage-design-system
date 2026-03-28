import type {
  TimesheetApi,
  TimeEntryResponse,
  ExpectedHoursResponse,
  SaveResponse,
  TimesheetEntry,
} from "./types";

export function createDefaultApi(
  baseUrl: string = "",
  extraHeaders: Record<string, string> = {}
): TimesheetApi {
  const headers = (contentType?: string): Record<string, string> => ({
    ...extraHeaders,
    ...(contentType ? { "Content-Type": contentType } : {}),
  });

  return {
    async fetchTimeEntries(params): Promise<TimeEntryResponse> {
      const searchParams = new URLSearchParams({
        startDate: params.startDate,
        endDate: params.endDate,
      });
      const res = await fetch(
        `${baseUrl}/api/my-timesheets/entries?${searchParams}`,
        { headers: headers() }
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
        `${baseUrl}/api/my-timesheets/expected-hours?${searchParams}`,
        { headers: headers() }
      );
      if (!res.ok) throw new Error("Failed to fetch expected hours");
      return res.json();
    },

    async saveTimesheet(entries: TimesheetEntry[]): Promise<SaveResponse> {
      const res = await fetch(`${baseUrl}/api/my-timesheets/save`, {
        method: "POST",
        headers: headers("application/json"),
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
