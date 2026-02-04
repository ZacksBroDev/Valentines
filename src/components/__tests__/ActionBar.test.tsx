import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../test/test-utils";
import { ActionBar } from "../ActionBar";

describe("ActionBar", () => {
  const defaultProps = {
    onDraw: vi.fn(),
    onSave: vi.fn(),
    onShare: vi.fn(),
    onOpenWhen: vi.fn(),
    onShuffle: vi.fn(),
    isFavorite: false,
    hasCard: true,
    canDraw: true,
    isDailyBlocked: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render all action buttons", () => {
    render(<ActionBar {...defaultProps} />);

    expect(screen.getByRole("button", { name: /draw/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /save to favorites/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /share/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /shuffle/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /open when/i })
    ).toBeInTheDocument();
  });

  it("should call onDraw when draw button is clicked", async () => {
    const user = userEvent.setup();
    render(<ActionBar {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: /draw/i }));

    expect(defaultProps.onDraw).toHaveBeenCalledTimes(1);
  });

  it("should call onSave when save button is clicked", async () => {
    const user = userEvent.setup();
    render(<ActionBar {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: /save to favorites/i }));

    expect(defaultProps.onSave).toHaveBeenCalledTimes(1);
  });

  it("should disable save button when there is no card", () => {
    render(<ActionBar {...defaultProps} hasCard={false} />);

    const saveButton = screen.getByRole("button", { name: /save to favorites/i });
    expect(saveButton).toBeDisabled();
  });

  it("should disable draw button when canDraw is false", () => {
    render(<ActionBar {...defaultProps} canDraw={false} />);

    const drawButton = screen.getByRole("button", { name: /draw/i });
    expect(drawButton).toBeDisabled();
  });

  it("should show daily blocked message", () => {
    render(<ActionBar {...defaultProps} isDailyBlocked={true} canDraw={false} />);

    expect(screen.getByText(/come back tomorrow/i)).toBeInTheDocument();
  });

  it("should show remove from favorites when card is favorited", () => {
    render(<ActionBar {...defaultProps} isFavorite={true} />);

    expect(
      screen.getByRole("button", { name: /remove from favorites/i })
    ).toBeInTheDocument();
  });

  it("should call onShuffle when shuffle button is clicked", async () => {
    const user = userEvent.setup();
    render(<ActionBar {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: /shuffle/i }));

    expect(defaultProps.onShuffle).toHaveBeenCalledTimes(1);
  });

  it("should call onOpenWhen when open when button is clicked", async () => {
    const user = userEvent.setup();
    render(<ActionBar {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: /open when/i }));

    expect(defaultProps.onOpenWhen).toHaveBeenCalledTimes(1);
  });
});
