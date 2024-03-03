import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  queryByAttribute,
} from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Verify from "../../pages/VerifyEmail";

const getById = queryByAttribute.bind(null, "id");

const mockUser = {
  id: "d1bb3570-4091-7016-59df-6de1955af68d",
  email: "hxfox1@gmail.com",
  firstName: "Harry",
  lastName: "Fox",
};

// Mocking the useApp context
jest.mock("../../context/useApp", () => ({
  useApp: jest.fn(() => ({
    setUser: jest.fn(() => {}),
    setLoading: jest.fn(),
  })),
}));

// Mocking the signin function
jest.mock("../../api/auth", () => ({
  verifyConfirmationCode: jest.fn(() => ({
    data: mockUser,
  })),
}));

describe("Verify Component", () => {
  test("renders without crashing", () => {
    render(
      <Router>
        <Verify />
      </Router>
    );
  });

  test("displays error for missing code", async () => {
    const { container } = render(
      <Router>
        <Verify />
      </Router>
    );

    // Submitting form without filling email
    fireEvent.submit(getById(container, "verify-submit-btn"));

    // Expecting error message
    await waitFor(() => {
      const emailInput = getById(container, "Code");
      expect(emailInput.classList.contains("input-invalid")).toBe(true);
    });
  });
});
