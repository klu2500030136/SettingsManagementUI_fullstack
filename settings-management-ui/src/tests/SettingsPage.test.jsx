import {
  render,
  screen,
} from "@testing-library/react";

import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";

import { vi } from "vitest";

import SettingsPage from "../pages/SettingsPage";

import axiosInstance from "../services/api/axios";

vi.mock("../services/api/axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

function renderWithStore(ui) {

  const store = configureStore({
    reducer: {
      auth: () => ({ role: "ROLE_ADMIN" }),
    },
  });

  return render(
    <Provider store={store}>
      {ui}
    </Provider>
  );
}

describe("Settings Page", () => {

  test("renders settings heading", () => {

    axiosInstance.get.mockResolvedValueOnce({
      data: {
        data: [],
      },
    });

    renderWithStore(<SettingsPage />);

    expect(
      screen.getByRole("heading", {
        name: "Settings",
      })
    ).toBeInTheDocument();
  });
});
