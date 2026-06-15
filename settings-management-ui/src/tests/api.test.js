import axios from "axios";

import { vi } from "vitest";

vi.mock("axios");

describe("API Test", () => {

  test("fetches data successfully", async () => {

    axios.get.mockResolvedValue({
      data: [
        {
          id: 1,
          name: "Dark Mode",
        },
      ],
    });

    const response =
      await axios.get("/settings");

    expect(response.data.length)
      .toBe(1);
  });
});