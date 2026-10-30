import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Carousel } from "./Carousel";

const items = ["A", "B", "C", "D", "E", "F"];

function renderCarousel() {
  render(
    <Carousel
      label="Upcoming events"
      items={items}
      perView={4}
      getKey={(item) => item}
      renderItem={(item) => <a href={`#${item}`}>Event {item}</a>}
    />,
  );
}

describe("Carousel", () => {
  it("labels each slide with its position", () => {
    renderCarousel();
    expect(
      screen.getByRole("region", { name: "Upcoming events" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "1 of 6" })).toHaveTextContent(
      "Event A",
    );
  });

  it("announces the new range and focuses the first new item after paging", async () => {
    const user = userEvent.setup();
    renderCarousel();
    expect(screen.queryByText(/Showing/)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next events" }));

    expect(screen.getByText("Showing 3 to 6 of 6.")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "3 of 6" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Event C" })).toHaveFocus();
  });
});
