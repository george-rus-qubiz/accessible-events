import { useState } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { EventFilters } from "./EventFilters";

const LOCATIONS = ["Berlin, DE", "London, UK"];

/** Holds the filter state, as EventsPage does, so tests drive real updates. */
function StatefulFilters({
  initialSearch = "",
  initialLocation = "",
}: {
  initialSearch?: string;
  initialLocation?: string;
}) {
  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);
  return (
    <EventFilters
      search={search}
      onSearchChange={setSearch}
      location={location}
      onLocationChange={setLocation}
      locations={LOCATIONS}
    />
  );
}

describe("EventFilters accessibility", () => {
  it("has no axe violations with no filters applied", async () => {
    const { container } = render(<StatefulFilters />);
    expect((await axe(container)).violations).toEqual([]);
  });

  it("has no axe violations with filters applied", async () => {
    const { container } = render(
      <StatefulFilters initialSearch="react" initialLocation="Berlin, DE" />,
    );
    expect((await axe(container)).violations).toEqual([]);
  });

  it("exposes the search input as a labelled search field", () => {
    render(<StatefulFilters />);
    const search = screen.getByRole("searchbox", { name: "Search" });
    expect(search).toHaveAttribute("type", "search");
  });

  it("exposes location as a labelled select with an 'All locations' default", () => {
    render(<StatefulFilters />);
    const select = screen.getByRole("combobox", { name: "Location" });
    expect(select).toHaveDisplayValue("All locations");
    expect(
      screen.getAllByRole("option").map((option) => option.textContent),
    ).toEqual(["All locations", ...LOCATIONS]);
  });

  it("hides the decorative arrow from assistive technology", () => {
    const { container } = render(<StatefulFilters />);
    const arrow = Array.from(container.querySelectorAll("span")).find(
      (span) => span.textContent === "▾",
    );
    expect(arrow).toHaveAttribute("aria-hidden", "true");
  });

  it("can be operated with the keyboard in a logical tab order", async () => {
    const user = userEvent.setup();
    render(<StatefulFilters />);

    await user.tab();
    const search = screen.getByRole("searchbox", { name: "Search" });
    expect(search).toHaveFocus();
    await user.keyboard("react");
    expect(search).toHaveValue("react");

    await user.tab();
    const select = screen.getByRole("combobox", { name: "Location" });
    expect(select).toHaveFocus();
    await user.selectOptions(select, "London, UK");
    expect(select).toHaveDisplayValue("London, UK");

    await user.tab();
    expect(
      screen.getByRole("button", { name: "Clear active filters" }),
    ).toHaveFocus();
  });

  it("only shows the clear button while a filter is active", async () => {
    const user = userEvent.setup();
    render(<StatefulFilters />);
    expect(
      screen.queryByRole("button", { name: "Clear active filters" }),
    ).not.toBeInTheDocument();

    await user.type(screen.getByRole("searchbox", { name: "Search" }), "x");
    expect(
      screen.getByRole("button", { name: "Clear active filters" }),
    ).toBeInTheDocument();
  });

  it("names the clear button without reading out the ✕ glyph", () => {
    render(<StatefulFilters initialSearch="react" />);
    const clear = screen.getByRole("button", { name: "Clear active filters" });
    expect(clear).toHaveAccessibleName("Clear active filters");
    expect(clear.querySelector("span")).toHaveAttribute("aria-hidden", "true");
  });

  it("clears every filter when the clear button is activated with the keyboard", async () => {
    const user = userEvent.setup();
    render(<StatefulFilters initialSearch="react" initialLocation="Berlin, DE" />);

    screen.getByRole("button", { name: "Clear active filters" }).focus();
    await user.keyboard("{Enter}");

    expect(screen.getByRole("searchbox", { name: "Search" })).toHaveValue("");
    expect(
      screen.getByRole("combobox", { name: "Location" }),
    ).toHaveDisplayValue("All locations");
  });

  it("keeps focus inside the filters after clearing", async () => {
    const user = userEvent.setup();
    render(<StatefulFilters initialSearch="react" />);

    screen.getByRole("button", { name: "Clear active filters" }).focus();
    await user.keyboard("{Enter}");

    // The clear button unmounts once filters are empty, so focus must move
    // somewhere sensible instead of being dropped to <body>.
    expect(document.body).not.toHaveFocus();
    expect(screen.getByRole("searchbox", { name: "Search" })).toHaveFocus();
  });
});
