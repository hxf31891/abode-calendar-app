import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  queryByAttribute,
} from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Register from "../../pages/Register";

const getById = queryByAttribute.bind(null, "id");

const mockUser = {
  username: "hxfox1+988@gmail.com",
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
  register: jest.fn(() => ({
    data: mockUser,
  })),
}));

describe("Register Component", () => {
  test("renders without crashing", () => {
    render(
      <Router>
        <Register />
      </Router>
    );
  });

  test("displays error for missing email", async () => {
    const { container } = render(
      <Router>
        <Register />
      </Router>
    );

    // Submitting form without filling email
    fireEvent.submit(getById(container, "register-submit-btn"));

    // Expecting error message
    await waitFor(() => {
      const emailInput = getById(container, "Email");
      expect(emailInput.classList.contains("input-invalid")).toBe(true);
    });
  });

  test("displays error for missing password", async () => {
    const { container } = render(
      <Router>
        <Register />
      </Router>
    );

    // Submitting form without filling email
    fireEvent.submit(getById(container, "register-submit-btn"));

    // Expecting error message
    await waitFor(() => {
      const emailInput = getById(container, "Password");
      expect(emailInput.classList.contains("input-invalid")).toBe(true);
    });
  });

  test("displays error for missing firstName", async () => {
    const { container } = render(
      <Router>
        <Register />
      </Router>
    );

    // Submitting form without filling email
    fireEvent.submit(getById(container, "register-submit-btn"));

    // Expecting error message
    await waitFor(() => {
      const emailInput = getById(container, "First Name");
      expect(emailInput.classList.contains("input-invalid")).toBe(true);
    });
  });

  test("displays error for missing lastName", async () => {
    const { container } = render(
      <Router>
        <Register />
      </Router>
    );

    // Submitting form without filling email
    fireEvent.submit(getById(container, "register-submit-btn"));

    // Expecting error message
    await waitFor(() => {
      const emailInput = getById(container, "Last Name");
      expect(emailInput.classList.contains("input-invalid")).toBe(true);
    });
  });
});
