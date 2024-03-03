import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  queryByAttribute,
} from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Login from "../../pages/Login";

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
  signin: jest.fn(() => ({
    data: mockUser,
  })),
}));

describe("Login Component", () => {
  test("renders without crashing", () => {
    render(
      <Router>
        <Login />
      </Router>
    );
  });

  test("displays error for missing email", async () => {
    const { container } = render(
      <Router>
        <Login />
      </Router>
    );

    // Submitting form without filling email
    fireEvent.submit(getById(container, "login-submit-btn"));

    // Expecting error message
    await waitFor(() => {
      const emailInput = getById(container, "Email");
      expect(emailInput.classList.contains("input-invalid")).toBe(true);
    });
  });

  test("displays error for missing password", async () => {
    const { container } = render(
      <Router>
        <Login />
      </Router>
    );

    // Submitting form without filling email
    fireEvent.submit(getById(container, "login-submit-btn"));

    // Expecting error message
    await waitFor(() => {
      const emailInput = getById(container, "Password");
      expect(emailInput.classList.contains("input-invalid")).toBe(true);
    });
  });
});
