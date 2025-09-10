import { filterByDateRange } from "./filterByDateRange";

describe("filterByDateRange", () => {
  const parkrunResults = [
    { date: "2025-05-11", time: 1350, parkrun: "Highbury Fields" } as const,
    { date: "2025-05-10", time: 1450, parkrun: "Highbury Fields" } as const,
    { date: "2025-05-09", time: 1450, parkrun: "Highbury Fields" } as const,
    { date: "2025-04-06", time: 1420, parkrun: "Bushy Park" } as const,
    { date: "2025-04-05", time: 1400, parkrun: "Bushy Park" } as const,
    { date: "2025-04-04", time: 1410, parkrun: "Bushy Park" } as const,
    { date: "2024-03-01", time: 1500, parkrun: "Highbury Fields" } as const,
  ];

  it("returns all parkrun results when date range is not set", () => {
    expect(filterByDateRange(parkrunResults, [null, null])).toBe(
      parkrunResults,
    );
    expect(filterByDateRange(parkrunResults, ["2004-10-02", null])).toBe(
      parkrunResults,
    );
    expect(filterByDateRange(parkrunResults, [null, "2025-09-10"])).toBe(
      parkrunResults,
    );
  });

  it("returns only results in the date range, inclusive of start and end", () => {
    expect(
      filterByDateRange(parkrunResults, ["2025-04-05", "2025-05-10"]),
    ).toEqual([
      { date: "2025-05-10", time: 1450, parkrun: "Highbury Fields" } as const,
      { date: "2025-05-09", time: 1450, parkrun: "Highbury Fields" } as const,
      { date: "2025-04-06", time: 1420, parkrun: "Bushy Park" } as const,
      { date: "2025-04-05", time: 1400, parkrun: "Bushy Park" } as const,
    ]);
  });
});
