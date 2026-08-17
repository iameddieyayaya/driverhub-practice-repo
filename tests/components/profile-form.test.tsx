import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ProfileForm } from "@/src/components/settings/profile-form";

const profile = { firstName: "Alex", lastName: "Morgan", profile: { phone: null, city: "Boulder", state: "CO" }, notificationPreference: { emailEnabled: true, smsEnabled: false, eventReminders: true, marketingEnabled: false } };

describe("ProfileForm", () => {
  it("submits user changes and confirms success", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ profile }), { status: 200 }));
    render(<ProfileForm initialProfile={profile} />);
    await userEvent.clear(screen.getByLabelText("City"));
    await userEvent.type(screen.getByLabelText("City"), "Denver");
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Changes saved.");
    expect(fetch).toHaveBeenCalledWith("/api/profile", expect.objectContaining({ method: "PATCH", body: expect.stringContaining("Denver") }));
  });
});
