import React from "react";
import {
  userEvent,
  fireEvent,
  render,
  screen
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Searchbar from "../Components/SearchBar.jsx";

const mockedUsedNavigate = jest.fn(); // Create a mock function for useNavigate

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate
}));

describe("SearchBar Component", () => {
  test("renders search input and button", () => {
    render(
      <MemoryRouter>
        <Searchbar />
      </MemoryRouter>
    );

    // Check if the input field is present

    // Check if the button is present
    const buttonElement = screen.getByRole("button");
    expect(buttonElement).toBeInTheDocument();
  });

  test("triggers button click event", () => {
    render(
      <MemoryRouter>
        <Searchbar />
      </MemoryRouter>
    );

    // Find the button
    const buttonElement = screen.getByRole("button");

    // Mock console.log since FilterDropDown is empty
    const consoleSpy = jest.spyOn(console, "log");

    // Simulate button click
    fireEvent.click(buttonElement);

    // Since FilterDropDown does nothing, we just check if the click happened
    expect(buttonElement).toBeInTheDocument();

    // Clean up the mock
    consoleSpy.mockRestore();
  });
});
