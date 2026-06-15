import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import PreferencesPage from "../pages/PreferencesPage";

import axiosInstance from "../services/api/axios";

vi.mock("../services/api/axios", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

vi.mock("react-hot-toast", () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock("../context/ThemeContext", () => ({
  useTheme: () => ({ theme: "light" }),
}));

describe("Preferences Page", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

  test("fetches and renders user preferences", async () => {

    axiosInstance.get.mockResolvedValueOnce({
      data: {
        data: {
          uiTheme: "dark",
          notificationsEnabled: false,
          languagePreference: "Hindi",
          timeZonePreference: "UTC",
          dashboardLayoutPreference: "Compact",
        },
      },
    });

    render(<PreferencesPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/ui theme/i)).toHaveValue("dark");
    });
    expect(screen.getByRole("checkbox", { name: /enable email notifications/i })).not.toBeChecked();
    expect(screen.getByLabelText(/language preference/i)).toHaveValue("Hindi");
    expect(screen.getByLabelText(/time zone preference/i)).toHaveValue("UTC");
    expect(screen.getByLabelText(/dashboard layout preference/i)).toHaveValue("Compact");
  });

  test("saves updated preferences and refreshes from the API", async () => {

    axiosInstance.get
      .mockResolvedValueOnce({
        data: {
          data: {
            uiTheme: "light",
            notificationsEnabled: false,
            languagePreference: "English",
            timeZonePreference: "IST",
            dashboardLayoutPreference: "Standard",
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          data: {
            uiTheme: "system",
            notificationsEnabled: true,
            languagePreference: "Telugu",
            timeZonePreference: "PST",
            dashboardLayoutPreference: "Detailed",
          },
        },
      });

    axiosInstance.put.mockResolvedValueOnce({
      data: {
        data: {
          uiTheme: "system",
          notificationsEnabled: true,
          languagePreference: "Telugu",
          timeZonePreference: "PST",
          dashboardLayoutPreference: "Detailed",
        },
      },
    });

    render(<PreferencesPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/ui theme/i)).toHaveValue("light");
    });

    await userEvent.selectOptions(screen.getByLabelText(/ui theme/i), "system");
    await userEvent.click(screen.getByRole("checkbox", { name: /enable email notifications/i }));
    await userEvent.selectOptions(screen.getByLabelText(/language preference/i), "Telugu");
    await userEvent.selectOptions(screen.getByLabelText(/time zone preference/i), "PST");
    await userEvent.selectOptions(screen.getByLabelText(/dashboard layout preference/i), "Detailed");
    await userEvent.click(screen.getByRole("button", { name: /save preferences/i }));

    await waitFor(() => {
      expect(axiosInstance.put).toHaveBeenCalledWith("/api/preferences", {
        uiTheme: "system",
        notificationsEnabled: true,
        languagePreference: "Telugu",
        timeZonePreference: "PST",
        dashboardLayoutPreference: "Detailed",
      });
    });

    expect(axiosInstance.get).toHaveBeenCalledTimes(2);
    await waitFor(() => {
      expect(screen.getByLabelText(/ui theme/i)).toHaveValue("system");
    });
    expect(screen.getByLabelText(/language preference/i)).toHaveValue("Telugu");
    expect(screen.getByLabelText(/time zone preference/i)).toHaveValue("PST");
    expect(screen.getByLabelText(/dashboard layout preference/i)).toHaveValue("Detailed");
  });
});
