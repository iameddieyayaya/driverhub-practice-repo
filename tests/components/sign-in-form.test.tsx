import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SignInForm } from "@/src/components/settings/sign-in-form";

const replace = vi.fn();
const refresh = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace, refresh }) }));

describe("SignInForm", () => {
  beforeEach(() => { vi.restoreAllMocks(); replace.mockClear(); refresh.mockClear(); });
  it("shows an API failure and keeps the user on the form", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ error: "Email or password is incorrect." }), { status: 401, headers: { "content-type": "application/json" } }));
    render(<SignInForm returnTo="/dashboard" />);
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Email or password is incorrect.");
    expect(replace).not.toHaveBeenCalled();
  });
  it("shows a loading state and navigates after success", async () => {
    let resolveRequest: (value: Response) => void = () => undefined;
    vi.spyOn(globalThis, "fetch").mockReturnValue(new Promise((resolve) => { resolveRequest = resolve; }));
    render(<SignInForm returnTo="/vehicles" />);
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(screen.getByRole("button", { name: /starting your drive/i })).toBeDisabled();
    resolveRequest(new Response(JSON.stringify({ user: {} }), { status: 200 }));
    expect(await screen.findByRole("button", { name: /sign in/i })).toBeEnabled();
    expect(replace).toHaveBeenCalledWith("/vehicles");
  });
});
