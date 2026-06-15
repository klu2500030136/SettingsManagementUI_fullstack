import { render, screen } from "@testing-library/react";

import Button from "../components/ui/Button";

describe("Button Component", () => {

  test("renders button text", () => {

    render(
      <Button>
        Save
      </Button>
    );

    expect(
      screen.getByText("Save")
    ).toBeInTheDocument();
  });
});