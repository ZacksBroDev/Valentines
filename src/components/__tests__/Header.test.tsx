import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../test/test-utils";
import { Header } from "../Header";

// Mock storage module
vi.mock("../../utils/storage", () => ({
  getNotes: vi.fn(() => []),
}));

describe("Header", () => {
  const defaultProps = {
    isMuted: false,
    onToggleMute: vi.fn(),
    onOpenFavorites: vi.fn(),
    onOpenSettings: vi.fn(),
    onOpenNotes: vi.fn(),
    favoritesCount: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the header with title", () => {
    render(<Header {...defaultProps} />);

    expect(screen.getByText("Compliment Deck")).toBeInTheDocument();
    expect(screen.getByText(/made with/)).toBeInTheDocument();
  });

  it("should call onToggleMute when sound button is clicked", async () => {
    const user = userEvent.setup();
    render(<Header {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: /mute sounds/i }));

    expect(defaultProps.onToggleMute).toHaveBeenCalledTimes(1);
  });

  it("should show unmute label when muted", () => {
    render(<Header {...defaultProps} isMuted={true} />);

    expect(
      screen.getByRole("button", { name: /unmute sounds/i })
    ).toBeInTheDocument();
  });

  it("should call onOpenSettings when settings button is clicked", async () => {
    const user = userEvent.setup();
    render(<Header {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: /settings/i }));

    expect(defaultProps.onOpenSettings).toHaveBeenCalledTimes(1);
  });

  it("should call onOpenFavorites when favorites button is clicked", async () => {
    const user = userEvent.setup();
    render(<Header {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: /favorites/i }));

    expect(defaultProps.onOpenFavorites).toHaveBeenCalledTimes(1);
  });

  it("should call onOpenNotes when notes button is clicked", async () => {
    const user = userEvent.setup();
    render(<Header {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: /notes/i }));

    expect(defaultProps.onOpenNotes).toHaveBeenCalledTimes(1);
  });

  it("should display favorites count badge when count > 0", () => {
    render(<Header {...defaultProps} favoritesCount={5} />);

    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("should have proper accessibility attributes", () => {
    render(<Header {...defaultProps} />);

    // All buttons should have aria-labels
    expect(
      screen.getByRole("button", { name: /mute sounds/i })
    ).toHaveAttribute("aria-label");
    expect(
      screen.getByRole("button", { name: /settings/i })
    ).toHaveAttribute("aria-label");
    expect(
      screen.getByRole("button", { name: /favorites/i })
    ).toHaveAttribute("aria-label");
    expect(
      screen.getByRole("button", { name: /notes/i })
    ).toHaveAttribute("aria-label");
  });
});
