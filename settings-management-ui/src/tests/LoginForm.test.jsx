import {
  render,
  screen,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import LoginPage from "../features/auth/pages/LoginPage";

import { Provider } from "react-redux";

import { store } from "../store/store";

import { BrowserRouter } from "react-router-dom";

describe("Login Form", () => {

  test("allows typing into inputs", async () => {

    render(

      <Provider store={store}>

        <BrowserRouter>

          <LoginPage />

        </BrowserRouter>

      </Provider>
    );

    const emailInput =
      screen.getByPlaceholderText(/email/i);

    await userEvent.type(
      emailInput,
      "admin@test.com"
    );

    expect(emailInput).toHaveValue(
      "admin@test.com"
    );
  });
});